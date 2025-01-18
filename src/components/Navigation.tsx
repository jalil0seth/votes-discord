import React from 'react';
import { ArrowRight, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

export function Navigation() {
  const { state, dispatch } = useApp();
  const { theme, toggleTheme } = useTheme();
  const currentMeeting = state.meetings[0];

  const getPhaseInfo = () => {
    switch (currentMeeting?.status) {
      case 'topic-selection':
        return {
          title: '1. Topic Selection',
          description: 'Vote for your preferred topic',
          nextAction: 'Move to Time Selection',
          canProceed: currentMeeting.selectedTopic !== undefined
        };
      case 'time-voting':
        return {
          title: '2. Time Selection',
          description: 'Choose the best meeting time',
          nextAction: 'Move to Preparation',
          canProceed: currentMeeting.selectedTimeSlot !== undefined
        };
      case 'preparation':
        return {
          title: '3. Meeting Preparation',
          description: 'Share resources and questions',
          nextAction: 'Finalize Meeting',
          canProceed: true
        };
      case 'scheduled':
        return {
          title: 'Meeting Scheduled',
          description: 'All set for the meeting',
          nextAction: 'Start New Meeting',
          canProceed: true
        };
      default:
        return {
          title: 'Digital Marketing Hub',
          description: 'Plan your next meeting',
          nextAction: 'Start Planning',
          canProceed: true
        };
    }
  };

  const handleNextPhase = () => {
    if (!currentMeeting) return;

    switch (currentMeeting.status) {
      case 'topic-selection':
        dispatch({ 
          type: 'SET_MEETING_STATUS', 
          payload: { meetingId: currentMeeting.id, status: 'time-voting' }
        });
        break;
      case 'time-voting':
        dispatch({ 
          type: 'SET_MEETING_STATUS', 
          payload: { meetingId: currentMeeting.id, status: 'preparation' }
        });
        break;
      case 'preparation':
        dispatch({ 
          type: 'SET_MEETING_STATUS', 
          payload: { meetingId: currentMeeting.id, status: 'scheduled' }
        });
        break;
      case 'scheduled':
        // Start a new meeting cycle
        dispatch({ 
          type: 'SET_MEETING_STATUS', 
          payload: { meetingId: currentMeeting.id, status: 'topic-selection' }
        });
        break;
      default:
        dispatch({ 
          type: 'SET_MEETING_STATUS', 
          payload: { meetingId: currentMeeting.id, status: 'topic-selection' }
        });
    }
  };

  const phaseInfo = getPhaseInfo();

  return (
    <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10 transition-colors">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between h-20">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {phaseInfo.title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {phaseInfo.description}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={handleNextPhase}
              disabled={!phaseInfo.canProceed}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                !phaseInfo.canProceed ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>{phaseInfo.nextAction}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}