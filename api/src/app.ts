import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { exerciseRouter, userRouter, workoutRouter } from './routes';
import { RoutesConstants } from './constants/routes';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(RoutesConstants.EXERCISES, exerciseRouter);
app.use(RoutesConstants.USERS, userRouter);
app.use(RoutesConstants.WORKOUTS, workoutRouter);

export default app;
