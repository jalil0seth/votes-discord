import React from 'react';
import { ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VotingProgress } from './VotingProgress';

export function TopicView() {
  const { state, dispatch } = useApp();
  const currentMeeting = state.meetings[0];

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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Topic Voting</h2>
              <p className="text-gray-600 dark:text-gray-400">Vote for the topics you'd like to discuss</p>
            </div>
            <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {getTimeLeft(currentMeeting.topicVotingEndsAt)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {state.topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => dispatch({ type: 'VOTE_TOPIC', payload: { id: topic.id, value: 1 } })}
                  className="flex flex-col items-center space-y-1 bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors group"
                >
                  <ChevronUp className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                  <span className="text-gray-900 dark:text-white font-medium">{topic.votes}</span>
                </button>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {topic.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{topic.description}</p>
                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Scheduled for {topic.scheduledDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {state.topics.length < 4 && (
            <button
              onClick={() => dispatch({ type: 'TOGGLE_NEW_TOPIC_MODAL' })}
              className="w-full bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-gray-500 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              + Add Topic ({state.topics.length}/4)
            </button>
          )}
        </div>
      </div>
      <VotingProgress />
    </div>
  );
}