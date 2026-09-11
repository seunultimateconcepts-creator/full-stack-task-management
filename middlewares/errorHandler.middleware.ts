import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error('Unexpected operational error', { error: err });
    }
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Unknown/unhandled error — log full details, never leak internals to client
  logger.error('Unhandled error', { error: err });
  res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.',
  });
};