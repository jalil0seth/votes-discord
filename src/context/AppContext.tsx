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
    topicVotingEndsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
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
    case 'ADD_TOPIC': {
      const newTopics = [...state.topics, action.payload];
      const topicWithMostVotes = newTopics.reduce((prev, current) => 
        (current.votes > prev.votes) ? current : prev
      );

      return {
        ...state,
        topics: newTopics,
        isNewTopicModalOpen: false,
        meetings: state.meetings.map(meeting => ({
          ...meeting,
          selectedTopic: topicWithMostVotes,
          status: 'time-voting'
        }))
      };
    }

    case 'VOTE_TOPIC': {
      const updatedTopics = state.topics.map(topic =>
        topic.id === action.payload.id
          ? { ...topic, votes: topic.votes + action.payload.value }
          : topic
      );

      const topicWithMostVotes = updatedTopics.reduce((prev, current) => 
        (current.votes > prev.votes) ? current : prev
      );

      return {
        ...state,
        topics: updatedTopics,
        meetings: state.meetings.map(meeting => ({
          ...meeting,
          selectedTopic: topicWithMostVotes,
          status: 'time-voting'
        }))
      };
    }

    case 'VOTE_TIME_SLOT':
      return {
        ...state,
        meetings: state.meetings.map(meeting =>
          meeting.id === action.payload.meetingId
            ? {
                ...meeting,
                timeSlots: meeting.timeSlots.map(slot =>
                  slot.id === action.payload.slotId
                    ? { ...slot, votes: slot.votes + 1 }
                    : slot
                ),
              }
            : meeting
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

    case 'TOGGLE_NEW_TOPIC_MODAL':
      return {
        ...state,
        isNewTopicModalOpen: !state.isNewTopicModalOpen,
      };

    case 'TOGGLE_MEETING_MODAL':
      return {
        ...state,
        isMeetingModalOpen: !state.isMeetingModalOpen,
      };

    case 'TOGGLE_RESOURCE_MODAL':
      return {
        ...state,
        isResourceModalOpen: !state.isResourceModalOpen,
      };

    case 'TOGGLE_QUESTION_MODAL':
      return {
        ...state,
        isQuestionModalOpen: !state.isQuestionModalOpen,
      };

    case 'ADD_RESOURCE':
      return {
        ...state,
        topics: state.topics.map(topic =>
          topic.id === action.payload.topicId
            ? {
                ...topic,
                resources: [...(topic.resources || []), action.payload.resource],
              }
            : topic
        ),
        isResourceModalOpen: false,
      };

    case 'ADD_QUESTION':
      return {
        ...state,
        topics: state.topics.map(topic =>
          topic.id === action.payload.topicId
            ? {
                ...topic,
                questions: [...(topic.questions || []), action.payload.question],
              }
            : topic
        ),
        isQuestionModalOpen: false,
      };

    case 'ANSWER_QUESTION':
      return {
        ...state,
        topics: state.topics.map(topic =>
          topic.id === action.payload.topicId
            ? {
                ...topic,
                questions: topic.questions?.map(question =>
                  question.id === action.payload.questionId
                    ? { ...question, answer: action.payload.answer }
                    : question
                ),
              }
            : topic
        ),
      };

    case 'SELECT_TOPIC':
      return {
        ...state,
        meetings: state.meetings.map(meeting =>
          meeting.id === action.payload.meetingId
            ? {
                ...meeting,
                selectedTopic: state.topics.find(t => t.id === action.payload.topicId),
                status: 'time-voting',
              }
            : meeting
        ),
        isMeetingModalOpen: false,
      };

    case 'SELECT_TIME_SLOT':
      return {
        ...state,
        meetings: state.meetings.map(meeting =>
          meeting.id === action.payload.meetingId
            ? {
                ...meeting,
                selectedTimeSlot: meeting.timeSlots.find(s => s.id === action.payload.slotId),
                status: 'preparation',
              }
            : meeting
        ),
        isMeetingModalOpen: false,
      };

    case 'SET_MEETING_STATUS':
      return {
        ...state,
        meetings: state.meetings.map(meeting =>
          meeting.id === action.payload.meetingId
            ? { ...meeting, status: action.payload.status }
            : meeting
        ),
      };

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