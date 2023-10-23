import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

const accessTokenSecret = process.env['ACCESS_TOKEN_SECRET'] || '';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || '';

  if (!token) {
    res.sendStatus(401);
  }

  jwt.verify(token, accessTokenSecret, (err, payload) => {
    if (err) {
      res.status(403).json({ err });
    } else {
      const { name, email } = payload as { name: string; email: string };
      req.user = { name, email };
      next();
    }
  });
};
