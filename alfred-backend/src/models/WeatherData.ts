import mongoose, { Schema, Document } from 'mongoose';

export interface IWeatherData extends Document {
  id: string;
  location: string;
  temperature: number;
  windSpeed: number;
  condition: string;
  humidity: number;
  pressure: number;
  updatedAt: string;
}

const WeatherDataSchema = new Schema<IWeatherData>({
  location: {
    type: String,
    required: true,
    trim: true,
<<<<<<< HEAD
=======

>>>>>>> enhancement/features
    unique: true
  },
  temperature: {
    type: Number,
    required: true,
    min: -50,
    max: 60
  },
  windSpeed: {
    type: Number,
    required: true,
    min: 0,
    max: 200
  },
  condition: {
    type: String,
    required: true,
    enum: ['Clear', 'Partly Cloudy', 'Cloudy', 'Rain', 'Snow', 'Storm']
  },
  humidity: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  pressure: {
    type: Number,
    required: true,
    min: 800,
    max: 1200
  },
  updatedAt: {
    type: String,
    default: new Date().toISOString()
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id field
WeatherDataSchema.virtual('id').get(function(this: any) {
  return this._id.toString();
});

// Index for better query performance
<<<<<<< HEAD
WeatherDataSchema.index({ location: 1 });
=======
>>>>>>> enhancement/features
WeatherDataSchema.index({ updatedAt: -1 });

export const WeatherData = mongoose.model<IWeatherData>('WeatherData', WeatherDataSchema);
