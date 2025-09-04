import { Request, Response } from 'express';
import { ActionService } from '../services/actionService';
import { SocketService } from '../services/socketService';
import { ApiResponse } from '../types';

export class ActionController {
  /**
   * Get all action items
   */
  static async getAllActionItems(req: Request, res: Response<ApiResponse<any[]>>) {
    try {
      const { priority, status, projectId, type } = req.query;
      let filters: any = {};
      
      if (priority) filters.priority = priority;
      if (status) filters.status = status;
      if (projectId) filters.projectId = projectId;
      if (type) filters.type = type;
      
      const actionItems = await ActionService.getAllActionItems(filters);
      
      res.json({
        success: true,
        data: actionItems,
        message: 'Action items retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getAllActionItems:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve action items'
      });
    }
  }

  /**
   * Get action item by ID
   */
  static async getActionItemById(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { id } = req.params;
      const actionItem = await ActionService.getActionItemById(id);
      
      if (!actionItem) {
        return res.status(404).json({
          success: false,
          error: 'Action item not found'
        });
      }
      
      res.json({
        success: true,
        data: actionItem,
        message: 'Action item retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getActionItemById:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve action item'
      });
    }
  }

  /**
   * Create new action item
   */
  static async createActionItem(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const newActionItem = await ActionService.createActionItem(req.body);
      
      // Emit real-time update via Socket.IO
      SocketService.emitToAll('action-new', newActionItem);
      
      res.status(201).json({
        success: true,
        data: newActionItem,
        message: 'Action item created successfully'
      });
    } catch (error) {
      console.error('Error in createActionItem:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create action item'
      });
    }
  }

  /**
   * Update action item
   */
  static async updateActionItem(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedActionItem = await ActionService.updateActionItem(id, updateData);
      
      if (!updatedActionItem) {
        return res.status(404).json({
          success: false,
          error: 'Action item not found'
        });
      }
      
      // Emit real-time update via Socket.IO
      SocketService.emitToAll('action-update', updatedActionItem);
      
      res.json({
        success: true,
        data: updatedActionItem,
        message: 'Action item updated successfully'
      });
    } catch (error) {
      console.error('Error in updateActionItem:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update action item'
      });
    }
  }

  /**
   * Delete action item
   */
  static async deleteActionItem(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { id } = req.params;
      const deletedActionItem = await ActionService.deleteActionItem(id);
      
      if (!deletedActionItem) {
        return res.status(404).json({
          success: false,
          error: 'Action item not found'
        });
      }
      
      // Emit real-time update via Socket.IO
      SocketService.emitToAll('action-deleted', { id });
      
      res.json({
        success: true,
        data: deletedActionItem,
        message: 'Action item deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteActionItem:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete action item'
      });
    }
  }

  /**
   * Update action item status
   */
  static async updateActionStatus(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const updatedActionItem = await ActionService.updateActionStatus(id, status);
      
      if (!updatedActionItem) {
        return res.status(404).json({
          success: false,
          error: 'Action item not found'
        });
      }
      
      // Emit real-time update via Socket.IO
      SocketService.emitToAll('action-update', updatedActionItem);
      
      res.json({
        success: true,
        data: updatedActionItem,
        message: 'Action item status updated successfully'
      });
    } catch (error) {
      console.error('Error in updateActionStatus:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update action item status'
      });
    }
  }

  /**
   * Get all risk assessments
   */
  static async getAllRiskAssessments(req: Request, res: Response<ApiResponse<any[]>>) {
    try {
      const { impact, probability, status, projectId } = req.query;
      let filters: any = {};
      
      if (impact) filters.impact = impact;
      if (probability) filters.probability = probability;
      if (status) filters.status = status;
      if (projectId) filters.projectId = projectId;
      
      const riskAssessments = await ActionService.getAllRiskAssessments(filters);
      
      res.json({
        success: true,
        data: riskAssessments,
        message: 'Risk assessments retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getAllRiskAssessments:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve risk assessments'
      });
    }
  }

  /**
   * Get risk assessment by ID
   */
  static async getRiskAssessmentById(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { id } = req.params;
      const riskAssessment = await ActionService.getRiskAssessmentById(id);
      
      if (!riskAssessment) {
        return res.status(404).json({
          success: false,
          error: 'Risk assessment not found'
        });
      }
      
      res.json({
        success: true,
        data: riskAssessment,
        message: 'Risk assessment retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getRiskAssessmentById:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve risk assessment'
      });
    }
  }

  /**
   * Create new risk assessment
   */
  static async createRiskAssessment(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const newRiskAssessment = await ActionService.createRiskAssessment(req.body);
      
      // Emit real-time update via Socket.IO
      SocketService.emitToAll('risk-new', newRiskAssessment);
      
      res.status(201).json({
        success: true,
        data: newRiskAssessment,
        message: 'Risk assessment created successfully'
      });
    } catch (error) {
      console.error('Error in createRiskAssessment:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create risk assessment'
      });
    }
  }

  /**
   * Update risk assessment
   */
  static async updateRiskAssessment(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedRiskAssessment = await ActionService.updateRiskAssessment(id, updateData);
      
      if (!updatedRiskAssessment) {
        return res.status(404).json({
          success: false,
          error: 'Risk assessment not found'
        });
      }
      
      // Emit real-time update via Socket.IO
      SocketService.emitToAll('risk-update', updatedRiskAssessment);
      
      res.json({
        success: true,
        data: updatedRiskAssessment,
        message: 'Risk assessment updated successfully'
      });
    } catch (error) {
      console.error('Error in updateRiskAssessment:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update risk assessment'
      });
    }
  }

  /**
   * Delete risk assessment
   */
  static async deleteRiskAssessment(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { id } = req.params;
      const deletedRiskAssessment = await ActionService.deleteRiskAssessment(id);
      
      if (!deletedRiskAssessment) {
        return res.status(404).json({
          success: false,
          error: 'Risk assessment not found'
        });
      }
      
      // Emit real-time update via Socket.IO
      SocketService.emitToAll('risk-deleted', { id });
      
      res.json({
        success: true,
        data: deletedRiskAssessment,
        message: 'Risk assessment deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteRiskAssessment:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete risk assessment'
      });
    }
  }

  /**
   * Get overdue action items
   */
  static async getOverdueActionItems(req: Request, res: Response<ApiResponse<any[]>>) {
    try {
      const overdueItems = await ActionService.getOverdueActionItems();
      
      res.json({
        success: true,
        data: overdueItems,
        message: 'Overdue action items retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getOverdueActionItems:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve overdue action items'
      });
    }
  }

  /**
   * Get high-risk assessments
   */
  static async getHighRiskAssessments(req: Request, res: Response<ApiResponse<any[]>>) {
    try {
      const highRiskAssessments = await ActionService.getHighRiskAssessments();
      
      res.json({
        success: true,
        data: highRiskAssessments,
        message: 'High-risk assessments retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getHighRiskAssessments:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve high-risk assessments'
      });
    }
  }

  /**
   * Get action and risk statistics
   */
  static async getActionAndRiskStatistics(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const stats = await ActionService.getActionAndRiskStatistics();
      
      res.json({
        success: true,
        data: stats,
        message: 'Action and risk statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getActionAndRiskStatistics:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve action and risk statistics'
      });
    }
  }
}
