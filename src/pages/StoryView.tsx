import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStory } from '../contexts/StoryContext';
import { Heart, GitBranch, Clock, User, PenTool } from 'lucide-react';

export function StoryView() {
  const { id } = useParams<{ id: string }>();
  const { getStory, getStoryTree, upvoteStory, stories } = useStory();
  
  if (!id) return <div>Story not found</div>;
  
  const story = getStory(id);
  const storyTree = getStoryTree(id);
  const children = stories.filter(s => s.parentId === id);
  
  if (!story) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Story Not Found</h1>
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleUpvote = async () => {
    await upvoteStory(story.id);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{story.title}</h1>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
              {story.genre}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleUpvote}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span>{story.votes}</span>
            </button>
            
            <Link
              to={`/create?fork=${story.id}`}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <GitBranch className="h-4 w-4" />
              <span>Fork</span>
            </Link>
            
            <Link
              to={`/create?continue=${story.id}`}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <PenTool className="h-4 w-4" />
              <span>Continue</span>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm text-gray-400 mb-6">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{truncateAddress(story.author)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{formatDate(story.timestamp)}</span>
          </div>
          {story.parentId && (
            <div className="flex items-center space-x-2">
              <GitBranch className="h-4 w-4" />
              <Link to={`/story/${story.parentId}`} className="text-blue-400 hover:text-blue-300">
                View Parent
              </Link>
            </div>
          )}
        </div>
        
        <div className="prose prose-invert max-w-none">
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {story.content}
          </div>
        </div>
      </div>
      
      {children.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Story Branches</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {children.map(child => (
              <Link
                key={child.id}
                to={`/story/${child.id}`}
                className="block bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-700"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{child.title}</h3>
                <p className="text-gray-300 text-sm mb-2">
                  {child.content.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>by {truncateAddress(child.author)}</span>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-3 w-3" />
                    <span>{child.votes}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
