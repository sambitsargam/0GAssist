import React, { useState } from 'react';
import StorageService from '../services/StorageService';

const ShareChat = ({ messages, onClose, signer = null }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [sessionName, setSessionName] = useState(`chat-${new Date().toLocaleString()}`);
  const [copied, setCopied] = useState(false);

  const handleUpload = async () => {
    if (!messages || messages.length === 0) {
      setError('No messages to share');
      return;
    }

    if (!signer) {
      setError('⚠️ Initializing 0G Storage... If this persists, check REACT_APP_PRIVATE_KEY in .env');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      console.log('📤 Uploading chat to 0G Storage with signer:', signer.address);
      const result = await StorageService.uploadChatSession(messages, sessionName, signer);
      
      if (result.success) {
        setUploadResult(result.data);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Failed to upload: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCopyLink = () => {
    if (uploadResult?.shareableLink) {
      navigator.clipboard.writeText(uploadResult.shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = (format) => {
    const blob = StorageService.exportChatLocal(messages, format);
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-export-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">📤 Share Chat Session</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {!uploadResult ? (
          <div className="space-y-6">
            {/* Session Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Name
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter session name"
              />
            </div>

            {/* Message Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                💬 <strong>{messages.length}</strong> messages will be uploaded to 0G Storage Testnet
              </p>
            </div>

            {/* Wallet Status */}
            <div className={`p-4 rounded-lg border ${signer ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
              {signer ? (
                <p className="text-sm text-green-700 font-medium">
                  ✅ Signer ready: {signer.address?.slice(0, 6)}...{signer.address?.slice(-4)}
                </p>
              ) : (
                <p className="text-sm text-blue-700 font-medium">
                  ⏳ Loading signer from REACT_APP_PRIVATE_KEY...
                </p>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">❌ {error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
                title="Upload chat to 0G Storage network"
              >
                {uploading ? '⏳ Uploading to 0G Storage...' : '☁️ Upload to 0G Storage'}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('json')}
                  className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
                  title="Export as JSON"
                >
                  JSON
                </button>
                <button
                  onClick={() => handleExport('txt')}
                  className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
                  title="Export as Text"
                >
                  TXT
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
                  title="Export as CSV"
                >
                  CSV
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 mb-2">
                ℹ️ <strong>0G Storage Sharing:</strong>
              </p>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>✅ <strong>Export</strong> - Save chat locally (always works)</li>
                <li>☁️ <strong>0G Storage</strong> - Decentralized share link (requires wallet)</li>
              </ul>
            </div>
          </div>
        ) : (
          // Success View
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-semibold">✅ Upload Successful!</p>
            </div>

            {/* Upload Details */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-600">Session Name</label>
                <p className="text-gray-900 font-mono text-sm break-all">{uploadResult.sessionName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Root Hash (File ID)</label>
                <p className="text-gray-900 font-mono text-sm break-all">{uploadResult.rootHash}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Transaction Hash</label>
                <p className="text-gray-900 font-mono text-sm break-all">{uploadResult.transactionHash}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">File Size</label>
                  <p className="text-gray-900">{uploadResult.fileSize} bytes</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Uploaded At</label>
                  <p className="text-gray-900">{new Date(uploadResult.uploadedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Shareable Link */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                📎 Shareable Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={uploadResult.shareableLink}
                  className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg font-mono text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 text-sm text-gray-600">
              <p>💾 <strong>Data Persistence:</strong> Your chat is now stored on 0G Storage Testnet</p>
              <p>🔐 <strong>Root Hash:</strong> Use this to retrieve your chat session anytime</p>
              <p>🌍 <strong>Network:</strong> Testnet - For testing and development</p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareChat;
