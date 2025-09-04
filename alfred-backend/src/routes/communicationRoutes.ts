import { Router } from 'express';
import { CommunicationController } from '../controllers/communicationController';
import { communicationValidation, validateId } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Communication routes
router.get('/', asyncHandler(CommunicationController.getAllCommunications));
router.get('/project/:projectId', asyncHandler(CommunicationController.getCommunicationsByProject));
router.get('/search', asyncHandler(CommunicationController.searchCommunications));
router.get('/:id', validateId(), asyncHandler(CommunicationController.getCommunicationById));
router.post('/', communicationValidation.create, asyncHandler(CommunicationController.createCommunication));
router.put('/:id', communicationValidation.create, asyncHandler(CommunicationController.updateCommunication));
router.delete('/:id', validateId(), asyncHandler(CommunicationController.deleteCommunication));

// AI Insight routes
router.post('/ai-insight', communicationValidation.aiInsight, asyncHandler(CommunicationController.generateAIInsight));
router.get('/ai-insights', asyncHandler(CommunicationController.getAIInsights));

// Socket testing
router.post('/test-socket', asyncHandler(CommunicationController.testSocket));

export { router as communicationRoutes };

