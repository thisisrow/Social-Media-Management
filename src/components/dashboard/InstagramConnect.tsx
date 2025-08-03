import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Instagram, Shield, Zap, MessageSquare } from 'lucide-react';

export default function InstagramConnect() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { connectInstagram } = useAuth();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await connectInstagram(username);
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <Instagram className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Connect Your Instagram
          </h1>
          <p className="text-gray-600">
            Link your Instagram account to start managing posts with AI
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <Shield className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-purple-800">Secure OAuth connection</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
            <Zap className="w-5 h-5 text-pink-600" />
            <span className="text-sm text-pink-800">AI-powered automation</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <span className="text-sm text-indigo-800">Smart comment replies</span>
          </div>
        </div>

        <form onSubmit={handleConnect} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="your_username"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !username}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Connecting to Instagram...
              </div>
            ) : (
              'Connect Instagram Account'
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This is a demo interface. In production, you would use Instagram's official API with proper OAuth authentication.
          </p>
        </div>
      </div>
    </div>
  );
}