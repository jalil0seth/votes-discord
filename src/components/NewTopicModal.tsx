import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useConfig } from '../context/ConfigContext';
import { addDays, startOfWeek, isBefore, format } from 'date-fns';

export function NewTopicModal() {
  const { state, dispatch } = useApp();
  const { config } = useConfig();
  const currentMeeting = state.meetings[0];
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today);
  
  // Filter out past dates
  const availableDates = config.meetingDays
    .map(day => addDays(startOfCurrentWeek, day))
    .filter(date => !isBefore(date, today));

  const [formData, setFormData] = useState({
    title: '',
    category: currentMeeting.category || 'marketing',
    description: '',
    scheduledDate: availableDates[0],
    preferredTime: config.defaultTimes[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_TOPIC',
      payload: {
        id: crypto.randomUUID(),
        ...formData,
        votes: 0,
        createdAt: new Date(),
        resources: [],
        questions: [],
      },
    });
    dispatch({ type: 'TOGGLE_NEW_TOPIC_MODAL' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Suggest New Topic</h2>
              <p className="text-sm text-gray-400 mt-1">{config.serverName} • ID: {config.serverId}</p>
            </div>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_NEW_TOPIC_MODAL' })}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter topic title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!!currentMeeting.category}
            >
              <option value="marketing">Marketing</option>
              <option value="branding">Branding</option>
              <option value="blogging">Blogging</option>
              <option value="pinterest">Pinterest</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Preferred Date
              </label>
              <select
                value={formData.scheduledDate.toISOString()}
                onChange={(e) => setFormData({ ...formData, scheduledDate: new Date(e.target.value) })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableDates.map((date) => (
                  <option key={date.toISOString()} value={date.toISOString()}>
                    {format(date, 'EEE, MMM d')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Preferred Time
              </label>
              <select
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {config.defaultTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <div className="flex items-center space-x-2 text-gray-300 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Selected Schedule</span>
            </div>
            <p className="text-white text-lg">
              {format(formData.scheduledDate, 'EEEE, MMMM d')} at {formData.preferredTime}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="Describe your topic..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Submit Topic
          </button>
        </form>
      </div>
    </div>
  );
}