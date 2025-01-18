import React, { createContext, useContext, useReducer } from 'react';
import { AppState, AppAction } from '../types';

const initialTimeSlots = [
  { id: '1', time: '20:00', votes: 0 },
  { id: '2', time: '21:00', votes: 0 },
  { id: '3', time: '22:00', votes: 0 },
  { id: '4', time: '23:00', votes: 0 },
];

const initialState: AppState = {
  topics: [],
  meetings: [{
    id: '1',
    status: 'topic-selection',
    date: new Date(),
    topicVotingEndsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    timeVotingEndsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    timeSlots: initialTimeSlots,
  }],
  currentView: 'calendar',
  isNewTopicModalOpen: false,
  isMeetingModalOpen: false,
  isResourceModalOpen: false,
  isQuestionModalOpen: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TOPIC':
      if (state.topics.length >= 4) {
        return state;
      }
      return {
        ...state,
        topics: [...state.topics, action.payload],
        isNewTopicModalOpen: false,
      };

    case 'VOTE_TOPIC':
      return {
        ...state,
        topics: state.topics.map(topic =>
          topic.id === action.payload.id
            ? { ...topic, votes: topic.votes + action.payload.value }
            : topic
        ),
      };

    case 'VOTE_QUESTION':
      return {
        ...state,
        topics: state.topics.map(topic =>
          topic.id === action.payload.topicId
            ? {
                ...topic,
                questions: topic.questions?.map(question =>
                  question.id === action.payload.questionId
                    ? { ...question, votes: (question.votes || 0) + 1 }
                    : question
                ),
              }
            : topic
        ),
      };

    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload,
      };

    // ... rest of the reducer cases remain the same
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}