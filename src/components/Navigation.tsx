import React from 'react';
import { Plus, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

const categories = [
  { id: null, name: 'All' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'branding', name: 'Branding' },
  { id: 'blogging', name: 'Blogging' },
  { id: 'pinterest', name: 'Pinterest' },
];

export function Navigation() {
  const { state, dispatch } = useApp();

  return (
    <div className="sticky top-0 bg-gray-900 border-b border-gray-800 z-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold text-white">Digital Marketing Hub</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_MEETING_MODAL' })}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_NEW_TOPIC_MODAL' })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Topic</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-none">
          {categories.map((category) => (
            <button
              key={category.id ?? 'all'}
              onClick={() => dispatch({ type: 'SET_CATEGORY', payload: category.id })}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                state.selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}