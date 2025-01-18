import React from 'react';
import { Clock, Video, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function VotingProgress() {
  const { state, dispatch } = useApp();
  const currentMeeting = state.meetings[0];

  const getTimeLeft = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return hours > 0 ? `${hours}h left` : 'Voting ended';
  };

  const isVotingEnded = (date: Date) => {
    return new Date().getTime() > date.getTime();
  };

  return (
    <div className="w-80 bg-gray-900 min-h-screen p-6 flex flex-col space-y-6">
      <h1 className="text-xl font-bold text-white">Meeting Progress</h1>

      {/* Topic Voting Section */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-medium">Topic Voting</h2>
          <span className="text-sm text-blue-400">
            {getTimeLeft(currentMeeting.topicVotingEndsAt)}
          </span>
        </div>
        {state.topics.map((topic) => (
          <div key={topic.id} className="mb-2 last:mb-0">
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>{topic.title}</span>
              <span>{topic.votes} votes</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{
                  width: `${(topic.votes / Math.max(...state.topics.map(t => t.votes))) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
        {state.topics.length < 4 && !isVotingEnded(currentMeeting.topicVotingEndsAt) && (
          <button
            onClick={() => dispatch({ type: 'TOGGLE_NEW_TOPIC_MODAL' })}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Add Topic ({state.topics.length}/4)
          </button>
        )}
      </div>

      {/* Time Voting Section */}
      {currentMeeting.selectedTopic && (
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-medium">Time Voting</h2>
            <span className="text-sm text-blue-400">
              {getTimeLeft(currentMeeting.timeVotingEndsAt)}
            </span>
          </div>
          {currentMeeting.timeSlots.map((slot) => (
            <div key={slot.id} className="mb-2 last:mb-0">
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>{slot.time}</span>
                <span>{slot.votes} votes</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${(slot.votes / Math.max(...currentMeeting.timeSlots.map(s => s.votes))) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resources Section */}
      {currentMeeting.status === 'preparation' && currentMeeting.selectedTopic && (
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-medium">Resources</h2>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_RESOURCE_MODAL' })}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {currentMeeting.selectedTopic.resources?.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white"
              >
                <Video className="w-4 h-4" />
                <span className="text-sm truncate">{resource.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Questions Section */}
      {currentMeeting.status === 'preparation' && currentMeeting.selectedTopic && (
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-medium">Questions</h2>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_QUESTION_MODAL' })}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Ask
            </button>
          </div>
          <div className="space-y-2">
            {currentMeeting.selectedTopic.questions?.map((question) => (
              <div key={question.id} className="flex items-start space-x-2">
                <MessageSquare className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{question.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}