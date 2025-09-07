import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { addNotification } from '../store/slices/uiSlice';
import { fetchActionItems } from '../store/slices/actionSlice';

const ActionCenter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeSection] = useState<'immediate' | 'risks'>('immediate');
  
  // Get action items from Redux store
  const { actionItems, loading } = useSelector((state: RootState) => state.actions);
  
  // Fetch action items on component mount only if not already loaded
  useEffect(() => {
    if (actionItems.length === 0 && !loading) {
      dispatch(fetchActionItems());
    }
  }, [dispatch, actionItems.length, loading]);

  const handleAction = (action: string, itemId: string) => {
    dispatch(
      addNotification({
        type: 'info',
        message: `${action} action triggered for item ${itemId}`,
        title: 'Action Triggered',
      })
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
        return 'border-green-400 text-green-400';
      default:
        return 'border-gray-400 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'border-orange-400 text-orange-400';
      case 'in-progress':
        return 'border-blue-400 text-blue-400';
      case 'monitoring':
        return 'border-gray-400 text-gray-400';
      case 'resolved':
        return 'border-green-400 text-green-400';
      default:
        return 'border-gray-400 text-gray-400';
    }
  };

  const getDueDateText = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 0) {
      return 'Overdue';
    } else if (diffHours < 24) {
      return `Due in ${diffHours} hours`;
    } else {
      const diffDays = Math.ceil(diffHours / 24);
      return `Due in ${diffDays} days`;
    }
  };
  const Pill = ({
    label,
    color,
  }: {
    label: string;
    color: string;
  }) => (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium shadow-sm border ${color}`}
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
      className={`flex items-center px-3 py-1 rounded-full text-xs font-medium 
                  text-white shadow-sm transition-colors ${color}`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-[#0B1623] rounded-lg p-6 h-full">
      <h2 className="text-xl font-semibold mb-4 text-white">Action Center</h2>

      {loading ? (
        <div className="mb-6">
          <h3 className="text-md font-small mb-3 text-white">
            IMMEDIATE ACTION REQUIRED
          </h3>
          <div className="text-gray-400 text-center py-8">Loading action items...</div>
        </div>
      ) : actionItems && actionItems.length > 0 ? (
        <div className="mb-6">
          <h3 className="text-md font-small mb-3 text-white">
            IMMEDIATE ACTION REQUIRED
          </h3>
          <div className="space-y-3">
            {actionItems.map((item) => (
              <div key={item.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-white text-base">
                    {item.title}
                  </h4>
                  <div className="flex space-x-2">
                    <Pill label={item.priority} color={getPriorityColor(item.priority)} />
                    <Pill label={item.status} color={getStatusColor(item.status)} />
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{getDueDateText(item.dueDate)}</span>
                  <div className="flex space-x-3">
                    <ActionButton
                      label="Flag Risk"
                      color="bg-red-600 hover:bg-red-700"
                      onClick={() => handleAction('Flag Risk', item.id)}
                    />
                    <ActionButton
                      label="Update"
                      color="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleAction('Update Status', item.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <h3 className="text-md font-small mb-3 text-white">
            IMMEDIATE ACTION REQUIRED
          </h3>
          <div className="text-gray-400 text-center py-8">No action items found</div>
        </div>
      )}

      {/* Additional sections can be added here if needed */}
    </div>
  );
};

export default ActionCenter;
