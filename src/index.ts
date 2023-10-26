import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import { verifyAdmin } from './middleware/verify-admin';
import { verifyToken } from './middleware/verify-token';
import { prisma } from './prisma/client';
import { auth } from './routes/auth';

dotenv.config();

const server_port = Number(process.env['SERVER_PORT'] || 8080);

const main = async (): Promise<void> => {
  const app = express();

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/auth', auth);

  app.get('/', (_req, res) => {
    return res.status(200).json({ message: 'Welcome Anonymus!' });
  });

  app.get('/protected', verifyToken, (req, res) => {
    return res.status(200).json({ message: `Welcome ${req.user.name}!` });
  });

  app.get('/admin', verifyToken, verifyAdmin, (req, res) => {
    return res.status(200).json({ message: `Welcome ${req.user.name}!` });
  });

  app.listen(server_port, () =>
    console.log(`> Server running on http://localhost:${server_port}`)
  );
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
