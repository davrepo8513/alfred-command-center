import { apiClient } from '../utils/apiClient';

export interface NetworkOverview {
  networkStats: {
    totalProjects: number;
    activeSites: number;
    totalCapacity: number;
    networkProgress: number;
  };
  regionalDistribution: Array<{
    state: string;
    count: number;
  }>;
}

export interface ProjectSchematic {
  projectId: string;
  projectName: string;
  progress: number;
  spi: number;
  workflowStages: Array<{
    title: string;
    color: string;
    tasks: Array<{
      name: string;
      progress: number;
      status: 'completed' | 'in-progress' | 'risk' | 'pending';
      buttonText: string;
    }>;
  }>;
}

export class ProjectService {
  /**
   * Get network overview data for the modal
   */
  static async getNetworkOverview(): Promise<NetworkOverview> {
    const response = await apiClient.get('/api/projects/network/overview');
    return response.data;
  }

  /**
   * Get project schematic data for the modal
   */
  static async getProjectSchematic(projectId: string): Promise<ProjectSchematic> {
    const response = await apiClient.get(`/api/projects/${projectId}/schematic`);
    return response.data;
  }

  /**
   * Export network report as Excel
   */
  static async exportNetworkReport(): Promise<Blob> {
    const response = await apiClient.get('/api/projects/export/report', {
      responseType: 'blob'
    });
    return response.data;
  }
}
