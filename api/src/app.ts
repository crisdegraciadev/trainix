import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { RoutesConstants } from './constants';
import { userRouter } from './resources';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(RoutesConstants.USERS, userRouter);

export default app;
