import React, { createContext, useContext, useReducer } from 'react';
import { AppState, AppAction, Topic, Meeting } from '../types';

const initialTimeSlots = [
  { id: '1', time: '20:00', votes: 5 },
  { id: '2', time: '21:00', votes: 8 },
  { id: '3', time: '22:00', votes: 3 },
  { id: '4', time: '23:00', votes: 2 },
];

// Helper to add hours to a date
const addHours = (date: Date, hours: number) => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

const initialTopics: Topic[] = [
  {
    id: '1',
    title: 'Pinterest Strategy for 2024',
    category: 'pinterest',
    description: 'Discussing the latest Pinterest algorithm changes and how to adapt our strategy.',
    votes: 15,
    createdAt: new Date(),
    votingEndsAt: addHours(new Date(), 48),
    resources: [],
    questions: [],
  },
  {
    id: '2',
    title: 'Content Marketing Trends',
    category: 'marketing',
    description: 'Exploring emerging content marketing trends and their implementation.',
    votes: 12,
    createdAt: new Date(),
    votingEndsAt: addHours(new Date(), 48),
    resources: [],
    questions: [],
  },
];

const initialState: AppState = {
  topics: initialTopics,
  selectedCategory: null,
  meetings: [{
    id: '1',
    status: 'topic-selection',
    date: new Date(),
    timeSlots: initialTimeSlots,
    votingEndsAt: addHours(new Date(), 48),
  }],
  currentMeeting: null,
  isNewTopicModalOpen: false,
  isMeetingModalOpen: false,
  isResourceModalOpen: false,
  isQuestionModalOpen: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TOPIC':
      return {
        ...state,
        topics: [...state.topics, {
          ...action.payload,
          votingEndsAt: addHours(new Date(), 48),
          resources: [],
          questions: [],
        }],
        isNewTopicModalOpen: false,
      };

    case 'VOTE_TOPIC':
      return {
        ...state,
        topics: state.topics.map(topic =>
          topic.id === action.payload.id && new Date() < (topic.votingEndsAt || new Date())
            ? { ...topic, votes: topic.votes + action.payload.value }
            : topic
        ),
      };

    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
      };

    case 'VOTE_TIME_SLOT':
      return {
        ...state,
        meetings: state.meetings.map(meeting =>
          meeting.id === action.payload.meetingId && meeting.status === 'time-voting'
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

    case 'SELECT_TOPIC': {
      const selectedTopic = state.topics.find(t => t.id === action.payload.topicId);
      return {
        ...state,
        meetings: state.meetings.map(meeting =>
          meeting.id === action.payload.meetingId
            ? {
                ...meeting,
                selectedTopic,
                status: 'time-voting',
                votingEndsAt: addHours(new Date(), 24),
              }
            : meeting
        ),
      };
    }

    case 'SELECT_TIME_SLOT': {
      const meeting = state.meetings.find(m => m.id === action.payload.meetingId);
      const selectedTimeSlot = meeting?.timeSlots.find(t => t.id === action.payload.slotId);
      return {
        ...state,
        meetings: state.meetings.map(meeting =>
          meeting.id === action.payload.meetingId
            ? {
                ...meeting,
                selectedTimeSlot,
                status: 'preparation',
              }
            : meeting
        ),
      };
    }

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
                questions: (topic.questions || []).map(question =>
                  question.id === action.payload.questionId
                    ? { ...question, answer: action.payload.answer }
                    : question
                ),
              }
            : topic
        ),
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