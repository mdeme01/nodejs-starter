import dotenv from 'dotenv';
import express from 'express';
import { verifyToken } from './middleware/verify-token';
import { prisma } from './prisma/client';
import { auth } from './routes/auth';

dotenv.config();

const server_port = Number(process.env['SERVER_PORT'] || 8080);

const main = async (): Promise<void> => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/auth', auth);

  app.get('/', (_req, res) => {
    res.status(200).send({ data: 'Hello world!' });
  });

  app.get('/protected', verifyToken, (_req, res) => {
    res.status(200).send({ message: 'Welcome!' });
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
