import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { addNotification } from '../store/slices/uiSlice';
import { fetchCommunications } from '../store/slices/communicationSlice';

const CommunicationHub: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Get communications from Redux store
  const { communications, loading } = useSelector((state: RootState) => state.communications);
  
  // Fetch communications on component mount
  useEffect(() => {
    dispatch(fetchCommunications());
  }, [dispatch]);

  const [activeTab, setActiveTab] = useState<'communications' | 'ai-assistant'>(
    'communications',
  );

  const handleAction = (action: string, communicationId: string) => {
    dispatch(
      addNotification({
        type: 'info',
        message: `${action} action triggered for communication ${communicationId}`,
        title: 'Action Triggered',
      }),
    );
  };

  // Helper functions for dynamic styling
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'border-red-400 text-red-400';
      case 'medium':
        return 'border-orange-400 text-orange-400';
      case 'low':
      case 'normal':
        return 'border-green-400 text-green-400';
      default:
        return 'border-gray-400 text-gray-400';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'ai':
        return 'bg-blue-600';
      case 'contractor':
      case 'c':
        return 'bg-green-600';
      case 'authority':
      case 'a':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const time = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - time.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  const Pill = ({ label, color }: { label: string; color: string }) => (
    <span
      className={`px-3 py-0.5 text-xs rounded-full font-medium border ${color}`}
    >
      {label}
    </span>
  );

  const ActionButton = ({
    label,
    color,
    onClick,
  }: {
    label: string;
    color: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-8 py-1 rounded-md text-sm font-medium transition-colors ${color}`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-[#0B1623] rounded-xl p-6 h-full shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-white">
        Communication Hub
      </h2>
      <div className="flex mb-6 bg-[#111827] rounded-lg overflow-hidden">
        <button
          onClick={() => setActiveTab('communications')}
          className={`w-1/2 px-6 py-2 text-sm font-medium transition-all ${
            activeTab === 'communications'
              ? 'bg-[#22d3ee] text-black'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Communications
        </button>
        <button
          onClick={() => setActiveTab('ai-assistant')}
          className={`w-1/2 px-6 py-2 text-sm font-medium transition-all ${
            activeTab === 'ai-assistant'
              ? 'bg-[#22d3ee] text-black'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          AI Assistant
        </button>
      </div>

      {activeTab === 'communications' && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-gray-400 text-center py-8">Loading communications...</div>
          ) : communications && communications.length > 0 ? (
            communications.map((item) => (
            <div
              key={item.id}
              className="bg-[#1f2937] rounded-lg p-5 border border-gray-700 hover:border-gray-500 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div>
                    <h4 className="font-semibold text-white text-base">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">{getTimeAgo(item.postedAt)}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Pill label={item.priority} color={getPriorityColor(item.priority)} />
                  <Pill label={item.source} color="border-blue-400 text-blue-400" />
                  {item.isAI && (
                    <Pill label="AI Generated" color="border-purple-400 text-purple-400" />
                  )}
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {item.content}
              </p>

              <div className="flex space-x-5 justify-center">
                <ActionButton
                  label="Flag Risk"
                  color="bg-red-600 text-white hover:bg-red-700"
                  onClick={() => handleAction('Flag Risk', item.id)}
                />
                <ActionButton
                  label="Clarify"
                  color="bg-gray-600 text-white hover:bg-gray-700"
                  onClick={() => handleAction('Clarify', item.id)}
                />
                <ActionButton
                  label="Update"
                  color="bg-[#10b981] text-white hover:bg-green-700"
                  onClick={() => handleAction('Update', item.id)}
                />
              </div>
            </div>
          ))
          ) : (
            <div className="text-gray-400 text-center py-8">No communications found</div>
          )}
        </div>
      )}

      {activeTab === 'ai-assistant' && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-white mb-3">
            AI Assistant
          </h3>
          <p className="text-gray-400 text-base mb-6 max-w-md mx-auto leading-relaxed">
            Get AI-powered insights and recommendations for your projects.
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunicationHub;
