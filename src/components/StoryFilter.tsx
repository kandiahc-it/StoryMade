import React from 'react';
import { StoryFilter as FilterType } from '../types/story';

interface StoryFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const genres = ['All', 'Sci-Fi', 'Fantasy', 'Mystery', 'Romance', 'Horror', 'Adventure'];
const sortOptions = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'votes', label: 'Most Voted' },
  { value: 'trending', label: 'Trending' },
] as const;

export function StoryFilter({ filter, onFilterChange }: StoryFilterProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Genre
          </label>
          <select
            value={filter.genre || 'All'}
            onChange={(e) => onFilterChange({
              ...filter,
              genre: e.target.value === 'All' ? undefined : e.target.value
            })}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Sort By
          </label>
          <select
            value={filter.sortBy}
            onChange={(e) => onFilterChange({
              ...filter,
              sortBy: e.target.value as FilterType['sortBy']
            })}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
