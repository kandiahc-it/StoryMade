import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { Story } from '../types/story';
import { useStory } from '../contexts/StoryContext';
import { 
  Heart, 
  GitBranch, 
  Clock, 
  User, 
  Users, 
  Sparkles,
  ExternalLink,
  UserPlus
} from 'lucide-react';

interface StoryCardProps {
  story: Story;
  showActions?: boolean;
}

export function StoryCard({ story, showActions = true }: StoryCardProps) {
  const { connected, publicKey } = useWallet();
  const { upvoteStory, requestCollaboration, getVotingPower } = useStory();

  const isAuthor = publicKey && story.author === publicKey.toString();
  const isCoAuthor = publicKey && story.coAuthors?.includes(publicKey.toString());
  const canEdit = isAuthor || isCoAuthor;
  
  const votingPower = publicKey ? getVotingPower(publicKey.toString()) : 1;

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!connected) return;
    try {
      await upvoteStory(story.id);
    } catch (error) {
      console.error('Error upvoting story:', error);
    }
  };

  const handleCollabRequest = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!connected || canEdit) return;
    try {
      await requestCollaboration(story.id);
    } catch (error) {
      console.error('Error requesting collaboration:', error);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded">
                {story.genre}
              </span>
              {story.isNftMinted && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-600 text-white rounded flex items-center space-x-1">
                  <Sparkles className="h-3 w-3" />
                  <span>NFT</span>
                </span>
              )}
              {story.parentId && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-600 text-white rounded flex items-center space-x-1">
                  <GitBranch className="h-3 w-3" />
                  <span>Fork</span>
                </span>
              )}
            </div>
            
            <Link to={`/story/${story.id}`} className="block group">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                {story.title}
              </h3>
            </Link>
            
            <p className="text-gray-300 text-sm line-clamp-3 mb-4">
              {story.content.substring(0, 150)}...
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{truncateAddress(story.author)}</span>
            </div>
            
            {story.coAuthors && story.coAuthors.length > 0 && (
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>+{story.coAuthors.length}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatTimeAgo(story.timestamp)}</span>
            </div>
          </div>
          
          {story.xpEarned && (
            <div className="text-yellow-400 font-medium">
              +{story.xpEarned} XP
            </div>
          )}
        </div>
        
        {showActions && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleUpvote}
                disabled={!connected}
                className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
              >
                <Heart className="h-4 w-4" />
                <span>{story.votes}</span>
                {votingPower > 1 && (
                  <span className="text-xs text-blue-400">({votingPower}x)</span>
                )}
              </button>
              
              <Link
                to={`/create?fork=${story.id}`}
                className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors"
              >
                <GitBranch className="h-4 w-4" />
                <span>Fork</span>
              </Link>
              
              <Link
                to={`/create?continue=${story.id}`}
                className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Continue</span>
              </Link>
            </div>
            
            {connected && !canEdit && (
              <button
                onClick={handleCollabRequest}
                className="flex items-center space-x-1 text-gray-400 hover:text-purple-400 transition-colors text-sm"
              >
                <UserPlus className="h-4 w-4" />
                <span>Collaborate</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
