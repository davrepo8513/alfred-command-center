import { Project } from '../models/Project';
import { Communication } from '../models/Communication';
import { ActionItem } from '../models/ActionItem';
import { WeatherData } from '../models/WeatherData';
import { RiskAssessment } from '../models/RiskAssessment';

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await Promise.all([
      Project.deleteMany({}),
      Communication.deleteMany({}),
      ActionItem.deleteMany({}),
      WeatherData.deleteMany({}),
      RiskAssessment.deleteMany({})
    ]);

    // Seed Projects
    const projects = await Project.create([
      {
        name: 'Site Alpha Solar Farm',
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          coordinates: { lat: 19.0760, lng: 72.8777 }
        },
        capacity: '50 MW',
        progress: 75,
        status: 'active',
        startDate: '2024-01-15',
        endDate: '2024-10-30',
        weather: {
          temperature: 28,
          windSpeed: 12,
          condition: 'Partly Cloudy',
          humidity: 65,
          pressure: 1008,
          updatedAt: new Date().toISOString()
        }
      },
      {
        name: 'Devra 50MW Project',
        location: {
          city: 'Delhi',
          state: 'Delhi',
          coordinates: { lat: 28.7041, lng: 77.1025 }
        },
        capacity: '50 MW',
        progress: 45,
        status: 'active',
        startDate: '2024-03-01',
        endDate: '2024-12-15',
        weather: {
          temperature: 32,
          windSpeed: 8,
          condition: 'Clear',
          humidity: 45,
          pressure: 1012,
          updatedAt: new Date().toISOString()
        }
      },
      {
        name: 'Bangalore Green Energy',
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          coordinates: { lat: 12.9716, lng: 77.5946 }
        },
        capacity: '75 MW',
        progress: 90,
        status: 'active',
        startDate: '2023-11-01',
        endDate: '2024-08-30',
        weather: {
          temperature: 25,
          windSpeed: 15,
          condition: 'Cloudy',
          humidity: 70,
          pressure: 1005,
          updatedAt: new Date().toISOString()
        }
      }
    ]);

    console.log(`Created ${projects.length} projects`);

    // Seed Communications
    const communications = await Communication.create([
      {
        type: 'insight',
        title: 'Schedule Conflict Detected',
        content: 'Equipment delivery timeline conflicts with site preparation phase. Recommend immediate stakeholder coordination.',
        priority: 'high',
        source: 'ai',
        projectId: projects[0].id,
        tags: ['schedule', 'conflict', 'coordination'],
        postedAt: new Date().toISOString(),
        isAI: true
      },
      {
        type: 'status-update',
        title: 'EPC Contractor Status Update',
        content: 'Foundation work progressing on schedule. Requesting confirmation on electrical delivery timeline.',
        priority: 'normal',
        source: 'contractor',
        projectId: projects[0].id,
        tags: ['foundation', 'electrical', 'progress'],
        postedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isAI: false
      },
      {
        type: 'permit',
        title: 'Environmental Permit Approved',
        content: 'Local authority has approved environmental impact assessment. Clearing work can proceed as planned.',
        priority: 'normal',
        source: 'authority',
        projectId: projects[0].id,
        tags: ['permit', 'environmental', 'approval'],
        postedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isAI: false
      }
    ]);

    console.log(`Created ${communications.length} communications`);

    // Seed Action Items
    const actionItems = await ActionItem.create([
      {
        title: 'RFI from EPC Contractor',
        description: 'Request for information regarding electrical equipment specifications and delivery timeline.',
        priority: 'high',
        status: 'new',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Due in 24 hours
        projectId: projects[0].id,
        type: 'rfi'
      },
      {
        title: 'Logistics Delay Risk',
        description: 'Potential schedule conflict detected in equipment delivery timeline.',
        priority: 'high',
        status: 'new',
        dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // Due in 4 hours
        projectId: projects[0].id,
        type: 'risk'
      },
      {
        title: 'Weather Window Concern',
        description: 'Extended forecast shows potential impact on construction phase.',
        priority: 'medium',
        status: 'monitoring',
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Due in 2 hours
        projectId: projects[0].id,
        type: 'alert'
      }
    ]);

    console.log(`Created ${actionItems.length} action items`);

    // Seed Weather Data
    const weatherData = await WeatherData.create([
      {
        location: 'mumbai',
        temperature: 28,
        windSpeed: 12,
        condition: 'Partly Cloudy',
        humidity: 65,
        pressure: 1008,
        updatedAt: new Date().toISOString()
      },
      {
        location: 'delhi',
        temperature: 32,
        windSpeed: 8,
        condition: 'Clear',
        humidity: 45,
        pressure: 1012,
        updatedAt: new Date().toISOString()
      },
      {
        location: 'bangalore',
        temperature: 25,
        windSpeed: 15,
        condition: 'Cloudy',
        humidity: 70,
        pressure: 1005,
        updatedAt: new Date().toISOString()
      }
    ]);

    console.log(`Created ${weatherData.length} weather records`);

    // Seed Risk Assessments
    const riskAssessments = await RiskAssessment.create([
      {
        projectId: projects[0].id,
        riskType: 'Schedule Conflict',
        description: 'Equipment delivery timeline conflicts with site preparation phase',
        impact: 'high',
        probability: 'medium',
        mitigation: 'Coordinate with logistics team and adjust site preparation schedule',
        status: 'open'
      },
      {
        projectId: projects[1].id,
        riskType: 'Monsoon Impact',
        description: 'Extended monsoon season may delay module delivery and installation',
        impact: 'medium',
        probability: 'high',
        mitigation: 'Implement weather contingency plan and adjust project timeline',
        status: 'open'
      }
    ]);

    console.log(`Created ${riskAssessments.length} risk assessments`);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  }
};

export const clearDatabase = async (): Promise<void> => {
  try {
    await Promise.all([
      Project.deleteMany({}),
      Communication.deleteMany({}),
      ActionItem.deleteMany({}),
      WeatherData.deleteMany({}),
      RiskAssessment.deleteMany({})
    ]);
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Failed to clear database:', error);
    throw error;
  }
};
