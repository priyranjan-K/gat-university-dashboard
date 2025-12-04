import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { GalleryItem, User } from '../types';
import { Heart, MessageCircle, ThumbsDown, Send, Loader2 } from 'lucide-react';
import '../styles/Gallery.css';

interface GalleryProps {
  currentUser: User;
}

const Gallery: React.FC<GalleryProps> = ({ currentUser }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const data = await api.getGallery();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleInteraction = async (id: string, type: 'like' | 'dislike') => {
    if (currentUser.role !== 'student') {
      alert("Only students can interact with the gallery!");
      return;
    }

    // Optimistic UI Update
    setItems(current => current.map(item => {
      if (item.id !== id) return item;
      
      let newLikes = item.likes;
      let newDislikes = item.dislikes;
      let newReaction = item.userReaction;

      if (item.userReaction === type) {
         // Untoggle
         newReaction = null;
         if (type === 'like') newLikes--;
         else newDislikes--;
      } else {
         // Toggle new
         if (item.userReaction === 'like') newLikes--;
         if (item.userReaction === 'dislike') newDislikes--;
         newReaction = type;
         if (type === 'like') newLikes++;
         else newDislikes++;
      }

      return { ...item, likes: newLikes, dislikes: newDislikes, userReaction: newReaction };
    }));

    await api.interactGallery(id, type);
  };

  const handleComment = async (id: string) => {
    if (currentUser.role !== 'student') {
      alert("Only students can comment!");
      return;
    }
    const text = commentText[id];
    if (!text?.trim()) return;

    try {
      const updatedItem = await api.commentGallery(id, text, currentUser.name);
      setItems(items.map(i => i.id === id ? updatedItem : i));
      setCommentText(prev => ({ ...prev, [id]: '' }));
    } catch (e) {
      alert("Failed to post comment");
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campus Gallery</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Life at VTU University.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="gallery-card">
            <div className="relative h-64">
              <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <h3 className="text-white font-bold text-lg">{item.title}</h3>
              </div>
            </div>
            
            {/* Actions Bar */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex gap-4">
                <button 
                  onClick={() => handleInteraction(item.id, 'like')}
                  className={`gallery-action-btn ${item.userReaction === 'like' ? 'text-pink-600' : 'text-gray-500 dark:text-gray-400 hover:text-pink-500'}`}
                >
                  <Heart className={`h-5 w-5 ${item.userReaction === 'like' ? 'fill-current' : ''}`} />
                  {item.likes}
                </button>
                <button 
                  onClick={() => handleInteraction(item.id, 'dislike')}
                  className={`gallery-action-btn ${item.userReaction === 'dislike' ? 'text-red-600' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`}
                >
                  <ThumbsDown className={`h-5 w-5 ${item.userReaction === 'dislike' ? 'fill-current' : ''}`} />
                  {item.dislikes}
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
                <MessageCircle className="h-5 w-5" />
                {item.comments.length}
              </div>
            </div>

            {/* Comments Section */}
            <div className="gallery-comment-area">
              <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                {item.comments.length === 0 && <p className="text-xs text-gray-400 italic">No comments yet.</p>}
                {item.comments.map(c => (
                  <div key={c.id} className="text-sm">
                    <span className="font-semibold text-gray-900 dark:text-gray-200 mr-2">{c.user}</span>
                    <span className="text-gray-600 dark:text-gray-400">{c.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-auto flex gap-2">
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  className="flex-1 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-4 py-2 focus:outline-none focus:border-indigo-500 dark:text-white"
                  value={commentText[item.id] || ''}
                  onChange={(e) => setCommentText({ ...commentText, [item.id]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleComment(item.id)}
                />
                <button 
                  onClick={() => handleComment(item.id)}
                  className="p-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;