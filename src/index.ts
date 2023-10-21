import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const server_port = Number(process.env['SERVER_PORT'] || 8080);

const prisma = new PrismaClient();

const main = async (): Promise<void> => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (_req, res) => {
    res.status(200).send({ data: 'Hello world!' });
  });

  app.post('/user/create', async (req, res) => {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    try {
      const password_hash = await bcrypt.hash(password, 10);

      await prisma.users.create({
        data: {
          name,
          email,
          password_hash,
        },
      });

      res.status(201).send({
        message: 'User created.',
      });
    } catch {
      res.status(400).send({
        message: 'Error creating user.',
      });
    }
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
