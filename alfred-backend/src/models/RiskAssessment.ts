import mongoose, { Schema, Document } from 'mongoose';

export interface IRiskAssessment extends Document {
  id: string;
  projectId: string;
  riskType: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  probability: 'low' | 'medium' | 'high';
  mitigation: string;
  status: 'open' | 'mitigated' | 'closed';
  createdAt: string;
  updatedAt: string;
}

const RiskAssessmentSchema = new Schema<IRiskAssessment>({
  projectId: {
    type: String,
    required: true
  },
  riskType: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  impact: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  probability: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  mitigation: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'mitigated', 'closed'],
    default: 'open'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id field
RiskAssessmentSchema.virtual('id').get(function(this: any) {
  return this._id.toString();
});

// Index for better query performance
RiskAssessmentSchema.index({ projectId: 1, status: 1, impact: 1 });
RiskAssessmentSchema.index({ createdAt: -1 });

export const RiskAssessment = mongoose.model<IRiskAssessment>('RiskAssessment', RiskAssessmentSchema);
