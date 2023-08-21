import request from 'supertest';

import app from '../../../src/app';
import { cleanDatabase, createUser, deleteUser } from '../helpers';
import { BASE_AUTH_PATH } from '../helpers/auth';
import { HttpStatus } from '../../../src/consts';

beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
});

describe('AUTH', () => {
  describe('LOGIN', () => {
    it('valid credentials', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { username, password } = createUserPayload;
      const { id: userId } = await createUser(createUserPayload);

      const { statusCode, body } = await request(app).post(`${BASE_AUTH_PATH}/login`).send({ username, password });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toHaveProperty('accessToken');
      expect(typeof body.accessToken === 'string').toBeTruthy();

      deleteUser(userId);
    });

    it('invalid credentials', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { username, password } = createUserPayload;
      const { id: userId } = await createUser(createUserPayload);

      const { statusCode, body } = await request(app)
        .post(`${BASE_AUTH_PATH}/login`)
        .send({ username, password: 'b4d_p4ss' });

      expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);

      deleteUser(userId);
    });
  });
});
