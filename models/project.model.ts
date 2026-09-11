import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProjectMember {
  user: Types.ObjectId;
  role: 'owner' | 'manager' | 'member';
}

export interface IProject extends Document {
  name: string;
  description?: string;
  owner: Types.ObjectId;
  members: IProjectMember[];
  tags: string[];
  category?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['owner', 'manager', 'member'], default: 'member' },
      },
    ],
    tags: { type: [String], default: [] },
    category: { type: String, trim: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', projectSchema);