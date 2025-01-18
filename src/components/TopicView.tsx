import React, { useState } from 'react';
import { ChevronUp, Calendar, Clock, Video, Link as LinkIcon, MessageSquare, Users, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useConfig } from '../context/ConfigContext';
import { format } from 'date-fns';

export function TopicView() {
  const { state, dispatch } = useApp();
  const { config } = useConfig();
  const currentMeeting = state.meetings[0];
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const selectedTopic = state.topics.find(topic => topic.id === selectedTopicId);

  // Calculate statistics
  const totalTopics = state.topics.length;
  const totalResources = state.topics.reduce((sum, topic) => sum + (topic.resources?.length || 0), 0);
  const totalQuestions = state.topics.reduce((sum, topic) => sum + (topic.questions?.length || 0), 0);
  const totalParticipants = state.topics.reduce((sum, topic) => sum + (topic.participants?.length || 0), 0);

  const renderTopicDetails = () => {
    if (!selectedTopic) return null;

    return (
      <div className="flex-1">
        <button
          onClick={() => setSelectedTopicId(null)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Topics</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedTopic.title}</h2>
              <div className="flex items-center space-x-2 mt-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {selectedTopic.category}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Created {format(new Date(selectedTopic.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedTopic.votes}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Votes</div>
              </div>
              <button
                onClick={() => dispatch({ type: 'VOTE_TOPIC', payload: { id: selectedTopic.id, value: 1 } })}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Vote
              </button>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-8">{selectedTopic.description}</p>

          <div className="grid grid-cols-2 gap-8">
            {/* Resources Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resources</h3>
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_RESOURCE_MODAL' })}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                >
                  Add Resource
                </button>
              </div>
              <div className="space-y-3">
                {selectedTopic.resources?.map(resource => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    {resource.type === 'video' ? (
                      <Video className="w-5 h-5 text-blue-500" />
                    ) : (
                      <LinkIcon className="w-5 h-5 text-blue-500" />
                    )}
                    <div>
                      <div className="text-gray-900 dark:text-white font-medium">{resource.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Added by {resource.addedBy}
                      </div>
                    </div>
                  </a>
                ))}
                {(!selectedTopic.resources || selectedTopic.resources.length === 0) && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No resources added yet
                  </div>
                )}
              </div>
            </div>

            {/* Questions Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Questions</h3>
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_QUESTION_MODAL' })}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                >
                  Ask Question
                </button>
              </div>
              <div className="space-y-3">
                {selectedTopic.questions?.map(question => (
                  <div key={question.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="w-5 h-5 text-purple-500 mt-1" />
                      <div>
                        <p className="text-gray-900 dark:text-white">{question.content}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Asked by {question.askedBy}
                        </p>
                      </div>
                    </div>
                    {question.answer && (
                      <div className="mt-3 ml-8 p-3 bg-gray-100 dark:bg-gray-600 rounded">
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{question.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
                {(!selectedTopic.questions || selectedTopic.questions.length === 0) && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No questions asked yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Participants Section */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Participants</h3>
              <button
                onClick={() => dispatch({
                  type: 'JOIN_TOPIC',
                  payload: { topicId: selectedTopic.id }
                })}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Join Discussion
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {selectedTopic.participants?.map(participant => (
                <div
                  key={participant.id}
                  className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                >
                  <Users className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="text-gray-900 dark:text-white">{participant.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Joined {format(new Date(participant.joinedAt), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTopicsList = () => (
    <div className="flex-1">
      {/* Summary Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Topics Overview</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {config.serverName} • Meeting days: {config.meetingDays.map(day => 
                ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
              ).join(', ')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Topics</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{totalTopics}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <Video className="w-5 h-5" />
              <span className="font-medium">Resources</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{totalResources}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Questions</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{totalQuestions}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
              <Users className="w-5 h-5" />
              <span className="font-medium">Participants</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{totalParticipants}</p>
          </div>
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        {state.topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setSelectedTopicId(topic.id)}
            className="w-full text-left bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center space-y-1 bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg">
                <ChevronUp className="w-6 h-6 text-gray-400" />
                <span className="text-gray-900 dark:text-white font-medium">{topic.votes}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {topic.title}
                  </h3>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    {topic.category}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{topic.description}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Video className="w-4 h-4" />
                    <span>{topic.resources?.length || 0} resources</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>{topic.questions?.length || 0} questions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{topic.participants?.length || 0} participants</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
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
  );

  return (
    <div className="flex">
      {selectedTopicId ? renderTopicDetails() : renderTopicsList()}
      
      {/* Right Sidebar */}
      <div className="w-80 ml-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meeting Progress</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Topic Voting</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {Math.ceil((new Date(currentMeeting.topicVotingEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60))}h left
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${(state.topics.length / 4) * 100}%`
                  }}
                />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {state.topics.length}/4 topics submitted
              </div>
            </div>

            {currentMeeting.selectedTopic && (
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Time Voting</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {Math.ceil((new Date(currentMeeting.timeVotingEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60))}h left
                  </span>
                </div>
                <div className="space-y-2">
                  {currentMeeting.timeSlots.map(slot => (
                    <div key={slot.id}>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>{slot.time}</span>
                        <span>{slot.votes} votes</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${(slot.votes / Math.max(...currentMeeting.timeSlots.map(s => s.votes))) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}