import React from 'react';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VotingProgress } from './VotingProgress';

export function QuestionsView() {
  const { state, dispatch } = useApp();
  const currentMeeting = state.meetings[0];

  if (!currentMeeting.selectedTopic) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Please select a topic first to ask questions.
        </p>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex-1 max-w-4xl">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Questions</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Ask questions about: {currentMeeting.selectedTopic.title}
              </p>
            </div>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_QUESTION_MODAL' })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Ask Question
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {currentMeeting.selectedTopic.questions?.map((question) => (
            <div
              key={question.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => dispatch({
                    type: 'VOTE_QUESTION',
                    payload: { topicId: currentMeeting.selectedTopic!.id, questionId: question.id }
                  })}
                  className="flex flex-col items-center space-y-1 bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors group"
                >
                  <ThumbsUp className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                  <span className="text-gray-900 dark:text-white font-medium">{question.votes}</span>
                </button>
                
                <div className="flex-1">
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-900 dark:text-white">{question.content}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Asked by {question.askedBy}
                      </p>
                    </div>
                  </div>
                  {question.answer && (
                    <div className="mt-4 ml-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">{question.answer}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <VotingProgress />
    </div>
  );
}