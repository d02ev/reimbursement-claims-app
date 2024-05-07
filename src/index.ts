import 'dotenv/config';

import express, { Application, json, urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { ServerConfig } from './configs';
import { errorHandler } from './middlewares';
import { authRoutes } from './routes';
import passport from 'passport';
import { jwtStrategy, localStrategy } from './strategy';

const app: Application = express();

app.use(cors());
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(passport.initialize());

localStrategy(passport);
jwtStrategy(passport);

// routes
app.use('/api/auth', authRoutes);

app.use(errorHandler);

const PORT = parseInt(process.env.PORT!) || 3000;
new ServerConfig(PORT, app).initServer();
