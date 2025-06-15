import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useStory } from '../contexts/StoryContext';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Loader2 } from 'lucide-react';

const genres = ['Sci-Fi', 'Fantasy', 'Mystery', 'Romance', 'Horror', 'Adventure'];

export function CreateStory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { connected } = useWallet();
  const { createStory, forkStory, getStory } = useStory();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [genre, setGenre] = useState(genres[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const forkId = searchParams.get('fork');
  const continueId = searchParams.get('continue');
  const parentStory = forkId ? getStory(forkId) : continueId ? getStory(continueId) : null;
  
  useEffect(() => {
    if (parentStory) {
      setGenre(parentStory.genre);
      if (continueId) {
        setTitle(`${parentStory.title} - Continued`);
      } else if (forkId) {
        setTitle(`${parentStory.title} - Fork`);
      }
    }
  }, [parentStory, continueId, forkId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) return;
    
    setIsSubmitting(true);
    try {
      const storyRequest = { title, content, genre };
      
      let storyId: string;
      if (forkId) {
        storyId = await forkStory(forkId, storyRequest);
      } else if (continueId) {
        storyId = await createStory({ ...storyRequest, parentId: continueId });
      } else {
        storyId = await createStory(storyRequest);
      }
      
      navigate(`/story/${storyId}`);
    } catch (error) {
      console.error('Error creating story:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!connected) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-6">
            You need to connect your wallet to create or contribute to stories.
          </p>
          <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6">
          {forkId ? 'Fork Story' : continueId ? 'Continue Story' : 'Create New Story'}
        </h1>
        
        {parentStory && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6 border border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-2">
              {forkId ? 'Forking from:' : 'Continuing from:'}
            </h3>
            <h4 className="text-blue-400 font-medium">{parentStory.title}</h4>
            <p className="text-gray-300 text-sm mt-2">
              {parentStory.content.substring(0, 200)}...
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Story Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your story title..."
            />
          </div>
          
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-2">
              Genre
            </label>
            <select
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {genres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
              Story Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your story here..."
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>
                {isSubmitting ? 'Publishing...' : 'Publish Story'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
