import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(2).max(150),
  description: z.string().max(1000).optional(),
  project: z.string().min(1, 'project id is required'),
  assignedTo: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(2).max(150).optional(),
  description: z.string().max(1000).optional(),
  assignedTo: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'done']).optional(),
  dueDate: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
});