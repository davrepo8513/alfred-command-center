import { WeatherData, IWeatherData } from '../models/WeatherData';

export class WeatherService {
  /**
   * Get weather data by location
   */
  static async getWeatherByLocation(location: string): Promise<IWeatherData | null> {
    try {
      return await WeatherData.findOne({ location: location.toLowerCase() }).exec();
    } catch (error) {
      throw new Error(`Failed to fetch weather data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get weather data for multiple locations
   */
  static async getWeatherForMultipleLocations(locations: string[]): Promise<IWeatherData[]> {
    try {
      return await WeatherData.find({
        location: { $in: locations.map(loc => loc.toLowerCase()) }
      }).exec();
    } catch (error) {
      throw new Error(`Failed to fetch weather data for multiple locations: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create or update weather data
   */
  static async createOrUpdateWeather(
    location: string,
    weatherData: Partial<IWeatherData>
  ): Promise<IWeatherData> {
    try {
      const existingWeather = await WeatherData.findOne({ location: location.toLowerCase() });
      
      if (existingWeather) {
        // Update existing weather data
        Object.assign(existingWeather, {
          ...weatherData,
          updatedAt: new Date().toISOString()
        });
        
        return await existingWeather.save();
      } else {
        // Create new weather data
        const newWeather = new WeatherData({
          location: location.toLowerCase(),
          ...weatherData,
          updatedAt: new Date().toISOString()
        });
        
        return await newWeather.save();
      }
    } catch (error) {
      throw new Error(`Failed to create/update weather data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update weather data
   */
  static async updateWeather(
    location: string,
    updateData: Partial<IWeatherData>
  ): Promise<IWeatherData | null> {
    try {
      return await WeatherData.findOneAndUpdate(
        { location: location.toLowerCase() },
        { ...updateData, updatedAt: new Date().toISOString() },
        { new: true, runValidators: true }
      ).exec();
    } catch (error) {
      throw new Error(`Failed to update weather data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Delete weather data
   */
  static async deleteWeather(location: string): Promise<IWeatherData | null> {
    try {
      return await WeatherData.findOneAndDelete({ location: location.toLowerCase() }).exec();
    } catch (error) {
      throw new Error(`Failed to delete weather data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate weather forecast
   */
  static async generateWeatherForecast(location: string, days: number = 5): Promise<any[]> {
    try {
      const currentWeather = await this.getWeatherByLocation(location);
      if (!currentWeather) {
        throw new Error('Weather data not found for this location');
      }

      const forecast = [];
      for (let i = 1; i <= days; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        forecast.push({
          date: date.toISOString().split('T')[0],
          temperature: this.generateRandomTemperature(currentWeather.temperature),
          windSpeed: this.generateRandomWindSpeed(currentWeather.windSpeed),
          condition: this.generateRandomCondition(),
          humidity: this.generateRandomHumidity(currentWeather.humidity),
          pressure: this.generateRandomPressure(currentWeather.pressure)
        });
      }
      
      return forecast;
    } catch (error) {
      throw new Error(`Failed to generate weather forecast: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Simulate weather update
   */
  static async simulateWeatherUpdate(location: string): Promise<IWeatherData | null> {
    try {
      const currentWeather = await this.getWeatherByLocation(location);
      if (!currentWeather) {
        throw new Error('Weather data not found for this location');
      }

      const updatedWeather = {
        temperature: this.generateRandomTemperature(currentWeather.temperature),
        windSpeed: this.generateRandomWindSpeed(currentWeather.windSpeed),
        condition: this.generateRandomCondition(),
        humidity: this.generateRandomHumidity(currentWeather.humidity),
        pressure: this.generateRandomPressure(currentWeather.pressure),
        updatedAt: new Date().toISOString()
      };

      return await this.updateWeather(location, updatedWeather);
    } catch (error) {
      throw new Error(`Failed to simulate weather update: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get weather statistics
   */
  static async getWeatherStatistics(): Promise<any> {
    try {
      const stats = await WeatherData.aggregate([
        {
          $group: {
            _id: null,
            totalLocations: { $sum: 1 },
            averageTemperature: { $avg: '$temperature' },
            averageHumidity: { $avg: '$humidity' },
            averageWindSpeed: { $avg: '$windSpeed' },
            averagePressure: { $avg: '$pressure' }
          }
        }
      ]);

      return stats[0] || {
        totalLocations: 0,
        averageTemperature: 0,
        averageHumidity: 0,
        averageWindSpeed: 0,
        averagePressure: 0
      };
    } catch (error) {
      throw new Error(`Failed to fetch weather statistics: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get extreme weather conditions
   */
  static async getExtremeWeatherConditions(): Promise<any> {
    try {
      const [hottest, coldest, windiest, wettest] = await Promise.all([
        WeatherData.findOne().sort({ temperature: -1 }).exec(),
        WeatherData.findOne().sort({ temperature: 1 }).exec(),
        WeatherData.findOne().sort({ windSpeed: -1 }).exec(),
        WeatherData.findOne().sort({ humidity: -1 }).exec()
      ]);

      return {
        hottest: hottest ? { location: hottest.location, temperature: hottest.temperature } : null,
        coldest: coldest ? { location: coldest.location, temperature: coldest.temperature } : null,
        windiest: windiest ? { location: windiest.location, windSpeed: windiest.windSpeed } : null,
        wettest: wettest ? { location: wettest.location, humidity: wettest.humidity } : null
      };
    } catch (error) {
      throw new Error(`Failed to fetch extreme weather conditions: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Helper methods for generating random weather data
  private static generateRandomTemperature(baseTemp: number): number {
    return Math.round(baseTemp + (Math.random() - 0.5) * 8);
  }

  private static generateRandomWindSpeed(baseSpeed: number): number {
    return Math.max(0, Math.round(baseSpeed + (Math.random() - 0.5) * 6));
  }

  private static generateRandomCondition(): string {
    const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Rain', 'Snow', 'Storm'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  private static generateRandomHumidity(baseHumidity: number): number {
    return Math.max(0, Math.min(100, Math.round(baseHumidity + (Math.random() - 0.5) * 15)));
  }

  private static generateRandomPressure(basePressure: number): number {
    return Math.round(basePressure + (Math.random() - 0.5) * 10);
  }
}
