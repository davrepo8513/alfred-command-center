import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService';
import { SocketService } from '../services/socketService';
import { ApiResponse } from '../types';
import { Project } from '../models/Project';
import { Communication } from '../models/Communication';
import { ActionItem } from '../models/ActionItem';
import { WeatherData } from '../models/WeatherData';
import * as ExcelJS from 'exceljs';

export class ProjectController {
  /**
   * Get all projects
   */
  static async getAllProjects(req: Request, res: Response<ApiResponse<any[]>>) {
    try {
      const { status, city, state } = req.query;
      let filters: any = {};
      
      if (status) filters.status = status;
      if (city) filters['location.city'] = city;
      if (state) filters['location.state'] = state;
      
      const projects = await ProjectService.getAllProjects(filters);
      
      // Add caching headers to prevent excessive requests
      res.set({
        'Cache-Control': 'public, max-age=60', // Cache for 60 seconds (projects change less frequently)
        'ETag': `"projects-${Date.now()}"`,
        'Last-Modified': new Date().toUTCString()
      });
      
      res.json({
        success: true,
        data: projects,
        message: 'Projects retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getAllProjects:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve projects'
      });
    }
  }

  /**
   * Get project by ID
   */
  static async getProjectById(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { id } = req.params;
      const project = await ProjectService.getProjectById(id);
      
      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }
      
