import { Request, Response } from 'express';
import { CommunicationService } from '../services/communicationService';
import { SocketService } from '../services/socketService';
import { ApiResponse } from '../types';

export class CommunicationController {
  /**
   * Get all communications with optional filtering
   */
  static async getAllCommunications(req: Request, res: Response<ApiResponse<any[]>>) {
    try {
      const { type, priority, projectId, source } = req.query;
      let filters: any = {};
      
      if (type) filters.type = type;
      if (priority) filters.priority = priority;
      if (projectId) filters.projectId = projectId;
      if (source) filters.source = source;
      
      const communications = await CommunicationService.getAllCommunications(filters);
      
      // Add caching headers to prevent excessive requests
      res.set({
        'Cache-Control': 'public, max-age=30', // Cache for 30 seconds
        'ETag': `"communications-${Date.now()}"`,
        'Last-Modified': new Date().toUTCString()
      });
      
      res.json({
        success: true,
        data: communications,
        message: 'Communications retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getAllCommunications:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve communications'
      });
    }
  }

  /**
   * Get communication by ID
   */
  static async getCommunicationById(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { id } = req.params;
      const communication = await CommunicationService.getCommunicationById(id);
      
      if (!communication) {
        return res.status(404).json({
          success: false,
          error: 'Communication not found'
        });
      }
      
      res.json({
        success: true,
        data: communication,
        message: 'Communication retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getCommunicationById:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve communication'
      });
    }
  }

  /**
   * Create new communication
   */
  static async createCommunication(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const newCommunication = await CommunicationService.createCommunication(req.body);
      
      // Emit real-time update via Socket.IO
      SocketService.emitToAll('communication-new', newCommunication);
      
      res.status(201).json({
        success: true,
        data: newCommunication,
        message: 'Communication created successfully'
      });
    } catch (error) {
      console.error('Error in createCommunication:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create communication'
      });
    }
  }

  /**
   * Update communication
   */
  static async updateCommunication(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedCommunication = await CommunicationService.updateCommunication(id, updateData);
      
      if (!updatedCommunication) {
        return res.status(404).json({
          success: false,
          error: 'Communication not found'
        });
      }
      
      // Emit real-time update via Socket.IO
      SocketService.emitToAll('communication-update', updatedCommunication);
      
      res.json({
        success: true,
        data: updatedCommunication,
        message: 'Communication updated successfully'
      });
    } catch (error) {
      console.error('Error in updateCommunication:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update communication'
      });
    }
  }

  /**
   * Delete communication
   */
  static async deleteCommunication(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { id } = req.params;
      const deletedCommunication = await CommunicationService.deleteCommunication(id);
      
      if (!deletedCommunication) {
        return res.status(404).json({
          success: false,
          error: 'Communication not found'
        });
      }
      
      // Emit real-time update via Socket.IO
      SocketService.emitToAll('communication-deleted', { id });
      
      res.json({
        success: true,
        data: deletedCommunication,
        message: 'Communication deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteCommunication:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete communication'
      });
    }
  }

  /**
   * Generate AI insight
   */
  static async generateAIInsight(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { projectId, insightType, content } = req.body;
      
      const aiInsight = await CommunicationService.generateAIInsight({
        projectId,
        insightType,
        content
      });
      
      // Emit real-time update via Socket.IO
      SocketService.emitAIInsight(aiInsight);
      
      res.status(201).json({
        success: true,
        data: aiInsight,
        message: 'AI insight generated successfully'
      });
    } catch (error) {
      console.error('Error in generateAIInsight:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate AI insight'
      });
    }
  }

  /**
   * Test socket events
   */
  static async testSocket(req: Request, res: Response<ApiResponse<any>>) {
    try {
      // Emit test events to all connected clients
      SocketService.emitToAll('communication-new', {
        id: `test-${Date.now()}`,
        type: 'status-update',
        title: 'Test Communication',
        content: 'This is a test communication for socket testing.',
        priority: 'normal',
        source: 'system',
        projectId: 'test-project',
        tags: ['test', 'socket'],
        postedAt: new Date().toISOString(),
        isAI: false
      });

      SocketService.emitToAll('ai-insight', {
        id: `insight-${Date.now()}`,
        type: 'test-insight',
        message: 'This is a test AI insight for socket testing.',
        priority: 'high',
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: 'Test socket events sent successfully'
      });
    } catch (error) {
      console.error('Error in testSocket:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send test socket events'
      });
    }
  }

  /**
   * Get communications by project
   */
  static async getCommunicationsByProject(req: Request, res: Response<ApiResponse<any[]>>) {
    try {
      const { projectId } = req.params;
      const communications = await CommunicationService.getCommunicationsByProject(projectId);
      
      res.json({
        success: true,
        data: communications,
        message: 'Communications by project retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getCommunicationsByProject:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve communications by project'
      });
    }
  }

  /**
   * Get AI insights
   */
  static async getAIInsights(req: Request, res: Response<ApiResponse<any[]>>) {
    try {
      const aiInsights = await CommunicationService.getAIInsights();
      
      res.json({
        success: true,
        data: aiInsights,
        message: 'AI insights retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getAIInsights:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve AI insights'
      });
    }
  }

  /**
   * Search communications
   */
  static async searchCommunications(req: Request, res: Response<ApiResponse<any[]>>) {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }
      
      const communications = await CommunicationService.searchCommunications(q);
      
      res.json({
        success: true,
        data: communications,
        message: 'Communications search completed successfully'
      });
    } catch (error) {
      console.error('Error in searchCommunications:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search communications'
      });
    }
  }
}
