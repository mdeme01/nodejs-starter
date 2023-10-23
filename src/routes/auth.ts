import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';

dotenv.config();

const accessTokenSecret = process.env['ACCESS_TOKEN_SECRET'] || '';

const generateAccessToken = (name: string, email: string) => {
  return jwt.sign({ name, email }, accessTokenSecret);
};

const auth = express.Router();

auth.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    const password_hash = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: {
        name,
        email,
        password_hash,
      },
    });

    res.sendStatus(201);
  } catch (e) {
    console.error(e);
  }
});

auth.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const user = await prisma.users.findFirstOrThrow({ where: { email } });
    const passwordHash = user.password_hash;

    if (!bcrypt.compare(password, passwordHash)) {
      res.sendStatus(401);
    }

    const accessToken = generateAccessToken(user.name, user.email);

    res.status(201).json({ accessToken });
  } catch (e) {
    console.error(e);
  }
});

export { auth };
