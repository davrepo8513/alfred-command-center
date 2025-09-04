import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Project {
  id: string;
  name: string;
  location: {
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  capacity: string;
  progress: number;
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  weather: WeatherData;
  createdAt: string;
  updatedAt: string;
}

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  condition: string;
  humidity: number;
  pressure: number;
  updatedAt: string;
}

export interface ProjectMetrics {
  totalCapacity: string;
  progress: number;
  deviation: string;
  completionDate: string;
}

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  metrics: ProjectMetrics | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  selectedProject: null,
  metrics: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    const response = await fetch('http://localhost:3001/api/projects');
    const data = await response.json();
    return data.data;
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id: string) => {
    const response = await fetch(`http://localhost:3001/api/projects/${id}`);
    const data = await response.json();
    return data.data;
  }
);

export const fetchProjectMetrics = createAsyncThunk(
  'projects/fetchProjectMetrics',
  async (id: string) => {
    const response = await fetch(`http://localhost:3001/api/projects/${id}/metrics`);
    const data = await response.json();
    return data.data;
  }
);

export const updateProjectProgress = createAsyncThunk(
  'projects/updateProjectProgress',
  async ({ id, progress }: { id: string; progress: number }) => {
    const response = await fetch(`http://localhost:3001/api/projects/${id}/progress`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ progress }),
    });
    const data = await response.json();
    return data.data;
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    setActiveProject: (state, action: PayloadAction<string>) => {
      const project = state.projects.find(p => p.id === action.payload);
      state.selectedProject = project || null;
    },
    updateProjectProgressLocal: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const project = state.projects.find(p => p.id === action.payload.id);
      if (project) {
        project.progress = action.payload.progress;
        project.updatedAt = new Date().toISOString();
      }
    },
    updateProjectWeather: (state, action: PayloadAction<{ projectId: string; weather: WeatherData }>) => {
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project) {
        project.weather = action.payload.weather;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectMetrics.fulfilled, (state, action) => {
        state.metrics = action.payload;
      })
      .addCase(updateProjectProgress.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.selectedProject?.id === action.payload.id) {
          state.selectedProject = action.payload;
        }
      });
  },
});

export const { setSelectedProject, setActiveProject, updateProjectProgressLocal, updateProjectWeather } = projectSlice.actions;
export default projectSlice.reducer;
