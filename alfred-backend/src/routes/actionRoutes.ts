import { Router } from 'express';
import { ActionController } from '../controllers/actionController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Action Items routes
router.get('/', asyncHandler(ActionController.getAllActionItems));
router.get('/overdue', asyncHandler(ActionController.getOverdueActionItems));
router.get('/:id', asyncHandler(ActionController.getActionItemById));
router.post('/', asyncHandler(ActionController.createActionItem));
router.put('/:id', asyncHandler(ActionController.updateActionItem));
router.delete('/:id', asyncHandler(ActionController.deleteActionItem));
router.patch('/:id/status', asyncHandler(ActionController.updateActionStatus));

// Risk Assessment routes
router.get('/risks/all', asyncHandler(ActionController.getAllRiskAssessments));
router.get('/risks/high', asyncHandler(ActionController.getHighRiskAssessments));
router.get('/risks/:id', asyncHandler(ActionController.getRiskAssessmentById));
router.post('/risks', asyncHandler(ActionController.createRiskAssessment));
router.put('/risks/:id', asyncHandler(ActionController.updateRiskAssessment));
router.delete('/risks/:id', asyncHandler(ActionController.deleteRiskAssessment));

// Statistics
router.get('/stats/overview', asyncHandler(ActionController.getActionAndRiskStatistics));

export { router as actionRoutes };

