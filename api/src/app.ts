import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { activitiesRouter, authRouter, userRouter, workoutRouter } from './resources';
import { RoutesConstants } from './consts';
import { Global } from './consts/global';

require('dotenv').config();

const app = express();

if (Global.ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(RoutesConstants.USERS, userRouter);
app.use(RoutesConstants.WORKOUTS, workoutRouter);
app.use(RoutesConstants.ACTIVITIES, activitiesRouter);
app.use(RoutesConstants.AUTH, authRouter);

export default app;
