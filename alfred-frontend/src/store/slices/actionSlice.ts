import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in-progress' | 'monitoring' | 'resolved';
  dueDate: string;
  projectId: string;
  type: 'rfi' | 'risk' | 'task' | 'alert';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiskAssessment {
  id: string;
  projectId: string;
  riskType: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  probability: 'low' | 'medium' | 'high';
  mitigation: string;
  status: 'open' | 'mitigated' | 'closed';
  createdAt: string;
  updatedAt: string;
}

interface ActionState {
  actionItems: ActionItem[];
  riskAssessments: RiskAssessment[];
  filteredActions: ActionItem[];
  filteredRisks: RiskAssessment[];
  loading: boolean;
  error: string | null;
  filters: {
    projectId?: string;
    priority?: string;
    status?: string;
    type?: string;
  };
}

const initialState: ActionState = {
  actionItems: [],
  riskAssessments: [],
  filteredActions: [],
  filteredRisks: [],
  loading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchActionItems = createAsyncThunk(
  'actions/fetchActionItems',
  async (filters?: { projectId?: string; priority?: string; status?: string; type?: string }) => {
    const params = new URLSearchParams();
    if (filters?.projectId) params.append('projectId', filters.projectId);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    
    const url = `http://localhost:3001/api/actions${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
  }
);

export const fetchRiskAssessments = createAsyncThunk(
  'actions/fetchRiskAssessments',
  async (filters?: { projectId?: string; impact?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.projectId) params.append('projectId', filters.projectId);
    if (filters?.impact) params.append('impact', filters.impact);
    if (filters?.status) params.append('status', filters.status);
    
    const url = `http://localhost:3001/api/actions/risks/all${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
  }
);

export const createActionItem = createAsyncThunk(
  'actions/createActionItem',
  async (actionItem: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('http://localhost:3001/api/actions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(actionItem),
    });
    const data = await response.json();
    return data.data;
  }
);

export const updateActionStatus = createAsyncThunk(
  'actions/updateActionStatus',
  async ({ id, status }: { id: string; status: ActionItem['status'] }) => {
    const response = await fetch(`http://localhost:3001/api/actions/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    return data.data;
  }
);

export const createRiskAssessment = createAsyncThunk(
  'actions/createRiskAssessment',
  async (risk: Omit<RiskAssessment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('http://localhost:3001/api/actions/risks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(risk),
    });
    const data = await response.json();
    return data.data;
  }
);

const actionSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<{ projectId?: string; priority?: string; status?: string; type?: string }>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Apply filters to actions
      let filteredActions = [...state.actionItems];
      if (state.filters.projectId) {
        filteredActions = filteredActions.filter(a => a.projectId === state.filters.projectId);
      }
      if (state.filters.priority) {
        filteredActions = filteredActions.filter(a => a.priority === state.filters.priority);
      }
      if (state.filters.status) {
        filteredActions = filteredActions.filter(a => a.status === state.filters.status);
      }
      if (state.filters.type) {
        filteredActions = filteredActions.filter(a => a.type === state.filters.type);
      }
      state.filteredActions = filteredActions;
    },
    addActionItem: (state, action: PayloadAction<ActionItem>) => {
      state.actionItems.unshift(action.payload);
      // Apply current filters
      let shouldShow = true;
      if (state.filters.projectId && action.payload.projectId !== state.filters.projectId) {
        shouldShow = false;
      }
      if (state.filters.priority && action.payload.priority !== state.filters.priority) {
        shouldShow = false;
      }
      if (state.filters.status && action.payload.status !== state.filters.status) {
        shouldShow = false;
      }
      if (state.filters.type && action.payload.type !== state.filters.type) {
        shouldShow = false;
      }
      if (shouldShow) {
        state.filteredActions.unshift(action.payload);
      }
    },
    addRiskAssessment: (state, action: PayloadAction<RiskAssessment>) => {
      state.riskAssessments.unshift(action.payload);
      // Apply current filters
      let shouldShow = true;
      if (state.filters.projectId && action.payload.projectId !== state.filters.projectId) {
        shouldShow = false;
      }
      if (shouldShow) {
        state.filteredRisks.unshift(action.payload);
      }
    },
    clearFilters: (state) => {
      state.filters = {};
      state.filteredActions = [...state.actionItems];
      state.filteredRisks = [...state.riskAssessments];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActionItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActionItems.fulfilled, (state, action) => {
        state.loading = false;
        state.actionItems = action.payload;
        state.filteredActions = action.payload;
      })
      .addCase(fetchActionItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch action items';
      })
      .addCase(fetchRiskAssessments.fulfilled, (state, action) => {
        state.riskAssessments = action.payload;
        state.filteredRisks = action.payload;
      })
      .addCase(createActionItem.fulfilled, (state, action) => {
        state.actionItems.unshift(action.payload);
        state.filteredActions.unshift(action.payload);
      })
      .addCase(updateActionStatus.fulfilled, (state, action) => {
        const index = state.actionItems.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.actionItems[index] = action.payload;
        }
        const filteredIndex = state.filteredActions.findIndex(a => a.id === action.payload.id);
        if (filteredIndex !== -1) {
          state.filteredActions[filteredIndex] = action.payload;
        }
      })
      .addCase(createRiskAssessment.fulfilled, (state, action) => {
        state.riskAssessments.unshift(action.payload);
        state.filteredRisks.unshift(action.payload);
      });
  },
});

export const { setFilters, addActionItem, addRiskAssessment, clearFilters } = actionSlice.actions;
export default actionSlice.reducer;
