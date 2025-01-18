import React, { useState } from 'react';
import { ChevronUp, Calendar, Clock, Video, Link as LinkIcon, MessageSquare, Users, ArrowLeft, ThumbsUp, ExternalLink, FileText } from 'lucide-react';
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

  const isUserJoined = (topicId: string) => {
    const topic = state.topics.find(t => t.id === topicId);
    return topic?.participants?.some(p => p.id === state.currentUserId);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-red-500" />;
      case 'article':
        return <FileText className="w-5 h-5 text-green-500" />;
      default:
        return <LinkIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const renderResourceCard = (resource: any) => {
    const embedUrl = resource.type === 'video' ? getYouTubeEmbedUrl(resource.url) : null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {embedUrl ? (
          <div className="aspect-video">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allowFullScreen
              title={resource.title}
            />
          </div>
        ) : (
          <div className="h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {getResourceIcon(resource.type)}
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {resource.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Added by {resource.addedBy}
              </p>
            </div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionCard = (question: any) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex items-start space-x-4">
        <button
          onClick={() => dispatch({
            type: 'VOTE_QUESTION',
            payload: { topicId: selectedTopic!.id, questionId: question.id }
          })}
          className="flex flex-col items-center space-y-1"
        >
          <ThumbsUp className={`w-5 h-5 ${question.votes > 0 ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className="text-sm font-medium">{question.votes || 0}</span>
        </button>
        <div className="flex-1">
          <p className="text-gray-900 dark:text-white font-medium">{question.content}</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Asked by {question.askedBy}
            </span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(question.createdAt), 'MMM d, h:mm a')}
            </span>
          </div>
          {question.answer && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">{question.answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTopicDetails = () => {
    if (!selectedTopic) return null;

    const hasJoined = isUserJoined(selectedTopic.id);

    return (
      <div className="flex-1">
        <button
          onClick={() => setSelectedTopicId(null)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Topics</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
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
            {!hasJoined && (
              <button
                onClick={() => dispatch({
                  type: 'JOIN_TOPIC',
                  payload: { topicId: selectedTopic.id }
                })}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Join Discussion
              </button>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-8">{selectedTopic.description}</p>

          {/* Resources Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Resources</h3>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_RESOURCE_MODAL' })}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Add Resource
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {selectedTopic.resources?.map(resource => renderResourceCard(resource))}
            </div>
          </div>

          {/* Questions Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Questions</h3>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_QUESTION_MODAL' })}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Ask Question
              </button>
            </div>
            <div className="space-y-4">
              {selectedTopic.questions?.map(question => renderQuestionCard(question))}
            </div>
          </div>

          {/* Participants Section */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Participants ({selectedTopic.participants?.length || 0})
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {selectedTopic.participants?.map(participant => (
                <div
                  key={participant.id}
                  className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {participant.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{participant.name}</div>
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

  // Rest of the component remains the same...
  // (Keep the existing renderTopicsList and return statement)
}