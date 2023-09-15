import request from 'supertest';

import app from '../../../src/app';

import { HttpStatus } from '../../../src/consts';
import { LoginDto } from '../../../src/auth/types';

export const BASE_AUTH_PATH = '/auth';

export const loginUser = async ({ email, password }: LoginDto): Promise<string> => {
  const { statusCode, headers } = await request(app).post(`${BASE_AUTH_PATH}/login`).send({ email, password });
  expect(statusCode).toBe(HttpStatus.OK);
  expect(headers).toHaveProperty('set-cookie');
  return headers['set-cookie'][0];
};
