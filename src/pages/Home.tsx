import React, { useState, useMemo } from 'react';
import { StoryCard } from '../components/StoryCard';
import { StoryFilter } from '../components/StoryFilter';
import { useStory } from '../contexts/StoryContext';
import { StoryFilter as FilterType } from '../types/story';

export function Home() {
  const { stories } = useStory();
  const [filter, setFilter] = useState<FilterType>({
    sortBy: 'recent'
  });

  const filteredStories = useMemo(() => {
    let filtered = stories.filter(story => !story.parentId); // Only show root stories
    
    if (filter.genre) {
      filtered = filtered.filter(story => story.genre === filter.genre);
    }
    
    switch (filter.sortBy) {
      case 'votes':
        return filtered.sort((a, b) => b.votes - a.votes);
      case 'trending':
        // Simple trending algorithm: votes per day
        return filtered.sort((a, b) => {
          const aTrending = a.votes / Math.max(1, (Date.now() - a.timestamp) / (1000 * 60 * 60 * 24));
          const bTrending = b.votes / Math.max(1, (Date.now() - b.timestamp) / (1000 * 60 * 60 * 24));
          return bTrending - aTrending;
        });
      case 'recent':
      default:
        return filtered.sort((a, b) => b.timestamp - a.timestamp);
    }
  }, [stories, filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Discover Stories
        </h1>
        <p className="text-gray-400">
          Explore collaborative stories written by the community
        </p>
      </div>
      
      <StoryFilter filter={filter} onFilterChange={setFilter} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStories.map(story => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
      
      {filteredStories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No stories found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
