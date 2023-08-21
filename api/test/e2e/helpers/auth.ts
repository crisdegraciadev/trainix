import request from 'supertest';

import app from '../../../src/app';

import { LoginDto } from '../../../src/resources/auth/types';

export const BASE_AUTH_PATH = '/auth';

export const loginUser = async ({ username, password }: LoginDto): Promise<string> => {
  const { body } = await request(app).post(`${BASE_AUTH_PATH}/login`).send({ username, password });
  return body.accessToken;
};
