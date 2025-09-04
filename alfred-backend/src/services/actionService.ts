import { ActionItem, IActionItem } from '../models/ActionItem';
import { RiskAssessment, IRiskAssessment } from '../models/RiskAssessment';

export class ActionService {
  /**
   * Get all action items with optional filtering
   */
  static async getAllActionItems(filters: any = {}): Promise<IActionItem[]> {
    try {
      const query = ActionItem.find(filters).sort({ dueDate: 1 });
      return await query.exec();
    } catch (error) {
      throw new Error(`Failed to fetch action items: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get action item by ID
   */
  static async getActionItemById(id: string): Promise<IActionItem | null> {
    try {
      return await ActionItem.findById(id).exec();
    } catch (error) {
      throw new Error(`Failed to fetch action item: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create new action item
   */
  static async createActionItem(actionData: Partial<IActionItem>): Promise<IActionItem> {
    try {
      const actionItem = new ActionItem({
        ...actionData,
        status: actionData.status || 'new'
      });
      
      return await actionItem.save();
    } catch (error) {
      throw new Error(`Failed to create action item: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update action item
   */
  static async updateActionItem(id: string, updateData: Partial<IActionItem>): Promise<IActionItem | null> {
    try {
      return await ActionItem.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).exec();
    } catch (error) {
      throw new Error(`Failed to update action item: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Delete action item
   */
  static async deleteActionItem(id: string): Promise<IActionItem | null> {
    try {
      return await ActionItem.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error(`Failed to delete action item: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update action item status
   */
  static async updateActionStatus(id: string, status: string): Promise<IActionItem | null> {
    try {
      if (!['new', 'in-progress', 'monitoring', 'resolved'].includes(status)) {
        throw new Error('Invalid status value');
      }

      return await ActionItem.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      ).exec();
    } catch (error) {
      throw new Error(`Failed to update action status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get action items by project
   */
  static async getActionItemsByProject(projectId: string): Promise<IActionItem[]> {
    try {
      return await ActionItem.find({ projectId }).sort({ dueDate: 1 }).exec();
    } catch (error) {
      throw new Error(`Failed to fetch action items by project: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get action items by priority
   */
  static async getActionItemsByPriority(priority: string): Promise<IActionItem[]> {
    try {
      return await ActionItem.find({ priority }).sort({ dueDate: 1 }).exec();
    } catch (error) {
      throw new Error(`Failed to fetch action items by priority: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get action items by status
   */
  static async getActionItemsByStatus(status: string): Promise<IActionItem[]> {
    try {
      return await ActionItem.find({ status }).sort({ dueDate: 1 }).exec();
    } catch (error) {
      throw new Error(`Failed to fetch action items by status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get overdue action items
   */
  static async getOverdueActionItems(): Promise<IActionItem[]> {
    try {
      const now = new Date();
      return await ActionItem.find({
        dueDate: { $lt: now.toISOString() },
        status: { $ne: 'resolved' }
      }).sort({ dueDate: 1 }).exec();
    } catch (error) {
      throw new Error(`Failed to fetch overdue action items: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get all risk assessments with optional filtering
   */
  static async getAllRiskAssessments(filters: any = {}): Promise<IRiskAssessment[]> {
    try {
      const query = RiskAssessment.find(filters).sort({ createdAt: -1 });
      return await query.exec();
    } catch (error) {
      throw new Error(`Failed to fetch risk assessments: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get risk assessment by ID
   */
  static async getRiskAssessmentById(id: string): Promise<IRiskAssessment | null> {
    try {
      return await RiskAssessment.findById(id).exec();
    } catch (error) {
      throw new Error(`Failed to fetch risk assessment: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create new risk assessment
   */
  static async createRiskAssessment(riskData: Partial<IRiskAssessment>): Promise<IRiskAssessment> {
    try {
      const riskAssessment = new RiskAssessment({
        ...riskData,
        status: riskData.status || 'open'
      });
      
      return await riskAssessment.save();
    } catch (error) {
      throw new Error(`Failed to create risk assessment: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update risk assessment
   */
  static async updateRiskAssessment(id: string, updateData: Partial<IRiskAssessment>): Promise<IRiskAssessment | null> {
    try {
      return await RiskAssessment.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).exec();
    } catch (error) {
      throw new Error(`Failed to update risk assessment: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Delete risk assessment
   */
  static async deleteRiskAssessment(id: string): Promise<IRiskAssessment | null> {
    try {
      return await RiskAssessment.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error(`Failed to delete risk assessment: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get risk assessments by project
   */
  static async getRiskAssessmentsByProject(projectId: string): Promise<IRiskAssessment[]> {
    try {
      return await RiskAssessment.find({ projectId }).sort({ createdAt: -1 }).exec();
    } catch (error) {
      throw new Error(`Failed to fetch risk assessments by project: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get risk assessments by impact
   */
  static async getRiskAssessmentsByImpact(impact: string): Promise<IRiskAssessment[]> {
    try {
      return await RiskAssessment.find({ impact }).sort({ createdAt: -1 }).exec();
    } catch (error) {
      throw new Error(`Failed to fetch risk assessments by impact: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get risk assessments by status
   */
  static async getRiskAssessmentsByStatus(status: string): Promise<IRiskAssessment[]> {
    try {
      return await RiskAssessment.find({ status }).sort({ createdAt: -1 }).exec();
    } catch (error) {
      throw new Error(`Failed to fetch risk assessments by status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get high-risk assessments
   */
  static async getHighRiskAssessments(): Promise<IRiskAssessment[]> {
    try {
      return await RiskAssessment.find({
        $or: [
          { impact: 'high' },
          { impact: 'critical' }
        ]
      }).sort({ createdAt: -1 }).exec();
    } catch (error) {
      throw new Error(`Failed to fetch high-risk assessments: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get action and risk statistics
   */
  static async getActionAndRiskStatistics(): Promise<any> {
    try {
      const [actionStats, riskStats] = await Promise.all([
        ActionItem.aggregate([
          {
            $group: {
              _id: null,
              totalActions: { $sum: 1 },
              newActions: {
                $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] }
              },
              inProgressActions: {
                $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
              },
              resolvedActions: {
                $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
              }
            }
          }
        ]),
        RiskAssessment.aggregate([
          {
            $group: {
              _id: null,
              totalRisks: { $sum: 1 },
              openRisks: {
                $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] }
              },
              mitigatedRisks: {
                $sum: { $cond: [{ $eq: ['$status', 'mitigated'] }, 1, 0] }
              },
              highImpactRisks: {
                $sum: { $cond: [{ $in: ['$impact', ['high', 'critical']] }, 1, 0] }
              }
            }
          }
        ])
      ]);

      return {
        actions: actionStats[0] || {
          totalActions: 0,
          newActions: 0,
          inProgressActions: 0,
          resolvedActions: 0
        },
        risks: riskStats[0] || {
          totalRisks: 0,
          openRisks: 0,
          mitigatedRisks: 0,
          highImpactRisks: 0
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch action and risk statistics: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
