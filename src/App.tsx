import React from 'react';
import { Navigation } from './components/Navigation';
import { CalendarView } from './components/CalendarView';
import { TopicView } from './components/TopicView';
import { TimeView } from './components/TimeView';
import { ResourcesView } from './components/ResourcesView';
import { QuestionsView } from './components/QuestionsView';
import { NewTopicModal } from './components/NewTopicModal';
import { MeetingInfoModal } from './components/MeetingInfoModal';
import { ResourceModal } from './components/ResourceModal';
import { QuestionModal } from './components/QuestionModal';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';

function MainContent() {
  const { state } = useApp();

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'calendar':
        return <CalendarView />;
      case 'topic':
        return <TopicView />;
      case 'time':
        return <TimeView />;
      case 'resources':
        return <ResourcesView />;
      case 'questions':
        return <QuestionsView />;
      default:
        return <CalendarView />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {renderCurrentView()}
      </main>
      
      {state.isNewTopicModalOpen && <NewTopicModal />}
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