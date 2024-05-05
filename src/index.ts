import 'dotenv/config';

import express, { Application, json, urlencoded } from 'express';
import cors from 'cors';

import { ServerConfig } from './configs';

const app: Application = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

const PORT = parseInt(process.env.PORT!) || 3000;
new ServerConfig(PORT, app).initServer();
