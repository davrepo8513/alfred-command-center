import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Communication {
  id: string;
  type: 'insight' | 'status-update' | 'permit' | 'risk';
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  source: 'ai' | 'contractor' | 'authority' | 'system';
  projectId: string;
  tags: string[];
  postedAt: string;
  isAI: boolean;
}

interface CommunicationState {
  communications: Communication[];
  filteredCommunications: Communication[];
  loading: boolean;
  error: string | null;
  filters: {
    projectId?: string;
    type?: string;
    priority?: string;
  };
}

const initialState: CommunicationState = {
  communications: [],
  filteredCommunications: [],
  loading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchCommunications = createAsyncThunk(
  'communications/fetchCommunications',
  async (filters?: { projectId?: string; type?: string; priority?: string }) => {
    const params = new URLSearchParams();
    if (filters?.projectId) params.append('projectId', filters.projectId);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.priority) params.append('priority', filters.priority);
    
    const url = `http://localhost:3001/api/communications${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
  }
);

export const createCommunication = createAsyncThunk(
  'communications/createCommunication',
  async (communication: Omit<Communication, 'id' | 'postedAt'>) => {
    const response = await fetch('http://localhost:3001/api/communications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(communication),
    });
    const data = await response.json();
    return data.data;
  }
);

export const generateAIInsight = createAsyncThunk(
  'communications/generateAIInsight',
  async ({ projectId, riskType, description }: { projectId: string; riskType: string; description: string }) => {
    const response = await fetch('http://localhost:3001/api/communications/ai-insight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectId, riskType, description }),
    });
    const data = await response.json();
    return data.data;
  }
);

export const simulateUpdate = createAsyncThunk(
  'communications/simulateUpdate',
  async () => {
    const response = await fetch('http://localhost:3001/api/communications/simulate-update', {
      method: 'POST',
    });
    const data = await response.json();
    return data.data;
  }
);

const communicationSlice = createSlice({
  name: 'communications',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<{ projectId?: string; type?: string; priority?: string }>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Apply filters
      let filtered = [...state.communications];
      if (state.filters.projectId) {
        filtered = filtered.filter(c => c.projectId === state.filters.projectId);
      }
      if (state.filters.type) {
        filtered = filtered.filter(c => c.type === state.filters.type);
      }
      if (state.filters.priority) {
        filtered = filtered.filter(c => c.priority === state.filters.priority);
      }
      state.filteredCommunications = filtered;
    },
    addCommunication: (state, action: PayloadAction<Communication>) => {
      state.communications.unshift(action.payload);
      // Apply current filters to new communication
      let shouldShow = true;
      if (state.filters.projectId && action.payload.projectId !== state.filters.projectId) {
        shouldShow = false;
      }
      if (state.filters.type && action.payload.type !== state.filters.type) {
        shouldShow = false;
      }
      if (state.filters.priority && action.payload.priority !== state.filters.priority) {
        shouldShow = false;
      }
      if (shouldShow) {
        state.filteredCommunications.unshift(action.payload);
      }
    },
    clearFilters: (state) => {
      state.filters = {};
      state.filteredCommunications = [...state.communications];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunications.fulfilled, (state, action) => {
        state.loading = false;
        state.communications = action.payload;
        state.filteredCommunications = action.payload;
      })
      .addCase(fetchCommunications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch communications';
      })
      .addCase(createCommunication.fulfilled, (state, action) => {
        state.communications.unshift(action.payload);
        state.filteredCommunications.unshift(action.payload);
      })
      .addCase(generateAIInsight.fulfilled, (state, action) => {
        state.communications.unshift(action.payload);
        state.filteredCommunications.unshift(action.payload);
      })
      .addCase(simulateUpdate.fulfilled, (state, action) => {
        state.communications.unshift(action.payload);
        state.filteredCommunications.unshift(action.payload);
      });
  },
});

export const { setFilters, addCommunication, clearFilters } = communicationSlice.actions;
export default communicationSlice.reducer;
