import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { addCommunication } from '../store/slices/communicationSlice';
import { addActionItem } from '../store/slices/actionSlice';
import { updateProjectProgressLocal, updateProjectWeather } from '../store/slices/projectSlice';
import { updateWeatherData } from '../store/slices/weatherSlice';
import { addNotification } from '../store/slices/uiSlice';

export const useSocket = () => {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);

  // Helper function to dispatch custom events
  const dispatchCustomEvent = (eventName: string) => {
    window.dispatchEvent(new CustomEvent(eventName));
  };

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:3001', {
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to Alfred backend');
      dispatchCustomEvent('socket-connect');
      dispatch(addNotification({
        type: 'success',
        message: 'Connected to real-time updates',
        title: 'Socket Connected'
      }));
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Alfred backend');
      dispatchCustomEvent('socket-disconnect');
      dispatch(addNotification({
        type: 'warning',
        message: 'Disconnected from real-time updates',
        title: 'Socket Disconnected'
      }));
    });

    // Real-time updates
    socket.on('communication-new', (data) => {
      console.log('New communication received:', data);
      dispatchCustomEvent('socket-update');
      dispatch(addCommunication(data));
      dispatch(addNotification({
        type: 'info',
        message: `New ${data.type} communication received`,
        title: 'New Communication'
      }));
    });

    socket.on('ai-insight', (data) => {
      console.log('AI insight received:', data);
      dispatchCustomEvent('socket-update');
      // Create a communication from the AI insight
      const aiCommunication = {
        id: data.id,
        type: 'insight' as const,
        title: `AI Insight: ${data.type}`,
        content: data.message,
        priority: data.priority,
        source: 'ai' as const,
        projectId: 'site-alpha',
        tags: ['ai', 'insight', data.type],
        postedAt: data.timestamp,
        isAI: true
      };
      dispatch(addCommunication(aiCommunication));
      dispatch(addNotification({
        type: 'info',
        message: 'New AI insight generated',
        title: 'AI Insight'
      }));
    });

    socket.on('action-new', (data) => {
      console.log('New action received:', data);
      dispatchCustomEvent('socket-update');
      dispatch(addActionItem(data));
      dispatch(addNotification({
        type: 'warning',
        message: `New ${data.type} action required`,
        title: 'New Action'
      }));
    });

    socket.on('project-update', (data) => {
      console.log('Project update received:', data);
      dispatchCustomEvent('socket-update');
      dispatch(updateProjectProgressLocal({
        id: data.id,
        progress: data.progress
      }));
      dispatch(addNotification({
        type: 'info',
        message: `Project progress updated to ${data.progress}%`,
        title: 'Progress Update'
      }));
    });

    socket.on('weather-update', (data) => {
      console.log('Weather update received:', data);
      dispatchCustomEvent('socket-update');
      // Update weather data for all locations
      const locations = ['mumbai', 'delhi', 'bangalore', 'chennai', 'hyderabad'];
      locations.forEach(location => {
        dispatch(updateWeatherData({
          location: location,
          weather: {
            ...data,
            location: location
          }
        }));
      });
      
      dispatch(addNotification({
        type: 'info',
        message: 'Weather data updated',
        title: 'Weather Update'
      }));
    });

    // Error handling
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      dispatchCustomEvent('socket-disconnect');
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to connect to real-time updates',
        title: 'Connection Error'
      }));
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [dispatch]);

  // Function to join a project room
  const joinProject = (projectId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-project', projectId);
    }
  };

  // Function to leave a project room
  const leaveProject = (projectId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave-project', projectId);
    }
  };

  return {
    socket: socketRef.current,
    joinProject,
    leaveProject,
  };
};

