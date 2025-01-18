import React from 'react';
import { Video, Link as LinkIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ResourcesView() {
  const { state, dispatch } = useApp();
  const currentMeeting = state.meetings[0];

  if (!currentMeeting.selectedTopic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">No Topic Selected</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please select a topic from the calendar first to share resources.
        </p>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'calendar' })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Go to Calendar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Resources</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Share helpful resources for: {currentMeeting.selectedTopic.title}
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_RESOURCE_MODAL' })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Resource
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {currentMeeting.selectedTopic.resources?.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
          >
            <div className="flex items-start space-x-3">
              {resource.type === 'video' ? (
                <Video className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              ) : (
                <LinkIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Added by {resource.addedBy}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}