import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { Heart, MessageCircle, Bot, NutOff as BotOff } from 'lucide-react';

const API_BASE = 'https://shortlisting-task-1-ten.vercel.app';

/** ----- Types matching server /posts ----- */
type Comment = {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  isMine?: boolean;
};

type Post = {
  id: string;
  caption: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | string;
  imageUrl: string;
  permalink: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  comments: Comment[];
  aiEnabled?: boolean;
};

type NewCommentEvt = { postId?: string; verb?: 'add' | 'remove' | string; comment?: Comment };
type EngagementEvt = { postId: string; likes: number; commentsCount: number };
type MediaNewEvt = { post: Post };
type MediaRemovedEvt = { postId: string };

export default function PostsGrid(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const socketRef = useRef<Socket | null>(null);

  // Initial load
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await axios.get<{ success: boolean; data: Post[] }>(`${API_BASE}/posts`);
        if (!alive) return;
        const data = res.data?.data ?? [];
        setPosts(data.map(p => ({ ...p, aiEnabled: false })));
      } catch (e) {
        console.error('load posts failed', e);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Live updates
  useEffect(() => {
    const socket = io(API_BASE, { transports: ['websocket','polling'] });
    socketRef.current = socket;

    socket.on('ig:new_comment', (evt: NewCommentEvt) => {
      const { postId, comment, verb } = evt || {};
      if (!postId || !comment) return;

      setPosts(prev => prev.map(p => {
        if (p.id !== postId) return p;
        const exists = p.comments?.some(c => c.id === comment.id);
        let comments = p.comments || [];
        if (verb === 'remove') {
          comments = comments.filter(c => c.id !== comment.id);
        } else if (!exists) {
          comments = [comment, ...comments];
        }
        const delta = verb === 'remove' ? -1 : (exists ? 0 : 1);
        return { ...p, comments, commentsCount: Math.max(0, p.commentsCount + delta) };
      }));
    });

    socket.on('ig:engagement_update', (evt: EngagementEvt) => {
      setPosts(prev => prev.map(p => p.id === evt.postId ? { ...p, likes: evt.likes, commentsCount: evt.commentsCount } : p));
    });

    socket.on('ig:media_new', (evt: MediaNewEvt) => {
      const post = evt.post;
      setPosts(prev => {
        if (prev.some(p => p.id === post.id)) return prev;
        return [{ ...post, aiEnabled: false }, ...prev];
      });
    });

    socket.on('ig:media_removed', (evt: MediaRemovedEvt) => {
      setPosts(prev => prev.filter(p => p.id !== evt.postId));
    });

    return () => {
      socket.removeAllListeners();
      socket.close();
    };
  }, []);

  const toggleAI = (id: string) =>
    setPosts(prev => prev.map(p => (p.id === id ? { ...p, aiEnabled: !p.aiEnabled } : p)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Posts</h2>
        <div className="text-sm text-gray-600">{posts.length} posts</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              <img src={post.imageUrl} alt={post.caption || 'Post'} className="w-full h-64 object-cover" />
              <button
                onClick={() => toggleAI(post.id)}
                className={`absolute top-3 right-3 p-2 rounded-full ${post.aiEnabled ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'} hover:scale-110 transition-transform duration-200`}
                aria-label={post.aiEnabled ? 'Disable AI replies' : 'Enable AI replies'}
              >
                {post.aiEnabled ? <Bot className="w-4 h-4" /> : <BotOff className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-4">
              <p className="text-gray-800 mb-3 line-clamp-2">{post.caption}</p>

              <div className="flex items-center justify-between text-gray-600 text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1"><Heart className="w-4 h-4" /><span>{post.likes}</span></div>
                  <div className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /><span>{post.commentsCount}</span></div>
                </div>
                <div className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleDateString()}</div>
              </div>

              {post.comments?.length > 0 && (
                <ul className="mt-3 space-y-1 max-h-24 overflow-y-auto text-sm">
                  {post.comments.slice(0, 5).map(c => (
                    <li key={c.id} className={c.isMine ? 'text-blue-700' : 'text-gray-700'}>
                      <span className="font-medium">@{c.username}</span>: {c.text}
                    </li>
                  ))}
                </ul>
              )}

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
