import React from 'react';
import { ChevronUp, ChevronDown, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function TopicList() {
  const { state, dispatch } = useApp();
  
  const filteredTopics = state.selectedCategory
    ? state.topics.filter(topic => topic.category === state.selectedCategory)
    : state.topics;

  const sortedTopics = [...filteredTopics].sort((a, b) => b.votes - a.votes);

  const handleVote = (id: string, value: 1 | -1) => {
    dispatch({ type: 'VOTE_TOPIC', payload: { id, value } });
  };

  return (
    <div className="space-y-4">
      {sortedTopics.map((topic) => (
        <div
          key={topic.id}
          className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors"
        >
          <div className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center space-y-1 pt-1">
                <button
                  onClick={() => handleVote(topic.id, 1)}
                  className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                >
                  <ChevronUp className="w-6 h-6" />
                </button>
                <span className="text-white font-medium text-lg">{topic.votes}</span>
                <button
                  onClick={() => handleVote(topic.id, -1)}
                  className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-blue-400">
                    {topic.category}
                  </span>
                </div>
                <p className="text-gray-300 mb-4 line-clamp-2">{topic.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">
                    {new Date(topic.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>Discuss</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}