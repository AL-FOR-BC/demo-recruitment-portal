import express from 'express';
import { PORT } from './config';
import App from './services/ExpressApp';

const StartServer = async () => {
  const app = express();

//   await dbConnection();

  await App(app);
  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
  });
};

StartServer();