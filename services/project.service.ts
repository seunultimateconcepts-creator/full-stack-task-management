import { Project, IProject } from '../models/project.model';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { Types } from 'mongoose';

interface CreateProjectInput {
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
}

export const createProject = async (
  ownerId: string,
  input: CreateProjectInput
): Promise<IProject> => {
  const project = await Project.create({
    ...input,
    owner: ownerId,
    members: [{ user: ownerId, role: 'owner' }],
  });
  return project;
};

export const getProjectsForUser = async (userId: string): Promise<IProject[]> => {
  return Project.find({
    $or: [{ owner: userId }, { 'members.user': userId }],
    isArchived: false,
  }).populate('owner', 'name email');
};

export const getProjectById = async (projectId: string, userId: string): Promise<IProject> => {
  const project = await Project.findById(projectId).populate('owner', 'name email');
  if (!project) throw new NotFoundError('Project not found');

  const isMember = project.members.some((m) => m.user.toString() === userId);
  if (!isMember) throw new ForbiddenError('You are not a member of this project');

  return project;
};

export const updateProject = async (
  projectId: string,
  userId: string,
  updates: Partial<CreateProjectInput>
): Promise<IProject> => {
  const project = await Project.findById(projectId);
  if (!project) throw new NotFoundError('Project not found');

  const member = project.members.find((m) => m.user.toString() === userId);
  if (!member || (member.role !== 'owner' && member.role !== 'manager')) {
    throw new ForbiddenError('Insufficient permissions to update this project');
  }

  Object.assign(project, updates);
  await project.save();
  return project;
};

export const archiveProject = async (projectId: string, userId: string): Promise<IProject> => {
  const project = await Project.findById(projectId);
  if (!project) throw new NotFoundError('Project not found');

  if (project.owner.toString() !== userId) {
    throw new ForbiddenError('Only the owner can archive this project');
  }

  project.isArchived = true;
  await project.save();
  return project;
};

export const addMember = async (
  projectId: string,
  requesterId: string,
  newMemberId: string,
  role: 'manager' | 'member' = 'member'
): Promise<IProject> => {
  const project = await Project.findById(projectId);
  if (!project) throw new NotFoundError('Project not found');

  const requester = project.members.find((m) => m.user.toString() === requesterId);
  if (!requester || (requester.role !== 'owner' && requester.role !== 'manager')) {
    throw new ForbiddenError('Insufficient permissions to add members');
  }

  const alreadyMember = project.members.some((m) => m.user.toString() === newMemberId);
  if (alreadyMember) throw new ForbiddenError('User is already a member');

  project.members.push({ user: new Types.ObjectId(newMemberId), role });
  await project.save();
  return project;
};