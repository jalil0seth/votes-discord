import React from 'react';
import { useApp } from '../context/AppContext';
import { format, startOfWeek, addDays, addWeeks } from 'date-fns';

export function CalendarView() {
  const { state, dispatch } = useApp();
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today);
  const nextWeek = addWeeks(startOfCurrentWeek, 1);

  const days = ['Thursday', 'Friday', 'Saturday', 'Sunday'];
  const currentWeekDays = days.map((day, index) => addDays(startOfCurrentWeek, index + 4));
  const nextWeekDays = days.map((day, index) => addDays(nextWeek, index + 4));

  const getTopicForDate = (date: Date) => {
    return state.topics.find(topic => 
      format(topic.scheduledDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const renderWeek = (weekDays: Date[]) => (
    <div className="grid grid-cols-4 gap-4">
      {weekDays.map((date) => {
        const topic = getTopicForDate(date);
        const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
        const isPast = date < today;

        return (
          <div
            key={date.toISOString()}
            className={`
              p-4 rounded-lg border
              ${isToday ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'}
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
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  {topic.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {topic.votes} votes
                </p>
              </div>
            ) : !isPast && state.topics.length < 4 ? (
              <button
                onClick={() => dispatch({ type: 'TOGGLE_NEW_TOPIC_MODAL' })}
                className="w-full py-2 px-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                + Add Topic
              </button>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-500">No topic scheduled</p>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          This Week
        </h2>
        {renderWeek(currentWeekDays)}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Next Week
        </h2>
        {renderWeek(nextWeekDays)}
      </div>
    </div>
  );
}