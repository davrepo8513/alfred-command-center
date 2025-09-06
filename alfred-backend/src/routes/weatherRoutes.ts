import { Router } from 'express';
import { WeatherController } from '../controllers/weatherController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Weather data routes
router.get('/location/:location', asyncHandler(WeatherController.getWeatherByLocation));
router.post('/multiple', asyncHandler(WeatherController.getWeatherForMultipleLocations));
router.post('/location/:location', asyncHandler(WeatherController.createOrUpdateWeather));
router.put('/location/:location', asyncHandler(WeatherController.updateWeather));
router.delete('/location/:location', asyncHandler(WeatherController.deleteWeather));

// Weather forecast and simulation
router.get('/forecast/:location', asyncHandler(WeatherController.generateWeatherForecast));
router.post('/simulate/:location', asyncHandler(WeatherController.simulateWeatherUpdate));

// Statistics and analysis
router.get('/stats/overview', asyncHandler(WeatherController.getWeatherStatistics));
router.get('/stats/extreme', asyncHandler(WeatherController.getExtremeWeatherConditions));

// Socket testing
router.post('/test-socket', asyncHandler(WeatherController.testSocket));

export { router as weatherRoutes };

