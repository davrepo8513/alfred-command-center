import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { removeNotification } from '../store/slices/uiSlice';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const NotificationContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: RootState) => state.ui);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-600" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-orange-600" />;
      case 'info':
        return <Info size={20} className="text-blue-600" />;
      default:
        return <Info size={20} className="text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-white border-green-500 text-green-600';
      case 'error':
        return 'bg-white border-red-500 text-red-600';
      case 'warning':
        return 'bg-white border-orange-500 text-orange-600';
      case 'info':
        return 'bg-white border-blue-500 text-blue-600';
      default:
        return 'bg-white border-gray-500 text-gray-600';
    }
  };

  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`max-w-sm w-full border-2 rounded-lg p-4 shadow-lg transition-all duration-300 transform ${getNotificationColor(
            notification.type
          )}`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              {notification.title && (
                <h4 className={`text-sm font-semibold mb-1 ${getNotificationColor(notification.type).split(' ')[2]}`}>{notification.title}</h4>
              )}
              <p className={`text-sm leading-relaxed ${getNotificationColor(notification.type).split(' ')[2]}`}>{notification.message}</p>
            </div>
            <button
              onClick={() => dispatch(removeNotification(notification.id))}
              className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;