      res.json({
        success: true,
        data: project,
        message: 'Project retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getProjectById:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve project'
      });
    }
  }

  /**
   * Create new project
   */
  static async createProject(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { name, location, capacity, startDate, endDate } = req.body;
      
      // Basic validation
      if (!name || !location || !capacity || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields'
        });
      }
      
      const newProject = await ProjectService.createProject({
        name,
        location,
        capacity,
        startDate,
        endDate
      });
      
      SocketService.emitToAll('project-new', newProject);
      
      res.status(201).json({
        success: true,
        data: newProject,
        message: 'Project created successfully'
      });
    } catch (error) {
      console.error('Error in createProject:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create project'
      });
    }
  }

  /**
   * Update project
   */
  static async updateProject(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedProject = await ProjectService.updateProject(id, updateData);
      
      if (!updatedProject) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }
      
      SocketService.emitToAll('project-update', updatedProject);
      
      res.json({
        success: true,
        data: updatedProject,
        message: 'Project updated successfully'
      });
    } catch (error) {
      console.error('Error in updateProject:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update project'
      });
    }
  }

  /**
   * Delete project
   */
  static async deleteProject(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { id } = req.params;
      const deletedProject = await ProjectService.deleteProject(id);
      
      if (!deletedProject) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }
      
      SocketService.emitToAll('project-deleted', { id });
      
      res.json({
        success: true,
        data: deletedProject,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteProject:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete project'
      });
    }
  }

  /**
   * Get project metrics
   */
  static async getProjectMetrics(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { id } = req.params;
      const metrics = await ProjectService.getProjectMetrics(id);
      
      res.json({
        success: true,
        data: metrics,
        message: 'Project metrics retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getProjectMetrics:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve project metrics'
      });
    }
  }

  /**
   * Update project progress
   */
  static async updateProjectProgress(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { id } = req.params;
      const { progress } = req.body;
      
      const updatedProject = await ProjectService.updateProjectProgress(id, progress);
      
      if (!updatedProject) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }
      
      SocketService.emitToAll('project-update', {
        id: updatedProject.id,
        progress: updatedProject.progress,
        updatedAt: new Date().toISOString()
      });
      
      res.json({
        success: true,
        data: updatedProject,
        message: 'Project progress updated successfully'
      });
    } catch (error) {
      console.error('Error in updateProjectProgress:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update project progress'
      });
    }
  }

  /**
   * Get project statistics
   */
  static async getProjectStatistics(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const stats = await ProjectService.getProjectStatistics();
      
      res.json({
        success: true,
        data: stats,
        message: 'Project statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getProjectStatistics:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve project statistics'
      });
    }
  }

  /**
   * Get projects by status
   */
  static async getProjectsByStatus(req: Request, res: Response<ApiResponse<any[]>>) {
    try {
      const { status } = req.params;
      const projects = await ProjectService.getProjectsByStatus(status);
      
      res.json({
        success: true,
        data: projects,
        message: `Projects with status '${status}' retrieved successfully`
      });
    } catch (error) {
      console.error('Error in getProjectsByStatus:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve projects by status'
      });
    }
  }

  /**
   * Get projects by location
   */
  static async getProjectsByLocation(req: Request, res: Response<ApiResponse<any[]>>) {
    try {
      const { city, state } = req.query;
      const projects = await ProjectService.getProjectsByLocation(city as string, state as string);
      
      res.json({
        success: true,
        data: projects,
        message: 'Projects by location retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getProjectsByLocation:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve projects by location'
      });
    }
  }

  /**
   * Get network overview data for the modal
   */
  static async getNetworkOverview(req: Request, res: Response): Promise<void> {
    try {
      const projects = await Project.find({});
      
      const networkStats = {
        totalProjects: projects.length,
        activeSites: projects.filter(p => p.status === 'active').length,
        totalCapacity: projects.reduce((total, p) => total + (parseInt(p.capacity) || 0), 0),
        networkProgress: Math.round(projects.reduce((total, p) => total + (p.progress || 0), 0) / projects.length)
      };

      const regionalDistribution = projects.reduce((acc, project) => {
        const state = project.location.state;
        acc[state] = (acc[state] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const overview = {
        networkStats,
        regionalDistribution: Object.entries(regionalDistribution).map(([state, count]) => ({
          state,
          count
        }))
      };

      res.json(overview);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch network overview', error: String(error) });
    }
  }

  /**
   * Get project schematic data for the modal
   */
  static async getProjectSchematic(req: Request, res: Response<ApiResponse<any>>): Promise<void> {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);
      
      if (!project) {
        res.status(404).json({
          success: false,
          error: 'Project not found'
        });
        return;
      }

      const workflowStages = [
        {
          title: 'Development & Permitting',
          color: 'text-yellow-400',
          tasks: [
            { name: 'Land Acquisition', progress: 100, status: 'completed', buttonText: 'Completed' },
            { name: 'PPA Signed', progress: 100, status: 'completed', buttonText: 'Completed' },
            { name: 'Permits Secured', progress: 100, status: 'completed', buttonText: 'Completed' }
          ]
        },
        {
          title: 'Engineering & Design',
          color: 'text-yellow-400',
          tasks: [
            { name: 'Design Approval', progress: 100, status: 'completed', buttonText: 'Completed' },
            { name: 'Engineering Complete', progress: 100, status: 'completed', buttonText: 'Grid Connection' },
            { name: 'Layout Finalized', progress: Math.max(75, project.progress || 0), status: 'in-progress', buttonText: 'Jul 17' }
          ]
        },
        {
          title: 'Procurement',
          color: 'text-yellow-400',
          tasks: [
            { name: 'Module Delivery', progress: Math.max(35, project.progress || 0), status: 'risk', buttonText: 'Monsoon Impact' },
            { name: 'Inverter Delivery', progress: 100, status: 'completed', buttonText: 'Completed' },
            { name: 'BOS Procurement', progress: Math.max(60, project.progress || 0), status: 'in-progress', buttonText: 'Aug 10' }
          ]
        },
        {
          title: 'Construction',
          color: 'text-yellow-400',
          tasks: [
            { name: 'Civil Works', progress: 100, status: 'completed', buttonText: 'Completed' },
            { name: 'Mounting Structure', progress: Math.max(45, project.progress || 0), status: 'in-progress', buttonText: 'In Progress' },
            { name: 'Electrical Installation', progress: Math.max(0, project.progress || 0), status: 'pending', buttonText: 'Sep 15' }
          ]
        },
        {
          title: 'Testing & Commissioning',
          color: 'text-yellow-400',
          tasks: [
            { name: 'Pre-commissioning', progress: Math.max(0, project.progress || 0), status: 'pending', buttonText: 'A Delay In Module' },
            { name: 'Grid Sync', progress: Math.max(0, project.progress || 0), status: 'pending', buttonText: 'Oct 5' },
            { name: 'Final Acceptance', progress: Math.max(0, project.progress || 0), status: 'pending', buttonText: 'Oct 15' }
          ]
        }
      ];

      const schematic = {
        projectId: project.id,
        projectName: project.name,
        progress: project.progress,
        spi: 0.85, // This could be calculated based on actual data
        workflowStages
      };

      // Add caching headers
      res.set({
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'ETag': `"schematic-${id}-${Date.now()}"`,
        'Last-Modified': new Date().toUTCString()
      });

      res.json({
        success: true,
        data: schematic,
        message: 'Project schematic retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getProjectSchematic:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve project schematic'
      });
    }
  }

  /**
   * Export network report as Excel
   */
  static async exportNetworkReport(req: Request, res: Response): Promise<void> {
    try {
      const projects = await Project.find({});
      const communications = await Communication.find({}).sort({ timestamp: -1 }).limit(50);
      const actionItems = await ActionItem.find({}).sort({ dueDate: 1 });
      const weatherData = await WeatherData.find({}).sort({ timestamp: -1 }).limit(20);

      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      
      // Projects sheet
      const projectsSheet = workbook.addWorksheet('Projects');
      projectsSheet.columns = [
        { header: 'Project Name', key: 'name', width: 20 },
        { header: 'Location', key: 'location', width: 25 },
        { header: 'Capacity (MW)', key: 'capacity', width: 15 },
        { header: 'Progress (%)', key: 'progress', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Start Date', key: 'startDate', width: 15 },
        { header: 'Expected Completion', key: 'expectedCompletion', width: 20 }
      ];

      projects.forEach(project => {
        projectsSheet.addRow({
          name: project.name,
          location: `${project.location.city}, ${project.location.state}`,
          capacity: project.capacity,
          progress: project.progress,
          status: project.status,
          startDate: project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A',
          expectedCompletion: project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'
        });
      });

      // Communications sheet
      const commSheet = workbook.addWorksheet('Communications');
      commSheet.columns = [
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Title', key: 'title', width: 30 },
        { header: 'Message', key: 'message', width: 50 },
        { header: 'Priority', key: 'priority', width: 15 },
        { header: 'Timestamp', key: 'timestamp', width: 20 },
        { header: 'Status', key: 'status', width: 15 }
      ];

      communications.forEach(comm => {
        commSheet.addRow({
          type: comm.type,
          title: comm.title,
          message: comm.content,
          priority: comm.priority,
          timestamp: new Date(comm.postedAt).toLocaleString(),
          status: comm.source
        });
      });

      // Action Items sheet
      const actionsSheet = workbook.addWorksheet('Action Items');
      actionsSheet.columns = [
        { header: 'Title', key: 'title', width: 30 },
        { header: 'Description', key: 'description', width: 50 },
        { header: 'Priority', key: 'priority', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Due Date', key: 'dueDate', width: 15 },
        { header: 'Assigned To', key: 'assignedTo', width: 20 }
      ];

      actionItems.forEach(action => {
        actionsSheet.addRow({
          title: action.title,
          description: action.description,
          priority: action.priority,
          status: action.status,
          dueDate: action.dueDate ? new Date(action.dueDate).toLocaleDateString() : 'N/A',
          assignedTo: action.assignedTo || 'Unassigned'
        });
      });

      // Weather Data sheet
      const weatherSheet = workbook.addWorksheet('Weather Data');
      weatherSheet.columns = [
        { header: 'Location', key: 'location', width: 20 },
        { header: 'Temperature (°C)', key: 'temperature', width: 20 },
        { header: 'Wind Speed (km/h)', key: 'windSpeed', width: 20 },
        { header: 'Condition', key: 'condition', width: 20 },
        { header: 'Humidity (%)', key: 'humidity', width: 20 },
        { header: 'Timestamp', key: 'timestamp', width: 20 }
      ];

      weatherData.forEach(weather => {
        weatherSheet.addRow({
          location: weather.location,
          temperature: weather.temperature,
          windSpeed: weather.windSpeed,
          condition: weather.condition,
          humidity: weather.humidity,
          timestamp: new Date(weather.updatedAt).toLocaleString()
        });
      });

      // Set response headers for Excel download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=network-report.xlsx');

      // Write to response
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      res.status(500).json({ message: 'Failed to export network report', error: String(error) });
    }
  }
}
