export interface Topic {
  id: string;
  title: string;
  category: 'marketing' | 'branding' | 'blogging' | 'pinterest';
  description: string;
  votes: number;
  createdAt: Date;
  resources?: Resource[];
  questions?: Question[];
}

export interface Resource {
  id: string;
  type: 'video' | 'link';
  title: string;
  url: string;
  addedBy: string;
  createdAt: Date;
}

export interface Question {
  id: string;
  content: string;
  askedBy: string;
  createdAt: Date;
  answer?: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  votes: number;
}

export interface Meeting {
  id: string;
  status: 'topic-selection' | 'time-voting' | 'preparation' | 'scheduled';
  date: Date;
  topicVotingEndsAt: Date;
  timeVotingEndsAt: Date;
  selectedTopic?: Topic;
  timeSlots: TimeSlot[];
  selectedTimeSlot?: TimeSlot;
  category?: string;
}

export interface AppState {
  topics: Topic[];
  selectedCategory: string | null;
  meetings: Meeting[];
  currentMeeting: Meeting | null;
  isNewTopicModalOpen: boolean;
  isMeetingModalOpen: boolean;
  isResourceModalOpen: boolean;
  isQuestionModalOpen: boolean;
}

export type AppAction = 
  | { type: 'ADD_TOPIC'; payload: Topic }
  | { type: 'VOTE_TOPIC'; payload: { id: string; value: 1 | -1 } }
  | { type: 'SET_CATEGORY'; payload: string | null }
  | { type: 'VOTE_TIME_SLOT'; payload: { meetingId: string; slotId: string } }
  | { type: 'TOGGLE_NEW_TOPIC_MODAL' }
  | { type: 'TOGGLE_MEETING_MODAL' }
  | { type: 'TOGGLE_RESOURCE_MODAL' }
  | { type: 'TOGGLE_QUESTION_MODAL' }
  | { type: 'ADD_RESOURCE'; payload: { topicId: string; resource: Resource } }
  | { type: 'ADD_QUESTION'; payload: { topicId: string; question: Question } }
  | { type: 'ANSWER_QUESTION'; payload: { topicId: string; questionId: string; answer: string } }
  | { type: 'SELECT_TOPIC'; payload: { meetingId: string; topicId: string } }
  | { type: 'SELECT_TIME_SLOT'; payload: { meetingId: string; slotId: string } }
  | { type: 'SET_MEETING_STATUS'; payload: { meetingId: string; status: Meeting['status'] } }
  | { type: 'SET_MEETING_CATEGORY'; payload: { meetingId: string; category: string } };