import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ModalState {
  isOpen: boolean;
  type: 'project-details' | 'communication-form' | 'action-form' | 'risk-form' | 'weather-forecast' | null;
  data?: any;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
  timestamp: string;
}

interface UIState {
  sidebarCollapsed: boolean;
  activeTab: 'command-centre' | 'reporting-compliance';
  activeProject: string | null;
  modals: ModalState[];
  notifications: Notification[];
  theme: 'dark' | 'light';
  loadingStates: Record<string, boolean>;
}

const initialState: UIState = {
  sidebarCollapsed: false,
  activeTab: 'command-centre',
  activeProject: null,
  modals: [],
  notifications: [],
  theme: 'dark',
  loadingStates: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setActiveTab: (state, action: PayloadAction<'command-centre' | 'reporting-compliance'>) => {
      state.activeTab = action.payload;
    },
    setActiveProject: (state, action: PayloadAction<string | null>) => {
      state.activeProject = action.payload;
    },
    openModal: (state, action: PayloadAction<{ type: ModalState['type']; data?: any }>) => {
      const modal: ModalState = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data,
      };
      state.modals.push(modal);
    },
    closeModal: (state, action: PayloadAction<{ type: ModalState['type'] }>) => {
      const modalIndex = state.modals.findIndex(m => m.type === action.payload.type);
      if (modalIndex !== -1) {
        state.modals[modalIndex].isOpen = false;
      }
    },
    closeAllModals: (state) => {
      state.modals = state.modals.map(modal => ({ ...modal, isOpen: false }));
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: `notification-${Date.now()}`,
        timestamp: new Date().toISOString(),
        duration: action.payload.duration || 5000,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
    },
    setLoadingState: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      const { key, loading } = action.payload;
      state.loadingStates[key] = loading;
    },
    clearLoadingState: (state, action: PayloadAction<string>) => {
      delete state.loadingStates[key];
    },
  },
});

export const {
  toggleSidebar,
  setActiveTab,
  setActiveProject,
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearNotifications,
  toggleTheme,
  setTheme,
  setLoadingState,
  clearLoadingState,
} = uiSlice.actions;

export default uiSlice.reducer;
