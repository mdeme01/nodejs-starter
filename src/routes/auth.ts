import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import bcrypt from 'bcrypt';
import express from 'express';
import { generateAccessToken, generateRefreshToken } from '../jwt/utils';
import { verifyToken } from '../middleware/verify-token';
import { prisma } from '../prisma/client';

const auth = express.Router();

auth.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    if (!name || !email || !password) {
      return res.sendStatus(400);
    }

    const users = await prisma.users.findMany();
    const emails = users.map((user) => user.email);

    if (emails.includes(email)) {
      return res.status(400).json({ error: 'Email already exists!' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: {
        name,
        email,
        password_hash,
      },
    });

    return res.status(201).json({ name, email });
  } catch (e) {
    return res.sendStatus(500);
  }
});

auth.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await prisma.users.findFirstOrThrow({ where: { email } });
    const passwordHash = user.password_hash;

    const passwordMatch = await bcrypt.compare(password, passwordHash);

    if (!passwordMatch) {
      return res.sendStatus(401);
    }

    const accessToken = generateAccessToken(user.name, user.email);
    const refreshToken = generateRefreshToken(user.name, user.email);

    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.cookie('refreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    return res.status(201).json({ message: `Welcome ${user.name}!` });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return res.sendStatus(404);
    } else {
      return res.sendStatus(500);
    }
  }
});

auth.delete('/logout', verifyToken, (req, res) => {
  res.removeHeader('Authorization');
  res.clearCookie('refreshToken');
  res.status(204).json({ message: `Bye ${req.user.name}!` });
});

export { auth };
