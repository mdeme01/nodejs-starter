import dotenv from 'dotenv';

dotenv.config();

const accessTokenSecret =
  process.env['ACCESS_TOKEN_SECRET'] || crypto.randomUUID();

const refreshTokenSecret =
  process.env['REFRESH_TOKEN_SECRET'] || crypto.randomUUID();

export { accessTokenSecret, refreshTokenSecret };
