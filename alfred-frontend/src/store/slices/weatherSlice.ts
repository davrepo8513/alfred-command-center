import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  condition: string;
  humidity: number;
  pressure: number;
  updatedAt: string;
}

export interface WeatherForecast {
  date: string;
  temperature: number;
  windSpeed: number;
  condition: string;
  humidity: number;
  precipitation: number;
}

interface WeatherState {
  weatherData: Record<string, WeatherData>;
  forecasts: Record<string, WeatherForecast[]>;
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  weatherData: {},
  forecasts: {},
  loading: false,
  error: null,
};

// Async thunks
export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (location: string) => {
    const response = await fetch(`http://localhost:3001/api/weather/location/${location}`);
    const data = await response.json();
    return { location, weather: data.data };
  }
);

export const fetchWeatherForecast = createAsyncThunk(
  'weather/fetchWeatherForecast',
  async ({ location, days }: { location: string; days?: number }) => {
    const params = new URLSearchParams();
    if (days) params.append('days', days.toString());
    
    const url = `http://localhost:3001/api/weather/forecast/${location}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    return { location, forecast: data.data.forecast };
  }
);

export const simulateWeatherUpdate = createAsyncThunk(
  'weather/simulateWeatherUpdate',
  async (location: string) => {
    const response = await fetch(`http://localhost:3001/api/weather/simulate/${location}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location }),
    });
    const data = await response.json();
    return { location, weather: data.data };
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    updateWeatherData: (state, action: PayloadAction<{ location: string; weather: WeatherData }>) => {
      const { location, weather } = action.payload;
      state.weatherData[location] = weather;
    },
    updateWeatherForecast: (state, action: PayloadAction<{ location: string; forecast: WeatherForecast[] }>) => {
      const { location, forecast } = action.payload;
      state.forecasts[location] = forecast;
    },
    clearWeatherData: (state, action: PayloadAction<string>) => {
      const location = action.payload;
      delete state.weatherData[location];
      delete state.forecasts[location];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        const { location, weather } = action.payload;
        state.weatherData[location] = weather;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      })
      .addCase(fetchWeatherForecast.fulfilled, (state, action) => {
        const { location, forecast } = action.payload;
        state.forecasts[location] = forecast;
      })
      .addCase(simulateWeatherUpdate.fulfilled, (state, action) => {
        const { location, weather } = action.payload;
        state.weatherData[location] = weather;
      });
  },
});

export const { updateWeatherData, updateWeatherForecast, clearWeatherData } = weatherSlice.actions;
export default weatherSlice.reducer;
