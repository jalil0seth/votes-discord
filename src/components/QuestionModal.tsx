import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function QuestionModal() {
  const { state, dispatch } = useApp();
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentMeeting = state.meetings[0];
    if (!currentMeeting.selectedTopic) return;

    dispatch({
      type: 'ADD_QUESTION',
      payload: {
        topicId: currentMeeting.selectedTopic.id,
        question: {
          id: crypto.randomUUID(),
          content: question,
          askedBy: 'Anonymous',
          createdAt: new Date(),
        },
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Ask a Question</h2>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_QUESTION_MODAL' })}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Your Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="What would you like to know?"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Submit Question
          </button>
        </form>
      </div>
    </div>
  );
}