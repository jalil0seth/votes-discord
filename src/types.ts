// Add these types to your existing types.ts file

export interface Participant {
  id: string;
  name: string;
  joinedAt: Date;
}

// Update the Topic interface
export interface Topic {
  // ... existing properties ...
  participants?: Participant[];
}

// Add to AppAction type
| { type: 'JOIN_TOPIC'; payload: { topicId: string } }
| { type: 'TOGGLE_SERVER_CONFIG' };