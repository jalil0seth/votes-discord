import React from 'react';
import { Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VotingProgress } from './VotingProgress';

export function TimeView() {
  const { state, dispatch } = useApp();
  const currentMeeting = state.meetings[0];

  if (!currentMeeting.selectedTopic) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Please select a topic first to proceed with time voting.
        </p>
      </div>
    );
  }

  const getTimeLeft = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return hours > 0 ? `${hours}h left` : 'Voting ended';
  };

  return (
    <div className="flex">
      <div className="flex-1 max-w-4xl">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Time Selection</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Selected topic: {currentMeeting.selectedTopic.title}
              </p>
            </div>
            <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {getTimeLeft(currentMeeting.timeVotingEndsAt)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {currentMeeting.timeSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => dispatch({
                type: 'VOTE_TIME_SLOT',
                payload: { meetingId: currentMeeting.id, slotId: slot.id }
              })}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    {slot.time}
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">{slot.votes} votes</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <VotingProgress />
    </div>
  );
}