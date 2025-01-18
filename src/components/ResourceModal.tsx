import React, { useState } from 'react';
import { X, Video, Link as LinkIcon, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ResourceModal() {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    type: 'link' as 'video' | 'link' | 'article',
    url: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentMeeting = state.meetings[0];
    if (!currentMeeting.selectedTopic) return;

    dispatch({
      type: 'ADD_RESOURCE',
      payload: {
        topicId: currentMeeting.selectedTopic.id,
        resource: {
          id: crypto.randomUUID(),
          ...formData,
          addedBy: 'User ' + state.currentUserId.slice(0, 4),
          createdAt: new Date(),
        },
      },
    });
    dispatch({ type: 'TOGGLE_RESOURCE_MODAL' });
    setFormData({ title: '', type: 'link', url: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Add Resource</h2>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_RESOURCE_MODAL' })}
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
              placeholder="Resource title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'video' })}
                className={`flex items-center justify-center space-x-2 p-2 rounded-lg ${
                  formData.type === 'video'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'article' })}
                className={`flex items-center justify-center space-x-2 p-2 rounded-lg ${
                  formData.type === 'article'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Article</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'link' })}
                className={`flex items-center justify-center space-x-2 p-2 rounded-lg ${
                  formData.type === 'link'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Link</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Add Resource
          </button>
        </form>
      </div>
    </div>
  );
}