import { NextFunction, Request, Response } from 'express';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../jwt/utils';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const refreshCookie = req.cookies['refreshToken'] as string | undefined;

  const accessToken = (authHeader && authHeader.split(' ')[1]) || '';
  const refreshToken = refreshCookie || '';

  if (!accessToken) {
    return res.sendStatus(401);
  }

  verifyAccessToken(accessToken, (accessTokenErr, aTokenPayload) => {
    if (accessTokenErr) {
      verifyRefreshToken(refreshToken, (refreshTokenErr, rTokenPayload) => {
        if (refreshTokenErr) {
          return res.sendStatus(403);
        } else {
          const { name, email } = rTokenPayload as {
            name: string;
            email: string;
          };

          const newAccessToken = generateAccessToken(name, email);
          const newRefreshToken = generateRefreshToken(name, email);

          res.setHeader('Authorization', `Bearer ${newAccessToken}`);
          res.cookie('refreshToken', newRefreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
          });

          req.user = { name, email };
          return next();
        }
      });
    } else {
      const { name, email } = aTokenPayload as {
        name: string;
        email: string;
      };

      req.user = { name, email };
      return next();
    }
  });
};
