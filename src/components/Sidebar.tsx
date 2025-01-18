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
  const currentMeeting = state.meetings[0];

  const handleCategorySelect = (categoryId: string | null) => {
    dispatch({ type: 'SET_CATEGORY', payload: categoryId });
    if (categoryId) {
      dispatch({
        type: 'SET_MEETING_CATEGORY',
        payload: { meetingId: currentMeeting.id, category: categoryId }
      });
    }
  };

  return (
    <div className="w-60 bg-gray-900 h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white mb-4">Digital Marketing Hub</h1>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-gray-400 uppercase text-xs font-semibold mb-2">Categories</h2>
        <button
          onClick={() => handleCategorySelect(null)}
          className={`flex items-center space-x-2 text-gray-300 hover:bg-gray-800 w-full p-2 rounded transition-colors ${
            state.selectedCategory === null ? 'bg-gray-800 text-white' : ''
          }`}
        >
          <span>All Topics</span>
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
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
        <h2 className="text-gray-400 uppercase text-xs font-semibold mb-2">Meeting Status</h2>
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="text-sm text-gray-300">
            <p className="font-medium text-white mb-1">Current Phase:</p>
            <p>{currentMeeting?.status === 'topic-selection' ? 'Topic Selection' :
               currentMeeting?.status === 'time-voting' ? 'Time Voting' :
               currentMeeting?.status === 'preparation' ? 'Meeting Preparation' :
               'Meeting Scheduled'}</p>
            
            {currentMeeting?.selectedTopic && (
              <div className="mt-2">
                <p className="font-medium text-white mb-1">Selected Topic:</p>
                <p className="text-gray-400">{currentMeeting.selectedTopic.title}</p>
              </div>
            )}
            
            {currentMeeting?.selectedTimeSlot && (
              <div className="mt-2">
                <p className="font-medium text-white mb-1">Selected Time:</p>
                <p className="text-gray-400">{currentMeeting.selectedTimeSlot.time}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}