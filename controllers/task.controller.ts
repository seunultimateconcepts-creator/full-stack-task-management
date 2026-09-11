import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as taskService from '../services/task.service';

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.createTask(req.user!.id, req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projectId = String(req.params.projectId);
    const { status, priority, assignedTo } = req.query;
    const tasks = await taskService.getTasksForProject(projectId, req.user!.id, {
      status: status as any,
      priority: priority as any,
      assignedTo: assignedTo ? String(assignedTo) : undefined,
    });
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.getTaskById(String(req.params.id), req.user!.id);
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.updateTask(String(req.params.id), req.user!.id, req.body);
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await taskService.deleteTask(String(req.params.id), req.user!.id);
    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};