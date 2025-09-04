import { Project, Communication, ActionItem, WeatherData, RiskAssessment } from '../types';

export const mockProjects: Project[] = [
  {
    id: 'site-alpha',
    name: 'Project Site Alpha',
    location: {
      city: 'Phoenix',
      state: 'AZ',
      coordinates: { lat: 33.4484, lng: -112.0740 }
    },
    capacity: '150 MM',
    progress: 40,
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    weather: {
      temperature: 23,
      windSpeed: 12,
      condition: 'Clear',
      humidity: 35,
      pressure: 1013,
      updatedAt: new Date().toISOString()
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'devra-50mw',
    name: 'Devra 50 MW',
    location: {
      city: 'Maharashtra',
      state: 'India',
      coordinates: { lat: 19.7515, lng: 75.7139 }
    },
    capacity: '50 MW',
    progress: 42,
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2024-10-15',
    weather: {
      temperature: 28,
      windSpeed: 8,
      condition: 'Partly Cloudy',
      humidity: 65,
      pressure: 1008,
      updatedAt: new Date().toISOString()
    },
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  }
];

export const mockCommunications: Communication[] = [
  {
    id: 'comm-1',
    type: 'insight',
    title: 'Alfred Insight: Risk Detected',
    content: 'Schedule conflict identified between equipment delivery and site preparation phases. Recommend immediate stakeholder coordination.',
    priority: 'high',
    source: 'ai',
    projectId: 'site-alpha',
    tags: ['High', 'AI Generated'],
    postedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    isAI: true
  },
  {
    id: 'comm-2',
    type: 'status-update',
    title: 'EPC Contractor Status Update',
    content: 'Foundation work progressing on schedule. Requesting confirmation on electrical delivery timeline.',
    priority: 'normal',
    source: 'contractor',
    projectId: 'site-alpha',
    tags: ['Normal'],
    postedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    isAI: false
  },
  {
    id: 'comm-3',
    type: 'permit',
    title: 'Environmental Permit Approved',
    content: 'Local authority has approved environmental impact assessment. Clearing work can proceed as planned.',
    priority: 'normal',
    source: 'authority',
    projectId: 'site-alpha',
    tags: ['Normal'],
    postedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    isAI: false
  }
];

export const mockActionItems: ActionItem[] = [
  {
    id: 'action-1',
    title: 'RFI from EPC Contractor',
    description: 'Technical review required for foundation specifications',
    priority: 'high',
    status: 'new',
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Due in 2 hours
    projectId: 'site-alpha',
    type: 'rfi',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'action-2',
    title: 'Logistics Delay Risk',
    description: 'Potential schedule conflict detected in equipment delivery timeline',
    priority: 'high',
    status: 'new',
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // Due in 4 hours
    projectId: 'site-alpha',
    type: 'risk',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'action-3',
    title: 'Weather Window Concern',
    description: 'Extended forecast shows potential impact on construction phase',
    priority: 'medium',
    status: 'monitoring',
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Due in 2 hours
    projectId: 'site-alpha',
    type: 'alert',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockRiskAssessments: RiskAssessment[] = [
  {
    id: 'risk-1',
    projectId: 'site-alpha',
    riskType: 'Schedule Conflict',
    description: 'Equipment delivery timeline conflicts with site preparation phase',
    impact: 'high',
    probability: 'medium',
    mitigation: 'Coordinate with logistics team and adjust site preparation schedule',
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'risk-2',
    projectId: 'devra-50mw',
    riskType: 'Monsoon Impact',
    description: 'Extended monsoon season may delay module delivery and installation',
    impact: 'medium',
    probability: 'high',
    mitigation: 'Implement weather contingency plan and adjust project timeline',
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockWeatherData: WeatherData[] = [
  {
    temperature: 23,
    windSpeed: 12,
    condition: 'Clear',
    humidity: 35,
    pressure: 1013,
    updatedAt: new Date().toISOString()
  },
  {
    temperature: 28,
    windSpeed: 8,
    condition: 'Partly Cloudy',
    humidity: 65,
    pressure: 1008,
    updatedAt: new Date().toISOString()
  }
];

// Helper function to generate random weather updates
export const generateWeatherUpdate = (baseWeather: WeatherData): WeatherData => {
  return {
    ...baseWeather,
    temperature: baseWeather.temperature + (Math.random() - 0.5) * 4,
    windSpeed: Math.max(0, baseWeather.windSpeed + (Math.random() - 0.5) * 6),
    humidity: Math.max(0, Math.min(100, baseWeather.humidity + (Math.random() - 0.5) * 10)),
    updatedAt: new Date().toISOString()
  };
};

// Helper function to simulate real-time updates
export const simulateRealTimeUpdate = () => {
  const randomIndex = Math.floor(Math.random() * mockCommunications.length);
  const communication = mockCommunications[randomIndex];
  
  return {
    ...communication,
    postedAt: new Date().toISOString(),
    id: `comm-${Date.now()}`
  };
};
