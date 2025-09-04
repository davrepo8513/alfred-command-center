import { Communication, ICommunication } from '../models/Communication';

export class CommunicationService {
  /**
   * Get all communications with optional filtering
   */
  static async getAllCommunications(filters: any = {}): Promise<ICommunication[]> {
    try {
      const query = Communication.find(filters).sort({ postedAt: -1 });
      return await query.exec();
    } catch (error) {
      throw new Error(`Failed to fetch communications: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get communication by ID
   */
  static async getCommunicationById(id: string): Promise<ICommunication | null> {
    try {
      return await Communication.findById(id).exec();
    } catch (error) {
      throw new Error(`Failed to fetch communication: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create new communication
   */
  static async createCommunication(communicationData: Partial<ICommunication>): Promise<ICommunication> {
    try {
      const communication = new Communication({
        ...communicationData,
        postedAt: communicationData.postedAt || new Date().toISOString(),
        isAI: communicationData.isAI || false
      });
      
      return await communication.save();
    } catch (error) {
      throw new Error(`Failed to create communication: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update communication
   */
  static async updateCommunication(id: string, updateData: Partial<ICommunication>): Promise<ICommunication | null> {
    try {
      return await Communication.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).exec();
    } catch (error) {
      throw new Error(`Failed to update communication: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Delete communication
   */
  static async deleteCommunication(id: string): Promise<ICommunication | null> {
    try {
      return await Communication.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error(`Failed to delete communication: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate AI insight
   */
  static async generateAIInsight(insightData: {
    projectId: string;
    insightType: string;
    content: string;
  }): Promise<ICommunication> {
    try {
      const aiCommunication = new Communication({
        type: 'insight',
        title: `AI Insight: ${insightData.insightType}`,
        content: insightData.content,
        priority: 'high',
        source: 'ai',
        projectId: insightData.projectId,
        tags: ['ai', 'insight', insightData.insightType],
        postedAt: new Date().toISOString(),
        isAI: true
      });
      
      return await aiCommunication.save();
    } catch (error) {
      throw new Error(`Failed to generate AI insight: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get communications by project
   */
  static async getCommunicationsByProject(projectId: string): Promise<ICommunication[]> {
    try {
      return await Communication.find({ projectId }).sort({ postedAt: -1 }).exec();
    } catch (error) {
      throw new Error(`Failed to fetch communications by project: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get communications by type
   */
  static async getCommunicationsByType(type: string): Promise<ICommunication[]> {
    try {
      return await Communication.find({ type }).sort({ postedAt: -1 }).exec();
    } catch (error) {
      throw new Error(`Failed to fetch communications by type: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get communications by priority
   */
  static async getCommunicationsByPriority(priority: string): Promise<ICommunication[]> {
    try {
      return await Communication.find({ priority }).sort({ postedAt: -1 }).exec();
    } catch (error) {
      throw new Error(`Failed to fetch communications by priority: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get AI insights
   */
  static async getAIInsights(): Promise<ICommunication[]> {
    try {
      return await Communication.find({ isAI: true }).sort({ postedAt: -1 }).exec();
    } catch (error) {
      throw new Error(`Failed to fetch AI insights: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Search communications
   */
  static async searchCommunications(searchTerm: string): Promise<ICommunication[]> {
    try {
      const regex = new RegExp(searchTerm, 'i');
      return await Communication.find({
        $or: [
          { title: regex },
          { content: regex },
          { tags: { $in: [regex] } }
        ]
      }).sort({ postedAt: -1 }).exec();
    } catch (error) {
      throw new Error(`Failed to search communications: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get communication statistics
   */
  static async getCommunicationStatistics(): Promise<any> {
    try {
      const stats = await Communication.aggregate([
        {
          $group: {
            _id: null,
            totalCommunications: { $sum: 1 },
            aiInsights: {
              $sum: { $cond: [{ $eq: ['$isAI', true] }, 1, 0] }
            },
            highPriority: {
              $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
            },
            criticalPriority: {
              $sum: { $cond: [{ $eq: ['$priority', 'critical'] }, 1, 0] }
            }
          }
        }
      ]);

      return stats[0] || {
        totalCommunications: 0,
        aiInsights: 0,
        highPriority: 0,
        criticalPriority: 0
      };
    } catch (error) {
      throw new Error(`Failed to fetch communication statistics: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
