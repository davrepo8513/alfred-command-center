import { Request, Response } from 'express';
import { WeatherService } from '../services/weatherService';
import { SocketService } from '../services/socketService';
import { ApiResponse } from '../types';

export class WeatherController {
  /**
   * Get weather data for a specific location
   */
  static async getWeatherByLocation(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { location } = req.params;
      const weatherData = await WeatherService.getWeatherByLocation(location);
      
      if (!weatherData) {
        return res.status(404).json({
          success: false,
          error: 'Weather data not found for this location'
        });
      }
      
      res.json({
        success: true,
        data: weatherData,
        message: 'Weather data retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getWeatherByLocation:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve weather data'
      });
    }
  }

  /**
   * Get weather data for multiple locations
   */
  static async getWeatherForMultipleLocations(req: Request, res: Response<ApiResponse<any[]>>) {
    try {
      const { locations } = req.body;
      
      if (!Array.isArray(locations) || locations.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Locations array is required and must not be empty'
        });
      }
      
      const weatherData = await WeatherService.getWeatherForMultipleLocations(locations);
      
      res.json({
        success: true,
        data: weatherData,
        message: 'Weather data for multiple locations retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getWeatherForMultipleLocations:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve weather data for multiple locations'
      });
    }
  }

  /**
   * Create or update weather data for a location
   */
  static async createOrUpdateWeather(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { location } = req.params;
      const weatherData = req.body;
      
      const result = await WeatherService.createOrUpdateWeather(location, weatherData);
      
      // Emit real-time update via Socket.IO
      SocketService.emitToAll('weather-update', { location, data: result });
      
      res.json({
        success: true,
        data: result,
        message: 'Weather data created/updated successfully'
      });
    } catch (error) {
      console.error('Error in createOrUpdateWeather:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create/update weather data'
      });
    }
  }

  /**
   * Update weather data for a location
   */
  static async updateWeather(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { location } = req.params;
      const updateData = req.body;
      
      const updatedWeather = await WeatherService.updateWeather(location, updateData);
      
      if (!updatedWeather) {
        return res.status(404).json({
          success: false,
          error: 'Weather data not found for this location'
        });
      }
      
      // Emit real-time update via Socket.IO
      SocketService.emitToAll('weather-update', { location, data: updatedWeather });
      
      res.json({
        success: true,
        data: updatedWeather,
        message: 'Weather data updated successfully'
      });
    } catch (error) {
      console.error('Error in updateWeather:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update weather data'
      });
    }
  }

  /**
   * Delete weather data for a location
   */
  static async deleteWeather(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { location } = req.params;
      const deletedWeather = await WeatherService.deleteWeather(location);
      
      if (!deletedWeather) {
        return res.status(404).json({
          success: false,
          error: 'Weather data not found for this location'
        });
      }
      
      // Emit real-time update via Socket.IO
      SocketService.emitToAll('weather-deleted', { location });
      
      res.json({
        success: true,
        data: deletedWeather,
        message: 'Weather data deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteWeather:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete weather data'
      });
    }
  }

  /**
   * Generate weather forecast for a location
   */
  static async generateWeatherForecast(req: Request, res: Response<ApiResponse<any[]>>) {
    try {
      const { location } = req.params;
      const { days = 5 } = req.query;
      
      const forecast = await WeatherService.generateWeatherForecast(location, Number(days));
      
      res.json({
        success: true,
        data: forecast,
        message: 'Weather forecast generated successfully'
      });
    } catch (error) {
      console.error('Error in generateWeatherForecast:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate weather forecast'
      });
    }
  }

  /**
   * Simulate weather update for a location
   */
  static async simulateWeatherUpdate(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { location } = req.params;
      const updatedWeather = await WeatherService.simulateWeatherUpdate(location);
      
      if (!updatedWeather) {
        return res.status(404).json({
          success: false,
          error: 'Weather data not found for this location'
        });
      }
      
      // Emit real-time update via Socket.IO
      SocketService.emitToAll('weather-update', { location, data: updatedWeather });
      
      res.json({
        success: true,
        data: updatedWeather,
        message: 'Weather data simulated and updated successfully'
      });
    } catch (error) {
      console.error('Error in simulateWeatherUpdate:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to simulate weather update'
      });
    }
  }

  /**
   * Get weather statistics
   */
  static async getWeatherStatistics(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const stats = await WeatherService.getWeatherStatistics();
      
      res.json({
        success: true,
        data: stats,
        message: 'Weather statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getWeatherStatistics:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve weather statistics'
      });
    }
  }

  /**
   * Get extreme weather conditions
   */
  static async getExtremeWeatherConditions(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const extremeConditions = await WeatherService.getExtremeWeatherConditions();
      
      res.json({
        success: true,
        data: extremeConditions,
        message: 'Extreme weather conditions retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getExtremeWeatherConditions:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve extreme weather conditions'
      });
    }
  }

  /**
   * Test socket connection for weather updates
   */
  static async testSocket(req: Request, res: Response<ApiResponse<any>>) {
    try {
      // Emit a test weather update via Socket.IO
      SocketService.emitToAll('weather-test', {
        message: 'Weather socket test successful',
        timestamp: new Date().toISOString()
      });
      
      res.json({
        success: true,
        data: { message: 'Weather socket test emitted successfully' },
        message: 'Weather socket test completed'
      });
    } catch (error) {
      console.error('Error in testSocket:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to test weather socket'
      });
    }
  }
}
