import express from 'express';
import requireAll from 'require-all';
import dotenv from 'dotenv';
import { catchError } from './middlewares';

const bootstrap = async () => {
  const app = express();
  const router = express.Router;

  dotenv.config();

  await app.use(express.json({ limit: '3mb' }));

  const controllers = requireAll({
    dirname: __dirname,
    filter: /^.+\.(controller)\.(t|j)s$/,
    recursive: true,
  });

  for (const name in controllers) {
    app.use(`/api/${name}`, await controllers[name].controller.default(router));

    console.log(`Module ${name} initialized`);
  }

  app.use(catchError);

  return app;
};

export default bootstrap;
