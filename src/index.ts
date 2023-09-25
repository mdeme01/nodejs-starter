import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const server_port = Number(process.env['SERVER_PORT'] || 8080);

const main = async (): Promise<void> => {
  const app = express();

  app.get('/', (_req, res) => {
    res.status(200).send({ data: 'Hello world!' });
  });

  app.listen(server_port, () =>
    console.log(`> Server running on http://localhost:${server_port}`)
  );
};

main()
  .then()
  .catch((e) => console.error(e));
