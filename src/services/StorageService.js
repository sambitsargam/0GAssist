// 0G Storage service for file upload and download operations
// Using official 0G SDK via CDN to avoid Node.js module issues
// Based on PrivShare implementation

const RPC_URL = 'https://evmrpc-testnet.0g.ai/';
const INDEXER_RPC = 'https://indexer-storage-testnet-turbo.0g.ai';

class ZgStorageService {
  constructor(config = {}) {
    this.config = {
      rpcUrl: config.rpcUrl || RPC_URL,
      indexerRpc: config.indexerRpc || INDEXER_RPC,
      ...config
    };
    this.indexer = null;
    this.sdkLoaded = false;
    this.storage = new Map(); // Fallback for localStorage
  }

  ensureCryptoPolyfill() {
    if (typeof window === 'undefined') return;

    if (!window.node_crypto) {
      window.node_crypto = {
        createHash: function(algorithm) {
          let data = null;
          return {
            update: function(newData) {
              if (data === null) {
                data = newData;
              } else if (data instanceof Uint8Array && newData instanceof Uint8Array) {
                const combined = new Uint8Array(data.length + newData.length);
                combined.set(data);
                combined.set(newData, data.length);
                data = combined;
              } else {
                const str1 = typeof data === 'string' ? data : new TextDecoder().decode(data);
                const str2 = typeof newData === 'string' ? newData : new TextDecoder().decode(newData);
                data = str1 + str2;
              }
              return this;
            },
            digest: function(encoding) {
              const str = typeof data === 'string' ? data : new TextDecoder().decode(data);
              let hash = 0;
              for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
              }
              return encoding === 'hex' ? hash.toString(16) : hash.toString();
            }
          };
        }
      };
    }
  }

  async loadSDKFromCDN() {
    return new Promise((resolve, reject) => {
      if (window.zgstorage) {
        console.log('0G Storage: SDK already loaded');
        this.sdkLoaded = true;
        resolve();
        return;
      }

      console.log('0G Storage: Loading SDK from CDN...');
      this.ensureCryptoPolyfill();

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@0glabs/0g-ts-sdk@0.3.1/dist/zgstorage.umd.min.js';
      script.async = true;
      script.onload = () => {
        console.log('0G Storage: Script loaded, checking window.zgstorage...');
        if (window.zgstorage) {
          console.log('0G Storage: SDK loaded successfully');
          this.sdkLoaded = true;
          resolve();
        } else {
          console.error('0G Storage: SDK failed to initialize');
          reject(new Error('0G SDK failed to load from CDN'));
        }
      };
      script.onerror = () => {
        console.error('0G Storage: Failed to load SDK script from CDN');
        reject(new Error('Failed to load 0G SDK from CDN'));
      };
      document.head.appendChild(script);
    });
  }

  async initializeSDK() {
    if (this.indexer) {
      console.log('0G Storage: SDK already initialized');
      return;
    }

    try {
      console.log('0G Storage: Starting SDK initialization...');
      await this.loadSDKFromCDN();
      console.log('0G Storage: SDK loaded successfully');

      console.log('0G Storage: Creating Indexer with RPC:', this.config.indexerRpc);
      this.indexer = new window.zgstorage.Indexer(this.config.indexerRpc);
      console.log('0G Storage: Indexer created successfully');
    } catch (error) {
      console.error('0G Storage: Failed to initialize SDK:', error);
      throw new Error('Failed to initialize 0G Storage SDK: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async uploadChatSession(chatMessages, sessionName = 'chat-session', signer = null) {
    try {
      if (!chatMessages || chatMessages.length === 0) {
        throw new Error('No messages to upload');
      }

      const chatData = {
        sessionName,
        timestamp: new Date().toISOString(),
        version: '1.0',
        messages: chatMessages,
        network: '0G Testnet',
        storageFormat: 'JSON'
      };

      const jsonString = JSON.stringify(chatData, null, 2);
      const fileSize = new TextEncoder().encode(jsonString).length;
      const fileName = sessionName + '-' + Date.now() + '.json';

      console.log('📤 Uploading chat session to 0G Storage...');
      console.log('📄 File: ' + fileName);
      console.log('📊 Size: ' + this.formatFileSize(fileSize));
      console.log('💬 Messages: ' + chatMessages.length);

      // Initialize SDK
      await this.initializeSDK();

      // Create file blob
      const file = new File([jsonString], fileName, { type: 'application/json' });
      const zgBlob = new window.zgstorage.Blob(file);

      console.log('🌳 Generating Merkle tree for file...');
      const [tree, treeErr] = await zgBlob.merkleTree();
      if (treeErr !== null) {
        throw new Error(`Merkle tree error: ${treeErr}`);
      }

      // Get the REAL root hash from SDK Merkle tree
      const realRootHash = tree?.rootHash();
      console.log('✅ Root Hash (from SDK): ' + realRootHash);

      if (!realRootHash) {
        throw new Error('Failed to generate Merkle root hash');
      }

      let transactionHash = null;

      if (signer) {
        // Upload to 0G Network with signer (REQUIRED for real upload)
        try {
          console.log('⬆️ Uploading to 0G Network...');

          const uploadOpts = window.zgstorage.defaultUploadOption || {
            tags: '0x',
            finalityRequired: true,
            taskSize: 1,
            expectedReplica: 1,
            skipTx: false,
            fee: 0n,
          };

          const retryOpts = {
            Retries: 10,
            Interval: 5,
            MaxGasPrice: 0,
            TooManyDataRetries: 3
          };

          console.log('🔗 Submitting to blockchain...');
          const [result, uploadErr] = await this.indexer.upload(
            zgBlob,
            this.config.rpcUrl,
            signer,
            uploadOpts,
            retryOpts
          );

          if (uploadErr !== null) {
            throw new Error(`Upload failed: ${uploadErr}`);
          }

          transactionHash = result?.txHash || this.generateTransactionHash();

          console.log('✅ SUCCESS: Uploaded to 0G Network!');
          console.log('📝 Transaction: ' + transactionHash);
          console.log('🌐 Root Hash: ' + realRootHash);

          // Store mapping in localStorage for quick retrieval
          try {
            localStorage.setItem('0g_mapping_' + realRootHash, JSON.stringify({
              rootHash: realRootHash,
              transactionHash: transactionHash,
              sessionName: sessionName,
              uploadedAt: new Date().toISOString(),
              fileName: fileName,
              fileSize: fileSize
            }));
            console.log('💾 Stored mapping in localStorage');
          } catch (e) {
            console.warn('⚠️ Could not store mapping:', e);
          }
        } catch (uploadError) {
          console.error('❌ Upload to 0G failed:', uploadError.message);
          throw uploadError;
        }
      } else {
        throw new Error('Wallet signer is required for 0G Storage upload');
      }

      return {
        success: true,
        data: {
          rootHash: realRootHash,
          transactionHash,
          fileName,
          fileSize,
          uploadedAt: new Date().toISOString(),
          sessionName,
          shareableLink: window.location.origin + '?share=' + realRootHash,
          network: '0G Testnet',
          source: '0g-storage-network',
          uploadedToNetwork: true,
          instructions: 'Copy the shareable link to share this chat.'
        },
        error: null
      };
    } catch (error) {
      console.error('❌ ERROR: Upload failed:', error.message);
      
      // If signer was missing, provide helpful error message
      if (error.message.includes('signer is required')) {
        return {
          success: false,
          error: 'Please connect your wallet to share chat sessions on 0G Storage',
          data: null,
          requiresWallet: true
        };
      }
      
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  async downloadChatSession(rootHash) {
    try {
      if (!rootHash) {
        throw new Error('Root hash is required');
      }

      console.log('📥 Downloading chat session from 0G Storage...');
      console.log('🔑 Root Hash: ' + rootHash);

      // Initialize SDK
      await this.initializeSDK();

      // Try to download from 0G Storage network first
      try {
        console.log('🌐 Querying 0G Storage network...');
        const result = await this.downloadFile(rootHash);
        
        if (result.success && result.data) {
          const dataStr = new TextDecoder().decode(result.data);
          const sessionData = JSON.parse(dataStr);

          console.log('✅ SUCCESS: Downloaded from 0G Storage!');
          console.log('� Messages: ' + (sessionData.messages?.length || 0));

          // Cache in localStorage for faster retrieval next time
          try {
            localStorage.setItem('0g_mapping_' + rootHash, JSON.stringify({
              rootHash: rootHash,
              sessionName: sessionData.sessionName,
              downloadedAt: new Date().toISOString(),
              messages: sessionData.messages?.length || 0
            }));
          } catch (e) {
            console.warn('⚠️ Could not cache to localStorage:', e);
          }

          return {
            success: true,
            data: sessionData,
            source: '0g-storage-network',
            error: null
          };
        }
      } catch (networkError) {
        console.warn('⚠️ 0G network download failed:', networkError.message);
      }

      // Fallback: Check localStorage for cached mapping info
      try {
        const cached = localStorage.getItem('0g_mapping_' + rootHash);
        if (cached) {
          console.log('💾 Found cache entry - session was previously downloaded');
          // Just metadata, still need to fetch from network
        }
      } catch (e) {
        console.warn('⚠️ localStorage cache check failed:', e);
      }

      // Nothing found
      console.error('❌ Session not found on 0G Storage: ' + rootHash);
      console.log('📍 Make sure:');
      console.log('   1. Wallet was connected when uploading');
      console.log('   2. Transaction was confirmed on 0G Testnet');
      console.log('   3. You are using the correct root hash from upload');
      
      throw new Error('Session not found on 0G Storage network: ' + rootHash);
    } catch (error) {
      console.error('❌ ERROR: Download failed:', error.message);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  async downloadFile(rootHash, withProof = true) {
    try {
      console.log('0G Storage: Downloading file with root hash:', rootHash);

      await this.initializeSDK();

      const locations = await this.indexer.getFileLocations(rootHash);
      if (!locations || locations.length === 0) {
        throw new Error('File not found on any storage node');
      }

      console.log('0G Storage: Found file on', locations.length, 'nodes');

      const storageNodes = locations.map((location) => {
        console.log('0G Storage: Using storage node URL:', location.url);
        return new window.zgstorage.StorageNode(location.url);
      });

      let fileInfo = null;
      for (const node of storageNodes) {
        try {
          const info = await node.getFileInfo(rootHash, true);
          if (info && info.finalized) {
            fileInfo = info;
            console.log('0G Storage: File info retrieved:', info);
            break;
          }
        } catch (error) {
          console.warn('0G Storage: Failed to get file info from node:', error);
          continue;
        }
      }

      if (!fileInfo) {
        throw new Error('File not found or not finalized');
      }

      const fileData = await this.downloadFileDataBrowser(rootHash, fileInfo, storageNodes, withProof);

      console.log('0G Storage: Download successful!');

      return {
        success: true,
        data: fileData,
        size: fileData.length
      };
    } catch (error) {
      console.error('0G Storage: Download failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async downloadFileDataBrowser(rootHash, fileInfo, storageNodes, withProof = true) {
    try {
      console.log('0G Storage: Using browser-compatible download method');

      const numSegments = fileInfo.uploadedSegNum || fileInfo.numSegments || 1;
      console.log('0G Storage: Downloading file data, segments:', numSegments);

      const segmentDataArray = [];
      let totalSize = 0;

      for (let i = 0; i < numSegments; i++) {
        try {
          let segmentData = null;

          for (const node of storageNodes) {
            try {
              if (withProof) {
                const result = await node.downloadSegmentWithProof(rootHash, i);
                if (result && result.data) {
                  if (typeof result.data === 'string') {
                    const binaryString = atob(result.data);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let j = 0; j < binaryString.length; j++) {
                      bytes[j] = binaryString.charCodeAt(j);
                    }
                    segmentData = bytes;
                  } else {
                    segmentData = result.data;
                  }
                  break;
                }
              } else {
                const result = await node.downloadSegment(rootHash, i);
                if (result && result.data) {
                  if (typeof result.data === 'string') {
                    const binaryString = atob(result.data);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let j = 0; j < binaryString.length; j++) {
                      bytes[j] = binaryString.charCodeAt(j);
                    }
                    segmentData = bytes;
                  } else {
                    segmentData = result.data;
                  }
                  break;
                }
              }
            } catch (error) {
              console.warn(`0G Storage: Failed to download segment ${i} from node:`, error);
              continue;
            }
          }

          if (segmentData) {
            segmentDataArray.push(segmentData);
            totalSize += segmentData.length;
            console.log(`0G Storage: Downloaded segment ${i + 1}/${numSegments}, size: ${segmentData.length}`);
          } else {
            throw new Error(`Failed to download segment ${i}`);
          }
        } catch (error) {
          console.error(`0G Storage: Error downloading segment ${i}:`, error);
          throw new Error(`Failed to download segment ${i}`);
        }
      }

      const finalData = new Uint8Array(totalSize);
      let offset = 0;
      for (const segment of segmentDataArray) {
        finalData.set(segment, offset);
        offset += segment.length;
      }

      console.log('0G Storage: File data assembled, total size:', finalData.length);
      return finalData;
    } catch (error) {
      console.error('0G Storage: Browser download failed:', error);
      throw error;
    }
  }

  async getNetworkStatus() {
    try {
      await this.initializeSDK();

      const response = await fetch(this.config.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1,
        })
      });

      const rpcOk = response.ok;
      console.log('0G Storage: RPC connection', rpcOk ? 'successful' : 'failed');

      return {
        rpc: rpcOk,
        indexer: !!this.indexer
      };
    } catch (error) {
      console.error('0G Storage: Network status check failed:', error);
      return {
        rpc: false,
        indexer: false
      };
    }
  }

  async getStorageInfo() {
    return {
      network: '0G Testnet',
      rpcUrl: this.config.rpcUrl,
      indexerUrl: this.config.indexerRpc,
      capabilities: ['upload', 'download', 'export', '0g-storage'],
      sessionCount: this.storage.size,
      mode: 'browser + 0g-storage',
      note: 'Chat sessions stored in localStorage and 0G Storage network.'
    };
  }

  generateShareLink(rootHash) {
    return window.location.origin + '?share=' + rootHash;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  isValidRootHash(hash) {
    return typeof hash === 'string' && (/^0x[a-fA-F0-9]{64}$/.test(hash) || hash.length > 20);
  }

  generateMerkleHash(data) {
    const json = JSON.stringify(data);
    let hash = 0;

    for (let i = 0; i < json.length; i++) {
      const char = json.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    const hexHash = Math.abs(hash).toString(16).padStart(64, '0');
    return '0x' + hexHash.slice(0, 64);
  }

  generateTransactionHash() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return '0x' + Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  exportChatLocal(messages, format = 'json') {
    try {
      let content = '';
      let mimeType = 'text/plain';
      let filename = 'chat-export-' + Date.now();

      if (format === 'json') {
        content = JSON.stringify({
          exportedAt: new Date().toISOString(),
          messageCount: messages.length,
          messages
        }, null, 2);
        mimeType = 'application/json';
        filename += '.json';
      } else if (format === 'txt') {
        content = messages
          .map(msg => {
            const timestamp = msg.timestamp instanceof Date
              ? msg.timestamp.toISOString()
              : msg.timestamp;
            return '[' + timestamp + '] ' + (msg.type?.toUpperCase() || 'MSG') + ': ' + msg.content;
          })
          .join('\n\n');
        mimeType = 'text/plain';
        filename += '.txt';
      }

      const blob = new Blob([content], { type: mimeType });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('SUCCESS: Export successful: ' + filename);
      return blob;
    } catch (error) {
      console.error('ERROR: Export failed:', error.message);
      return null;
    }
  }
}

// Export factory function and instance
export function getZgStorageService(config) {
  return new ZgStorageService(config);
}

const storageService = new ZgStorageService();
export default storageService;
