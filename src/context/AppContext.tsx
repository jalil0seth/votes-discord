import React, { createContext, useContext, useReducer } from 'react';

interface Topic {
  id: string;
  title: string;
  category: string;
  description: string;
  scheduledDate: Date;
  votes: number;
  createdAt: Date;
  resources?: Resource[];
  questions?: Question[];
  participants?: Participant[];
}

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'link';
  url: string;
  addedBy: string;
  createdAt: Date;
}

interface Question {
  id: string;
  content: string;
  askedBy: string;
  answer?: string;
  createdAt: Date;
  votes?: number;
}

interface TimeSlot {
  id: string;
  time: string;
  votes: number;
}

interface Meeting {
  id: string;
  status: 'topic-selection' | 'time-voting' | 'preparation' | 'scheduled';
  category?: string;
  selectedTopic?: Topic;
  selectedTimeSlot?: TimeSlot;
  timeSlots: TimeSlot[];
  topicVotingEndsAt: Date;
  timeVotingEndsAt: Date;
}

interface Participant {
  id: string;
  name: string;
  joinedAt: Date;
}

interface AppState {
  currentView: 'calendar' | 'topic' | 'time' | 'resources' | 'questions';
  topics: Topic[];
  meetings: Meeting[];
  selectedCategory: string | null;
  isNewTopicModalOpen: boolean;
  isMeetingModalOpen: boolean;
  isResourceModalOpen: boolean;
  isQuestionModalOpen: boolean;
  isServerConfigOpen: boolean;
}

type AppAction =
  | { type: 'SET_VIEW'; payload: AppState['currentView'] }
  | { type: 'ADD_TOPIC'; payload: Topic }
  | { type: 'VOTE_TOPIC'; payload: { id: string; value: number } }
  | { type: 'SELECT_TOPIC'; payload: { meetingId: string; topicId: string } }
  | { type: 'SET_CATEGORY'; payload: string | null }
  | { type: 'SET_MEETING_CATEGORY'; payload: { meetingId: string; category: string } }
  | { type: 'VOTE_TIME_SLOT'; payload: { meetingId: string; slotId: string } }
  | { type: 'SELECT_TIME_SLOT'; payload: { meetingId: string; slotId: string } }
  | { type: 'ADD_RESOURCE'; payload: { topicId: string; resource: Resource } }
  | { type: 'ADD_QUESTION'; payload: { topicId: string; question: Question } }
  | { type: 'VOTE_QUESTION'; payload: { topicId: string; questionId: string } }
  | { type: 'TOGGLE_NEW_TOPIC_MODAL' }
  | { type: 'TOGGLE_MEETING_MODAL' }
  | { type: 'TOGGLE_RESOURCE_MODAL' }
  | { type: 'TOGGLE_QUESTION_MODAL' }
  | { type: 'JOIN_TOPIC'; payload: { topicId: string } }
  | { type: 'TOGGLE_SERVER_CONFIG' };

const initialState: AppState = {
  currentView: 'calendar',
  topics: [],
  meetings: [
    {
      id: '1',
      status: 'topic-selection',
      timeSlots: [
        { id: '1', time: '10:00 AM', votes: 0 },
        { id: '2', time: '2:00 PM', votes: 0 },
        { id: '3', time: '4:00 PM', votes: 0 },
      ],
      topicVotingEndsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      timeVotingEndsAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    },
  ],
  selectedCategory: null,
  isNewTopicModalOpen: false,
  isMeetingModalOpen: false,
  isResourceModalOpen: false,
  isQuestionModalOpen: false,
  isServerConfigOpen: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };

    case 'ADD_TOPIC':
      return { ...state, topics: [...state.topics, action.payload] };

    case 'VOTE_TOPIC':
      return {
        ...state,
        topics: state.topics.map((topic) =>
          topic.id === action.payload.id
            ? { ...topic, votes: topic.votes + action.payload.value }
            : topic
        ),
      };

    case 'SELECT_TOPIC':
      return {
        ...state,
        meetings: state.meetings.map((meeting) =>
          meeting.id === action.payload.meetingId
            ? {
                ...meeting,
                selectedTopic: state.topics.find((t) => t.id === action.payload.topicId),
                status: 'time-voting',
              }
            : meeting
        ),
      };

    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };

    case 'SET_MEETING_CATEGORY':
      return {
        ...state,
        meetings: state.meetings.map((meeting) =>
          meeting.id === action.payload.meetingId
            ? { ...meeting, category: action.payload.category }
            : meeting
        ),
      };

    case 'VOTE_TIME_SLOT':
      return {
        ...state,
        meetings: state.meetings.map((meeting) =>
          meeting.id === action.payload.meetingId
            ? {
                ...meeting,
                timeSlots: meeting.timeSlots.map((slot) =>
                  slot.id === action.payload.slotId
                    ? { ...slot, votes: slot.votes + 1 }
                    : slot
                ),
              }
            : meeting
        ),
      };

    case 'SELECT_TIME_SLOT':
      return {
        ...state,
        meetings: state.meetings.map((meeting) =>
          meeting.id === action.payload.meetingId
            ? {
                ...meeting,
                selectedTimeSlot: meeting.timeSlots.find(
                  (slot) => slot.id === action.payload.slotId
                ),
                status: 'preparation',
              }
            : meeting
        ),
      };

    case 'ADD_RESOURCE':
      return {
        ...state,
        topics: state.topics.map((topic) =>
          topic.id === action.payload.topicId
            ? {
                ...topic,
                resources: [...(topic.resources || []), action.payload.resource],
              }
            : topic
        ),
      };

    case 'ADD_QUESTION':
      return {
        ...state,
        topics: state.topics.map((topic) =>
          topic.id === action.payload.topicId
            ? {
                ...topic,
                questions: [...(topic.questions || []), action.payload.question],
              }
            : topic
        ),
      };

    case 'VOTE_QUESTION':
      return {
        ...state,
        topics: state.topics.map((topic) =>
          topic.id === action.payload.topicId
            ? {
                ...topic,
                questions: topic.questions?.map((question) =>
                  question.id === action.payload.questionId
                    ? { ...question, votes: (question.votes || 0) + 1 }
                    : question
                ),
              }
            : topic
        ),
      };

    case 'JOIN_TOPIC':
      return {
        ...state,
        topics: state.topics.map((topic) =>
          topic.id === action.payload.topicId
            ? {
                ...topic,
                participants: [
                  ...(topic.participants || []),
                  {
                    id: crypto.randomUUID(),
                    name: 'Anonymous User',
                    joinedAt: new Date(),
                  },
                ],
              }
            : topic
        ),
      };

    case 'TOGGLE_NEW_TOPIC_MODAL':
      return { ...state, isNewTopicModalOpen: !state.isNewTopicModalOpen };

    case 'TOGGLE_MEETING_MODAL':
      return { ...state, isMeetingModalOpen: !state.isMeetingModalOpen };

    case 'TOGGLE_RESOURCE_MODAL':
      return { ...state, isResourceModalOpen: !state.isResourceModalOpen };

    case 'TOGGLE_QUESTION_MODAL':
      return { ...state, isQuestionModalOpen: !state.isQuestionModalOpen };

    case 'TOGGLE_SERVER_CONFIG':
      return { ...state, isServerConfigOpen: !state.isServerConfigOpen };

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