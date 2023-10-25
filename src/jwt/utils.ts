import jwt, { VerifyCallback } from 'jsonwebtoken';
import { accessTokenSecret, refreshTokenSecret } from './secret';

const generateAccessToken = (name: string, email: string) =>
  jwt.sign({ name, email }, accessTokenSecret, { expiresIn: '10s' });

const generateRefreshToken = (name: string, email: string) =>
  jwt.sign({ name, email }, refreshTokenSecret, { expiresIn: '1d' });

const verifyAccessToken = (token: string, cb: VerifyCallback) =>
  jwt.verify(token, accessTokenSecret, cb);

const verifyRefreshToken = (token: string, cb: VerifyCallback) =>
  jwt.verify(token, refreshTokenSecret, cb);

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
