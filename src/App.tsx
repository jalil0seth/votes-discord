import React from 'react';
import { TopicList } from './components/TopicList';
import { Navigation } from './components/Navigation';
import { NewTopicModal } from './components/NewTopicModal';
import { MeetingInfoModal } from './components/MeetingInfoModal';
import { ResourceModal } from './components/ResourceModal';
import { QuestionModal } from './components/QuestionModal';
import { AppProvider, useApp } from './context/AppContext';

function MainContent() {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <main className="container mx-auto px-4 py-4 max-w-3xl">
        <TopicList />
      </main>
      
      {state.isNewTopicModalOpen && <NewTopicModal />}
      {state.isMeetingModalOpen && <MeetingInfoModal />}
      {state.isResourceModalOpen && <ResourceModal />}
      {state.isQuestionModalOpen && <QuestionModal />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;