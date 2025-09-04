import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { projectValidation, validateId } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get all projects
router.get('/', asyncHandler(ProjectController.getAllProjects));

// Get project by ID
router.get('/:id', validateId(), asyncHandler(ProjectController.getProjectById));

// Create new project
router.post('/', projectValidation.create, asyncHandler(ProjectController.createProject));

// Update project
router.put('/:id', projectValidation.update, asyncHandler(ProjectController.updateProject));

// Delete project
router.delete('/:id', validateId(), asyncHandler(ProjectController.deleteProject));

// Get project metrics
router.get('/:id/metrics', validateId(), asyncHandler(ProjectController.getProjectMetrics));

// Update project progress
router.patch('/:id/progress', projectValidation.progress, asyncHandler(ProjectController.updateProjectProgress));

// Get project statistics
router.get('/stats/overview', asyncHandler(ProjectController.getProjectStatistics));

// Get projects by status
router.get('/status/:status', asyncHandler(ProjectController.getProjectsByStatus));

// Get projects by location
router.get('/location/search', asyncHandler(ProjectController.getProjectsByLocation));

// Get network overview for modal
router.get('/network/overview', asyncHandler(ProjectController.getNetworkOverview));

// Get project schematic for modal
router.get('/:id/schematic', validateId(), asyncHandler(ProjectController.getProjectSchematic));

// Export network report as Excel
router.get('/export/report', asyncHandler(ProjectController.exportNetworkReport));

export { router as projectRoutes };

