import React from 'react';
import { Handle, Position } from 'reactflow';
import { Link } from 'react-router-dom';
import { Story } from '../types/story';
import { Heart, User, Clock } from 'lucide-react';

interface StoryNodeProps {
  data: {
    story: Story;
    isHighlighted: boolean;
  };
}

export function StoryNode({ data }: StoryNodeProps) {
  const { story, isHighlighted } = data;

  return (
    <div className={`
      relative p-4 rounded-lg border-2 bg-gray-800 min-w-48 max-w-64
      ${isHighlighted 
        ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' 
        : 'border-gray-600'
      }
    `}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500"
      />
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300 truncate">
              {story.author.slice(0, 8)}...
            </span>
          </div>
          {isHighlighted && (
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          )}
        </div>
        
        <Link 
          to={`/story/${story.id}`}
          className="block hover:text-blue-400 transition-colors"
        >
          <h3 className="font-semibold text-white text-sm leading-tight">
            {story.title}
          </h3>
        </Link>
        
        <p className="text-xs text-gray-400 line-clamp-2">
          {story.content.slice(0, 80)}...
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Heart className="w-3 h-3" />
            <span>{story.votes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{new Date(story.timestamp).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
}
