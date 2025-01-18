import React from 'react';
import { X, Clock, Video, Link, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function MeetingInfoModal() {
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

  const handleTopicSelect = (topicId: string) => {
    dispatch({
      type: 'SELECT_TOPIC',
      payload: { meetingId: currentMeeting.id, topicId },
    });
  };

  const handleTimeSelect = (slotId: string) => {
    dispatch({
      type: 'SELECT_TIME_SLOT',
      payload: { meetingId: currentMeeting.id, slotId },
    });
  };

  const renderTopicSelection = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Top Topics</h3>
        <span className="text-sm text-gray-400">
          Voting ends in {Math.ceil((new Date(currentMeeting.votingEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60))}h
        </span>
      </div>
      <div className="space-y-2">
        {topVotedTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-gray-700 p-3 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">{topic.title}</h4>
                <span className="text-gray-400 text-sm">{topic.votes} votes</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-blue-400">
                  {topic.category}
                </span>
                <button
                  onClick={() => handleTopicSelect(topic.id)}
                  className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTimeVoting = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Time Poll</h3>
        <span className="text-sm text-gray-400">
          Voting ends in {Math.ceil((new Date(currentMeeting.votingEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60))}h
        </span>
      </div>
      <div className="space-y-2">
        {currentMeeting.timeSlots.map((slot) => (
          <div
            key={slot.id}
            className="flex items-center justify-between bg-gray-700 p-3 rounded-lg hover:bg-gray-650 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-200">{slot.time}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">{slot.votes} votes</span>
              {currentMeeting.status === 'time-voting' ? (
                <button
                  onClick={() => handleTimeVote(slot.id)}
                  className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
                >
                  Vote
                </button>
              ) : (
                <button
                  onClick={() => handleTimeSelect(slot.id)}
                  className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
                >
                  Select
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMeetingPreparation = () => {
    const selectedTopic = currentMeeting.selectedTopic;
    if (!selectedTopic) return null;

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Selected Topic</h3>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-blue-400">
              {selectedTopic.category}
            </span>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-white mb-2">{selectedTopic.title}</h4>
            <p className="text-gray-300 text-sm">{selectedTopic.description}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Resources</h3>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_RESOURCE_MODAL' })}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Add Resource
            </button>
          </div>
          <div className="space-y-2">
            {selectedTopic.resources?.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 bg-gray-700 p-3 rounded-lg hover:bg-gray-650 transition-colors"
              >
                {resource.type === 'video' ? (
                  <Video className="w-4 h-4 text-gray-400" />
                ) : (
                  <Link className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-gray-200">{resource.title}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Questions</h3>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_QUESTION_MODAL' })}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Ask Question
            </button>
          </div>
          <div className="space-y-2">
            {selectedTopic.questions?.map((question) => (
              <div
                key={question.id}
                className="bg-gray-700 p-3 rounded-lg space-y-2"
              >
                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-200">{question.content}</p>
                    <span className="text-sm text-gray-400">
                      Asked by {question.askedBy}
                    </span>
                  </div>
                </div>
                {question.answer && (
                  <div className="ml-7 mt-2 p-2 bg-gray-600 rounded">
                    <p className="text-gray-200 text-sm">{question.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {currentMeeting.status === 'topic-selection' && 'Topic Selection'}
              {currentMeeting.status === 'time-voting' && 'Time Voting'}
              {currentMeeting.status === 'preparation' && 'Meeting Preparation'}
              {currentMeeting.status === 'scheduled' && 'Meeting Details'}
            </h2>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_MEETING_MODAL' })}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto">
          {currentMeeting.status === 'topic-selection' && renderTopicSelection()}
          {(currentMeeting.status === 'time-voting' || currentMeeting.status === 'scheduled') && renderTimeVoting()}
          {currentMeeting.status === 'preparation' && renderMeetingPreparation()}
        </div>
      </div>
    </div>
  );
}