import React from 'react';
import { useApp } from '../context/AppContext';
import { useConfig } from '../context/ConfigContext';
import { format, startOfWeek, addDays, addWeeks, isBefore, isToday } from 'date-fns';
import { MessageSquare, Video, Link as LinkIcon, Users } from 'lucide-react';

export function CalendarView() {
  const { state, dispatch } = useApp();
  const { config } = useConfig();
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today);
  const nextWeek = addWeeks(startOfCurrentWeek, 1);
  const lastWeek = addWeeks(startOfCurrentWeek, -1);

  const getWeekDays = (startDate: Date) => {
    // Use the meeting days from config
    return config.meetingDays
      .map(day => {
        const date = addDays(startDate, day);
        // If the day is less than the current day in the week, move it to next week
        if (day < startDate.getDay()) {
          return addDays(date, 7);
        }
        return date;
      })
      .sort((a, b) => a.getTime() - b.getTime());
  };

  const currentWeekDays = getWeekDays(startOfCurrentWeek);
  const nextWeekDays = getWeekDays(nextWeek);
  const lastWeekDays = getWeekDays(lastWeek);

  const getTopicForDate = (date: Date) => {
    return state.topics.find(topic => 
      format(new Date(topic.scheduledDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const renderWeek = (weekDays: Date[], weekTitle: string) => (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {weekTitle}
      </h2>
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
                        <button
                          onClick={() => dispatch({
                            type: 'JOIN_TOPIC',
                            payload: { topicId: topic.id }
                          })}
                          className="text-blue-600 hover:text-blue-500"
                        >
                          Join
                        </button>
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
    <div className="space-y-8">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{config.serverName}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Schedule and manage your marketing discussions
        </p>
      </div>

      {renderWeek(lastWeekDays, "Last Week")}
      {renderWeek(currentWeekDays, "This Week")}
      {renderWeek(nextWeekDays, "Next Week")}
    </div>
  );
}