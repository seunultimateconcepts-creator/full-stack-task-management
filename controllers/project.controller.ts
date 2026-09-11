import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as projectService from '../services/project.service';

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.createProject(req.user!.id, req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

export const getProjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projects = await projectService.getProjectsForUser(req.user!.id);
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
};

export const getProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.getProjectById(String(req.params.id), req.user!.id);
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.updateProject(
      String(req.params.id),
      req.user!.id,
      req.body
    );
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

export const archiveProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.archiveProject(String(req.params.id), req.user!.id);
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

export const addMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.body;
    const project = await projectService.addMember(
      String(req.params.id),
      req.user!.id,
      userId,
      role
    );
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};