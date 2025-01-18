import React, { createContext, useContext, useReducer } from 'react';
import { AppState, AppAction, Topic, Meeting } from '../types';

const initialTimeSlots = [
  { id: '1', time: '20:00', votes: 3 },
  { id: '2', time: '21:00', votes: 5 },
  { id: '3', time: '22:00', votes: 2 },
  { id: '4', time: '23:00', votes: 1 },
  { id: '5', time: '24:00', votes: 0 },
];

// Sample initial topics
const initialTopics: Topic[] = [
  {
    id: '1',
    title: 'Instagram Marketing Strategy 2024',
    category: 'marketing',
    description: 'Discuss the latest Instagram algorithm changes and how to optimize our content strategy.',
    votes: 8,
    createdAt: new Date(),
    resources: [],
    questions: [],
  },
  {
    id: '2',
    title: 'Brand Voice Guidelines',
    category: 'branding',
    description: 'Create comprehensive guidelines for our brand voice across all platforms.',
    votes: 5,
    createdAt: new Date(),
    resources: [],
    questions: [],
  },
  {
    id: '3',
    title: 'Pinterest SEO Techniques',
    category: 'pinterest',
    description: 'Learn and implement the latest Pinterest SEO techniques for better visibility.',
    votes: 6,
    createdAt: new Date(),
    resources: [],
    questions: [],
  },
  {
    id: '4',
    title: 'Content Calendar Planning',
    category: 'blogging',
    description: 'Plan our Q1 2024 content calendar and content themes.',
    votes: 4,
    createdAt: new Date(),
    resources: [],
    questions: [],
  },
];

// Set voting period to 48 hours from now
const topicVotingEndsAt = new Date();
topicVotingEndsAt.setHours(topicVotingEndsAt.getHours() + 48);

const timeVotingEndsAt = new Date();
timeVotingEndsAt.setHours(timeVotingEndsAt.getHours() + 24);

const initialState: AppState = {
  topics: initialTopics,
  selectedCategory: null,
  meetings: [{
    id: '1',
    status: 'topic-selection',
    date: new Date(),
    topicVotingEndsAt,
    timeVotingEndsAt,
    timeSlots: initialTimeSlots,
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

    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
        meetings: state.meetings.map(meeting => ({
          ...meeting,
          category: action.payload || undefined,
        })),
      };

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
                selectedTimeSlot: meeting.timeSlots.find(slot => slot.id === action.payload.slotId),
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
              }
            : meeting
        ),
        isMeetingModalOpen: false,
      };
    }

    case 'SET_MEETING_STATUS':
      return {
        ...state,
        meetings: state.meetings.map(meeting =>
          meeting.id === action.payload.meetingId
            ? {
                ...meeting,
                status: action.payload.status,
              }
            : meeting
        ),
      };

    case 'SET_MEETING_CATEGORY':
      return {
        ...state,
        meetings: state.meetings.map(meeting =>
          meeting.id === action.payload.meetingId
            ? {
                ...meeting,
                category: action.payload.category,
              }
            : meeting
        ),
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