import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice';
import communicationReducer from './slices/communicationSlice';
import actionReducer from './slices/actionSlice';
import weatherReducer from './slices/weatherSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    projects: projectReducer,
    communications: communicationReducer,
    actions: actionReducer,
    weather: weatherReducer,
    ui: uiReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
