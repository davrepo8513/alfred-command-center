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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

