import { Task, ITask, TaskPriority, TaskStatus } from '../models/task.model';
import { Project } from '../models/project.model';
import { NotFoundError, ForbiddenError } from '../utils/errors';

interface CreateTaskInput {
  title: string;
  description?: string;
  project: string;
  assignedTo?: string;
  priority?: TaskPriority;
  dueDate?: Date;
  tags?: string[];
}

const assertProjectMember = async (projectId: string, userId: string) => {
  const project = await Project.findById(projectId);
  if (!project) throw new NotFoundError('Project not found');
  const isMember = project.members.some((m) => m.user.toString() === userId);
  if (!isMember) throw new ForbiddenError('You are not a member of this project');
  return project;
};

export const createTask = async (userId: string, input: CreateTaskInput): Promise<ITask> => {
  await assertProjectMember(input.project, userId);

  const task = await Task.create({
    ...input,
    createdBy: userId,
  });
  return task;
};

export const getTasksForProject = async (
  projectId: string,
  userId: string,
  filters: { status?: TaskStatus; priority?: TaskPriority; assignedTo?: string } = {}
): Promise<ITask[]> => {
  await assertProjectMember(projectId, userId);

  return Task.find({ project: projectId, ...filters })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
};

export const getTaskById = async (taskId: string, userId: string): Promise<ITask> => {
  const task = await Task.findById(taskId)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');
  if (!task) throw new NotFoundError('Task not found');

  await assertProjectMember(task.project.toString(), userId);
  return task;
};

export const updateTask = async (
  taskId: string,
  userId: string,
  updates: Partial<CreateTaskInput> & { status?: TaskStatus }
): Promise<ITask> => {
  const task = await Task.findById(taskId);
  if (!task) throw new NotFoundError('Task not found');

  await assertProjectMember(task.project.toString(), userId);

  Object.assign(task, updates);
  await task.save();
  return task;
};

export const deleteTask = async (taskId: string, userId: string): Promise<void> => {
  const task = await Task.findById(taskId);
  if (!task) throw new NotFoundError('Task not found');

  await assertProjectMember(task.project.toString(), userId);
  await task.deleteOne();
};