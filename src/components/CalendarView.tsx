import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useConfig } from '../context/ConfigContext';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isBefore, isToday } from 'date-fns';
import { MessageSquare, Video, Link as LinkIcon, Users, ChevronLeft, ChevronRight } from 'lucide-react';

export function CalendarView() {
  const { state, dispatch } = useApp();
  const { config } = useConfig();
  const currentMeeting = state.meetings[0];
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const startOfCurrentWeek = startOfWeek(currentDate);
  const startOfNextWeek = addWeeks(startOfCurrentWeek, 1);

  const getWeekDays = (startDate: Date) => {
    return config.meetingDays
      .map(day => {
        const date = addDays(startDate, day);
        if (day < startDate.getDay()) {
          return addDays(date, 7);
        }
        return date;
      })
      .sort((a, b) => a.getTime() - b.getTime());
  };

  const currentWeekDays = getWeekDays(startOfCurrentWeek);
  const nextWeekDays = getWeekDays(startOfNextWeek);

  const getTopicForDate = (date: Date) => {
    return state.topics.find(topic => 
      format(new Date(topic.scheduledDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const handlePreviousWeek = () => {
    setCurrentDate(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(prev => addWeeks(prev, 1));
  };

  const handleGoToToday = () => {
    setCurrentDate(today);
  };

  const renderSelectedTopicStatus = () => {
    if (!currentMeeting.selectedTopic) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Selected Topic: {currentMeeting.selectedTopic.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{currentMeeting.selectedTopic.description}</p>
            
            <div className="flex items-center space-x-6">
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'resources' })}
                className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <Video className="w-4 h-4" />
                <span>{currentMeeting.selectedTopic.resources?.length || 0} Resources</span>
              </button>
              
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'questions' })}
                className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{currentMeeting.selectedTopic.questions?.length || 0} Questions</span>
              </button>
              
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>{currentMeeting.selectedTopic.participants?.length || 0} Participants</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeek = (weekDays: Date[], weekTitle: string) => (
    <div className="mb-8 last:mb-0">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{weekTitle}</h2>
      <div className="grid grid-cols-4 gap-4">
        {weekDays.map((date) => {
          const topic = getTopicForDate(date);
          const isCurrentDay = isToday(date);
          const isPast = isBefore(date, today);

          return (
            <div
              key={date.toISOString()}
              className={`
                p-4 rounded-lg border
                ${isCurrentDay ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'}
                ${isPast ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {format(date, 'EEEE')}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {format(date, 'MMM d')}
                </span>
              </div>
              {topic ? (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    {topic.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{topic.participants?.length || 0} joined</span>
                      </div>
                      {!isPast && (
                        topic.id === currentMeeting.selectedTopic?.id ? (
                          <button
                            onClick={() => dispatch({
                              type: 'JOIN_TOPIC',
                              payload: { topicId: topic.id }
                            })}
                            className="text-blue-600 hover:text-blue-500"
                          >
                            Join Discussion
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              dispatch({
                                type: 'SELECT_TOPIC',
                                payload: { meetingId: currentMeeting.id, topicId: topic.id }
                              });
                            }}
                            className="text-blue-600 hover:text-blue-500"
                          >
                            Select
                          </button>
                        )
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      {topic.resources?.map(resource => (
                        <span key={resource.id} className="mr-2">
                          {resource.type === 'video' ? (
                            <Video className="w-4 h-4" />
                          ) : (
                            <LinkIcon className="w-4 h-4" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : !isPast && state.topics.length < 4 ? (
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_NEW_TOPIC_MODAL' })}
                  className="w-full py-2 px-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                >
                  + Add Topic
                </button>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {isPast ? 'Past date' : 'No topic scheduled'}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      {renderSelectedTopicStatus()}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{config.serverName}</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousWeek}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleGoToToday}
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Today
            </button>
            <button
              onClick={handleNextWeek}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {renderWeek(currentWeekDays, "This Week")}
      {renderWeek(nextWeekDays, "Next Week")}
    </div>
  );
}