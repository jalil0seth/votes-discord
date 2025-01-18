import React from 'react';
import { TopicList } from './components/TopicList';
import { Navigation } from './components/Navigation';
import { MeetingInfoModal } from './components/MeetingInfoModal';
import { ResourceModal } from './components/ResourceModal';
import { QuestionModal } from './components/QuestionModal';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';

function MainContent() {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navigation />
      <TopicList />
      
      {state.isMeetingModalOpen && <MeetingInfoModal />}
      {state.isResourceModalOpen && <ResourceModal />}
      {state.isQuestionModalOpen && <QuestionModal />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ThemeProvider>
  );
}