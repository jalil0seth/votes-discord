import React from 'react';
import { Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function EventsSidebar() {
  const { state, dispatch } = useApp();
  const currentMeeting = state.meetings[0];
  const topVotedTopics = [...state.topics]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3);

  const handleTimeVote = (slotId: string) => {
    dispatch({
      type: 'VOTE_TIME_SLOT',
      payload: { meetingId: currentMeeting.id, slotId },
    });
  };

  return (
    <div className="w-64 bg-gray-900 h-screen p-4 border-l border-gray-800">
      <h2 className="text-white font-semibold mb-4">Next Meeting</h2>
      
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <h3 className="text-white font-medium mb-2">Time Poll</h3>
        <div className="space-y-2">
          {currentMeeting.timeSlots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between bg-gray-700 p-2 rounded hover:bg-gray-650 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{slot.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">{slot.votes} votes</span>
                <button
                  onClick={() => handleTimeVote(slot.id)}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  Vote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-white font-semibold mb-3">Top Voted Topics</h3>
        <div className="space-y-2">
          {topVotedTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-gray-800 p-2 rounded hover:bg-gray-750 transition-colors cursor-pointer"
            >
              <div className="text-white text-sm font-medium">{topic.title}</div>
              <div className="text-gray-400 text-xs mt-1">{topic.votes} votes</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}