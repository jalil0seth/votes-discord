import React from 'react';
import { ChevronUp, MessageSquare, Clock, Video, Link as LinkIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function TopicList() {
  const { state, dispatch } = useApp();
  const currentMeeting = state.meetings[0];
  
  const filteredTopics = state.topics.filter(topic => 
    !currentMeeting.category || topic.category === currentMeeting.category
  );
  
  const sortedTopics = [...filteredTopics].sort((a, b) => b.votes - a.votes);

  const handleVote = (id: string) => {
    dispatch({ type: 'VOTE_TOPIC', payload: { id, value: 1 } });
  };

  const getTimeLeft = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return hours > 0 ? `${hours}h left` : 'Voting ended';
  };

  const renderTopicVotingPhase = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Topic Selection Phase</h2>
              <p className="text-gray-600 dark:text-gray-400">Vote for the topic you'd like to discuss</p>
            </div>
          </div>
          <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {getTimeLeft(currentMeeting.topicVotingEndsAt)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sortedTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleVote(topic.id)}
                  className="flex flex-col items-center space-y-1 bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors group"
                >
                  <ChevronUp className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                  <span className="text-gray-900 dark:text-white font-medium">{topic.votes}</span>
                </button>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {topic.title}
                    </h3>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      {topic.category}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{topic.description}</p>
                  
                  {topic.votes > 0 && (
                    <button
                      onClick={() => dispatch({
                        type: 'SELECT_TOPIC',
                        payload: { meetingId: currentMeeting.id, topicId: topic.id }
                      })}
                      className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      Select this topic
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => dispatch({ type: 'TOGGLE_NEW_TOPIC_MODAL' })}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        Suggest New Topic
      </button>
    </div>
  );

  const renderTimeVotingPhase = () => {
    if (!currentMeeting.selectedTopic) return null;

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Time Selection</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Selected topic: <span className="font-medium">{currentMeeting.selectedTopic.title}</span>
                </p>
              </div>
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
    );
  };

  const renderPreparationPhase = () => {
    if (!currentMeeting.selectedTopic) return null;

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold">3</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Meeting Preparation</h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-1">
                <p>Topic: <span className="font-medium">{currentMeeting.selectedTopic.title}</span></p>
                <p>Time: <span className="font-medium">{currentMeeting.selectedTimeSlot?.time}</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Resources</h3>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_RESOURCE_MODAL' })}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                Add Resource
              </button>
            </div>
            <div className="space-y-2">
              {currentMeeting.selectedTopic.resources?.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  {resource.type === 'video' ? (
                    <Video className="w-4 h-4 text-gray-400" />
                  ) : (
                    <LinkIcon className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-gray-700 dark:text-gray-200">{resource.title}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Questions</h3>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_QUESTION_MODAL' })}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                Ask Question
              </button>
            </div>
            <div className="space-y-3">
              {currentMeeting.selectedTopic.questions?.map((question) => (
                <div
                  key={question.id}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2"
                >
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-700 dark:text-gray-200">{question.content}</p>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Asked by {question.askedBy}
                      </span>
                    </div>
                  </div>
                  {question.answer && (
                    <div className="ml-7 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{question.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentPhase = () => {
    switch (currentMeeting?.status) {
      case 'topic-selection':
        return renderTopicVotingPhase();
      case 'time-voting':
        return renderTimeVotingPhase();
      case 'preparation':
      case 'scheduled':
        return renderPreparationPhase();
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {renderCurrentPhase()}
    </div>
  );
}