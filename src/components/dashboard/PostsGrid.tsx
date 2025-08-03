import React from 'react';
import { usePosts } from '../../contexts/PostContext';
import { Heart, MessageCircle, Bot, NutOff as BotOff } from 'lucide-react';

export default function PostsGrid() {
  const { posts, toggleAI } = usePosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Posts</h2>
        <div className="text-sm text-gray-600">
          {posts.length} posts
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => toggleAI(post.id)}
                className={`absolute top-3 right-3 p-2 rounded-full ${
                  post.aiEnabled
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white'
                } hover:scale-110 transition-transform duration-200`}
              >
                {post.aiEnabled ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <BotOff className="w-4 h-4" />
                )}
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-gray-800 mb-3 line-clamp-2">{post.caption}</p>
              
              <div className="flex items-center justify-between text-gray-600 text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {post.timestamp.toLocaleDateString()}
                </div>
              </div>
              
              {post.aiEnabled && (
                <div className="mt-3 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium inline-flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  AI Replies Active
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}