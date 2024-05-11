import 'dotenv/config';

import express, { Application, json, urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import { ServerConfig } from './configs';
import { errorHandler } from './middlewares';
import { authRoutes } from './routes';
import { jwtStrategy, localStrategy } from './strategy';
import { claimRoutes } from './routes/claim.routes';

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
app.use('/api/claim', claimRoutes);

app.use(errorHandler);

const PORT = parseInt(process.env.PORT!) || 3000;
new ServerConfig(PORT, app).initServer();
