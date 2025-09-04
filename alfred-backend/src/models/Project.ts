import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  id: string;
  name: string;
  location: {
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  capacity: string;
  progress: number;
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  weather: {
    temperature: number;
    windSpeed: number;
    condition: string;
    humidity: number;
    pressure: number;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

const ProjectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  },
  capacity: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'on-hold'],
    default: 'active'
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  weather: {
    temperature: {
      type: Number,
      default: 20
    },
    windSpeed: {
      type: Number,
      default: 10
    },
    condition: {
      type: String,
      default: 'Clear'
    },
    humidity: {
      type: Number,
      default: 50
    },
    pressure: {
      type: Number,
      default: 1013
    },
    updatedAt: {
      type: String,
      default: new Date().toISOString()
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id field
ProjectSchema.virtual('id').get(function(this: any) {
  return this._id.toString();
});

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
