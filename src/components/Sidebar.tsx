import React from 'react';
import { Calendar, TrendingUp, Palette, PenTool, Pointer } from 'lucide-react';
import { useApp } from '../context/AppContext';

const categories = [
  { id: 'marketing', name: 'Marketing', icon: TrendingUp },
  { id: 'branding', name: 'Branding', icon: Palette },
  { id: 'blogging', name: 'Blogging', icon: PenTool },
  { id: 'pinterest', name: 'Pinterest', icon: Pointer },
];

export function Sidebar() {
  const { state, dispatch } = useApp();

  return (
    <div className="w-60 bg-gray-900 h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white mb-4">Digital Marketing Hub</h1>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-gray-400 uppercase text-xs font-semibold mb-2">Categories</h2>
        <button
          onClick={() => dispatch({ type: 'SET_CATEGORY', payload: null })}
          className={`flex items-center space-x-2 text-gray-300 hover:bg-gray-800 w-full p-2 rounded transition-colors ${
            state.selectedCategory === null ? 'bg-gray-800 text-white' : ''
          }`}
        >
          <span>All Topics</span>
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => dispatch({ type: 'SET_CATEGORY', payload: category.id })}
            className={`flex items-center space-x-2 text-gray-300 hover:bg-gray-800 w-full p-2 rounded transition-colors ${
              state.selectedCategory === category.id ? 'bg-gray-800 text-white' : ''
            }`}
          >
            <category.icon className="w-4 h-4" />
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-gray-400 uppercase text-xs font-semibold mb-2">Schedule</h2>
        <button className="flex items-center space-x-2 text-gray-300 hover:bg-gray-800 w-full p-2 rounded transition-colors">
          <Calendar className="w-4 h-4" />
          <span>Weekly Meetings</span>
        </button>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-800">
        <div className="text-sm text-gray-400">
          <p>Next meeting:</p>
          <p className="text-white">Thursday, 21:00</p>
        </div>
      </div>
    </div>
  );
}