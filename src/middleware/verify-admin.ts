import { NextFunction, Request, Response } from 'express';

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role !== 'admin') {
    return res.sendStatus(401);
  } else {
    return next();
  }
};
