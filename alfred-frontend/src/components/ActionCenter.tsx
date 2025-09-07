import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { addNotification } from '../store/slices/uiSlice';
import { fetchActionItems, updateActionItem, createRiskAssessment } from '../store/slices/actionSlice';
import ActionModal from './ActionModal';

const ActionCenter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const [activeSection] = useState<'immediate' | 'risks'>('immediate'); // Reserved for future use
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    actionType: 'update' | 'clarify' | 'flag-risk' | null;
    actionItem: any;
    loading: boolean;
  }>({
    isOpen: false,
    actionType: null,
    actionItem: null,
    loading: false
  });
  
  // Get action items from Redux store
  const { actionItems, loading } = useSelector((state: RootState) => state.actions);
  
  // Fetch action items on component mount only if not already loaded
  useEffect(() => {
    if (actionItems.length === 0 && !loading) {
      dispatch(fetchActionItems());
    }
  }, [dispatch, actionItems.length, loading]);

  const openModal = (actionType: 'update' | 'clarify' | 'flag-risk', actionItem: any) => {
    setModalState({
      isOpen: true,
      actionType,
      actionItem,
      loading: false
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      actionType: null,
      actionItem: null,
      loading: false
    });
  };

  const handleModalSubmit = async (formData: any) => {
    setModalState(prev => ({ ...prev, loading: true }));
    
    try {
      switch (modalState.actionType) {
        case 'update':
          await dispatch(updateActionItem({
            id: modalState.actionItem.id,
            updateData: {
              status: formData.status,
              priority: formData.priority,
              description: formData.notes ? `${modalState.actionItem.description}\n\nUpdate: ${formData.notes}` : modalState.actionItem.description
            }
          })).unwrap();
          
          dispatch(addNotification({
            type: 'success',
            message: `Action item "${modalState.actionItem.title}" updated successfully`,
            title: 'Update Complete'
          }));
          break;

        case 'clarify':
          // Create a new action item for clarification request
          await dispatch(createRiskAssessment({
            projectId: modalState.actionItem.projectId,
            riskType: 'Clarification Request',
            description: `Clarification needed for: ${modalState.actionItem.title}\n\nRequest: ${formData.notes}`,
            impact: 'medium',
            probability: 'high',
            mitigation: 'Awaiting response from relevant team member',
            status: 'open'
          })).unwrap();
          
          dispatch(addNotification({
            type: 'info',
            message: `Clarification request sent for "${modalState.actionItem.title}"`,
            title: 'Clarification Requested'
          }));
          break;

        case 'flag-risk':
          await dispatch(createRiskAssessment({
            projectId: modalState.actionItem.projectId,
            riskType: formData.riskType,
            description: formData.notes,
            impact: formData.impact,
            probability: formData.probability,
            mitigation: formData.mitigation,
            status: 'open'
          })).unwrap();
          
          dispatch(addNotification({
            type: 'warning',
            message: `Risk flagged for "${modalState.actionItem.title}"`,
            title: 'Risk Flagged'
          }));
          break;
      }
      
      closeModal();
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: `Failed to ${modalState.actionType} action item`,
        title: 'Error'
      }));
      setModalState(prev => ({ ...prev, loading: false }));
    }
  };

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
    <div className="bg-[#0B1623] rounded-lg p-4 sm:p-6 h-full">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white">Action Center</h2>

      {loading ? (
        <div className="mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-md font-small mb-3 text-white">
            IMMEDIATE ACTION REQUIRED
          </h3>
          <div className="text-gray-400 text-center py-8">Loading action items...</div>
        </div>
      ) : actionItems && actionItems.length > 0 ? (
        <div className="mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-md font-small mb-3 text-white">
            IMMEDIATE ACTION REQUIRED
          </h3>
          <div className="space-y-3">
            {actionItems.map((item) => (
              <div key={item.id} className="bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-600">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-2 sm:space-y-0">
                  <h4 className="font-semibold text-white text-sm sm:text-base">
                    {item.title}
                  </h4>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    <Pill label={item.priority} color={getPriorityColor(item.priority)} />
                    <Pill label={item.status} color={getStatusColor(item.status)} />
                  </div>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm mb-3 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <span className="text-xs text-gray-400">{getDueDateText(item.dueDate)}</span>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <ActionButton
                      label="Flag Risk"
                      color="bg-red-600 hover:bg-red-700"
                      onClick={() => openModal('flag-risk', item)}
                    />
                    <ActionButton
                      label="Clarify"
                      color="bg-yellow-600 hover:bg-yellow-700"
                      onClick={() => openModal('clarify', item)}
                    />
                    <ActionButton
                      label="Update"
                      color="bg-blue-600 hover:bg-blue-700"
                      onClick={() => openModal('update', item)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-md font-small mb-3 text-white">
            IMMEDIATE ACTION REQUIRED
          </h3>
          <div className="text-gray-400 text-center py-8">No action items found</div>
        </div>
      )}

      
      {/* Action Modal */}
      {modalState.actionType && (
        <ActionModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          actionType={modalState.actionType}
          actionItem={modalState.actionItem}
          loading={modalState.loading}
        />
      )}
    </div>
  );
};

export default ActionCenter;
