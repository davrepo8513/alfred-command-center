import { Router } from 'express';
import { CommunicationController } from '../controllers/communicationController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Communication routes
router.get('/', asyncHandler(CommunicationController.getAllCommunications));
router.get('/project/:projectId', asyncHandler(CommunicationController.getCommunicationsByProject));
router.get('/search', asyncHandler(CommunicationController.searchCommunications));
router.get('/:id', asyncHandler(CommunicationController.getCommunicationById));
router.post('/', asyncHandler(CommunicationController.createCommunication));
router.put('/:id', asyncHandler(CommunicationController.updateCommunication));
router.delete('/:id', asyncHandler(CommunicationController.deleteCommunication));

// AI Insight routes
router.post('/ai-insight', asyncHandler(CommunicationController.generateAIInsight));
router.get('/ai-insights', asyncHandler(CommunicationController.getAIInsights));

export { router as communicationRoutes };

