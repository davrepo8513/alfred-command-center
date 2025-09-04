import { Project, IProject } from '../models/Project';
import { ProjectMetrics } from '../types';

export class ProjectService {
  /**
   * Get all projects with optional filtering
   */
  static async getAllProjects(filters: any = {}): Promise<IProject[]> {
    try {
      const query = Project.find(filters).sort({ createdAt: -1 });
      return await query.exec();
    } catch (error) {
      throw new Error(`Failed to fetch projects: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get project by ID
   */
  static async getProjectById(id: string): Promise<IProject | null> {
    try {
      return await Project.findById(id).exec();
    } catch (error) {
      throw new Error(`Failed to fetch project: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create new project
   */
  static async createProject(projectData: Partial<IProject>): Promise<IProject> {
    try {
      const project = new Project({
        ...projectData,
        progress: projectData.progress || 0,
        status: projectData.status || 'active'
      });
      
      return await project.save();
    } catch (error) {
      throw new Error(`Failed to create project: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update project
   */
  static async updateProject(id: string, updateData: Partial<IProject>): Promise<IProject | null> {
    try {
      return await Project.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).exec();
    } catch (error) {
      throw new Error(`Failed to update project: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Delete project
   */
  static async deleteProject(id: string): Promise<IProject | null> {
    try {
      return await Project.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error(`Failed to delete project: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update project progress
   */
  static async updateProjectProgress(id: string, progress: number): Promise<IProject | null> {
    try {
      if (progress < 0 || progress > 100) {
        throw new Error('Progress must be between 0 and 100');
      }

      return await Project.findByIdAndUpdate(
        id,
        { progress },
        { new: true, runValidators: true }
      ).exec();
    } catch (error) {
      throw new Error(`Failed to update project progress: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get project metrics
   */
  static async getProjectMetrics(id: string): Promise<ProjectMetrics> {
    try {
      const project = await Project.findById(id).exec();
      if (!project) {
        throw new Error('Project not found');
      }

      return {
        totalCapacity: project.capacity,
        progress: project.progress,
        deviation: 'On Track',
        completionDate: project.endDate
      };
    } catch (error) {
      throw new Error(`Failed to fetch project metrics: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get projects by status
   */
  static async getProjectsByStatus(status: string): Promise<IProject[]> {
    try {
      return await Project.find({ status }).sort({ createdAt: -1 }).exec();
    } catch (error) {
      throw new Error(`Failed to fetch projects by status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get projects by location
   */
  static async getProjectsByLocation(city: string, state?: string): Promise<IProject[]> {
    try {
      const query: any = { 'location.city': city };
      if (state) {
        query['location.state'] = state;
      }
      
      return await Project.find(query).sort({ createdAt: -1 }).exec();
    } catch (error) {
      throw new Error(`Failed to fetch projects by location: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get project statistics
   */
  static async getProjectStatistics(): Promise<any> {
    try {
      const stats = await Project.aggregate([
        {
          $group: {
            _id: null,
            totalProjects: { $sum: 1 },
            activeProjects: {
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
            },
            completedProjects: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            averageProgress: { $avg: '$progress' },
            totalCapacity: { $sum: { $toDouble: { $substr: ['$capacity', 0, -3] } } }
          }
        }
      ]);

      return stats[0] || {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        averageProgress: 0,
        totalCapacity: 0
      };
    } catch (error) {
      throw new Error(`Failed to fetch project statistics: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
