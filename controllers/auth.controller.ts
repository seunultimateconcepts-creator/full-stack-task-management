import { Request, Response, NextFunction } from 'express';

const authService: {
  registerUser: (payload: any) => Promise<any>;
  loginUser: (payload: any) => Promise<any>;
  refreshAccessToken: (refreshToken: string) => Promise<any>;
  logoutUser: (userId: string, refreshToken: string) => Promise<void>;
} = (() => {
  try {
    return require('../services/auth.service');
  } catch {
    return require('../services/authService');
  }
})();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, tokens } = await authService.loginUser(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
      tokens,
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({ success: true, tokens });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const userId = (req as any).user.id; // set by auth middleware
    await authService.logoutUser(userId, refreshToken);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};