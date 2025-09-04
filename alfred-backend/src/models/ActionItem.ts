import mongoose, { Schema, Document } from 'mongoose';

export interface IActionItem extends Document {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in-progress' | 'monitoring' | 'resolved';
  dueDate: string;
  projectId: string;
  type: 'rfi' | 'risk' | 'task' | 'alert';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

const ActionItemSchema = new Schema<IActionItem>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'monitoring', 'resolved'],
    default: 'new'
  },
  dueDate: {
    type: String,
    required: true
  },
  projectId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['rfi', 'risk', 'task', 'alert'],
    required: true
  },
  assignedTo: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id field
ActionItemSchema.virtual('id').get(function(this: any) {
  return this._id.toString();
});

// Index for better query performance
ActionItemSchema.index({ projectId: 1, status: 1, priority: 1 });
ActionItemSchema.index({ dueDate: 1 });

export const ActionItem = mongoose.model<IActionItem>('ActionItem', ActionItemSchema);
