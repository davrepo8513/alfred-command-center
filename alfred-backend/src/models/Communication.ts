import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunication extends Document {
  id: string;
  type: 'insight' | 'status-update' | 'permit' | 'risk';
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  source: 'ai' | 'contractor' | 'authority' | 'system';
  projectId: string;
  tags: string[];
  postedAt: string;
  isAI: boolean;
  createdAt: string;
  updatedAt: string;
}

const CommunicationSchema = new Schema<ICommunication>({
  type: {
    type: String,
    required: true,
    enum: ['insight', 'status-update', 'permit', 'risk']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'critical'],
    default: 'normal'
  },
  source: {
    type: String,
    required: true,
    enum: ['ai', 'contractor', 'authority', 'system']
  },
  projectId: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  postedAt: {
    type: String,
    default: new Date().toISOString()
  },
  isAI: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id field
CommunicationSchema.virtual('id').get(function(this: any) {
  return this._id.toString();
});

// Index for better query performance
CommunicationSchema.index({ projectId: 1, type: 1, priority: 1 });
CommunicationSchema.index({ postedAt: -1 });
CommunicationSchema.index({ tags: 1 });

export const Communication = mongoose.model<ICommunication>('Communication', CommunicationSchema);
