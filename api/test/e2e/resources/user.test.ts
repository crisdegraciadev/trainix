import request from 'supertest';

import app from '../../../src/app';
import { HttpStatus } from '../../../src/consts';
import {
  BASE_USER_PATH,
  UNEXISTENT_ID,
  UserResponse,
  createUser,
  deleteUser,
  findUserById,
  isErrorResponse,
  isValidUserResponse,
} from '../helpers';

describe('USERS', () => {
  describe('GET /:id', () => {
    it('find by id', async () => {
      const createUserPayload = { username: 'cris' };
      const { id: userId } = await createUser(createUserPayload);

      const { statusCode, body } = await request(app).get(`${BASE_USER_PATH}/${userId}`).send();

      expect(statusCode).toBe(HttpStatus.OK);
      expect(isValidUserResponse(body)).toBeTruthy();

      await deleteUser(userId);
    });

    it('not found', async () => {
      const { statusCode, body } = await request(app).get(`${BASE_USER_PATH}/${UNEXISTENT_ID}`).send();
      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });

  describe('GET /', () => {
    it('list with 3 elements', async () => {
      const createUserPayloads = [{ username: 'cris' }, { username: 'ana' }, { username: 'alber' }];
      const createdUsers = await Promise.all(createUserPayloads.map(async (payload) => createUser(payload)));

      const { statusCode, body } = await request(app).get(`${BASE_USER_PATH}/`).send();

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(3);

      const users = body as UserResponse[];
      users.forEach((user) => expect(isValidUserResponse(user)).toBeTruthy());

      await Promise.all(createdUsers.map(({ id }) => deleteUser(id)));
    });

    it('empty list', async () => {
      const { statusCode, body } = await request(app).get(`${BASE_USER_PATH}/`).send();

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(0);
    });
  });

  describe('POST /', () => {
    it('create', async () => {
      const createUserPayload = { username: 'cris' };

      const { statusCode, body } = await request(app).post(`${BASE_USER_PATH}/`).send(createUserPayload);

      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(isValidUserResponse(body)).toBeTruthy();

      const { id, username } = body as UserResponse;
      expect(username).toBe(createUserPayload.username);
      expect(id).toBeDefined();

      await deleteUser(id);
    });

    it('invalid dto', async () => {
      const createUserPayload = { user: 'cris' };

      const { statusCode, body } = await request(app).post(`${BASE_USER_PATH}/`).send(createUserPayload);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();
    });

    it('duplicate username', async () => {
      const createUserPayload = { username: 'cris' };

      const { statusCode: statusCode1, body: body1 } = await request(app)
        .post(`${BASE_USER_PATH}/`)
        .send(createUserPayload);

      expect(statusCode1).toBe(HttpStatus.CREATED);
      expect(isValidUserResponse(body1)).toBeTruthy();

      const { statusCode: statusCode2, body: body2 } = await request(app)
        .post(`${BASE_USER_PATH}/`)
        .send(createUserPayload);

      expect(statusCode2).toBe(HttpStatus.CONFLICT);
      expect(isErrorResponse(body2)).toBeTruthy();

      await deleteUser(body1.id);
    });
  });

  describe('PUT /:id', () => {
    it('update', async () => {
      const createUserPayload = { username: 'cris' };
      const { id: userId } = await createUser(createUserPayload);

      const createdUser = await findUserById(userId);
      expect(createdUser).toMatchObject({ id: userId, ...createUserPayload });

      const updateUserPayload = { username: 'cfres' };
      const { statusCode, body } = await request(app).put(`${BASE_USER_PATH}/${userId}`).send(updateUserPayload);

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: userId, ...updateUserPayload });

      await deleteUser(userId);
    });

    it('invalid dto', async () => {
      const createUserPayload = { username: 'cris' };
      const { id: userId } = await createUser(createUserPayload);

      const updateUserPayload = { user: 'cfres' };
      const { statusCode, body } = await request(app).put(`${BASE_USER_PATH}/${userId}`).send(updateUserPayload);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteUser(userId);
    });

    it('not found', async () => {
      const updateUserPayload = { username: 'cris' };
      const { statusCode, body } = await request(app).put(`${BASE_USER_PATH}/${UNEXISTENT_ID}`).send(updateUserPayload);

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });

    it('duplicate', async () => {
      const createUserPayload1 = { username: 'cris' };
      const { id: id1 } = await createUser(createUserPayload1);

      const createUserPayload2 = { username: 'ana' };
      const { id: id2 } = await createUser(createUserPayload2);

      const { statusCode, body } = await request(app).put(`${BASE_USER_PATH}/${id1}`).send(createUserPayload2);

      expect(statusCode).toBe(HttpStatus.CONFLICT);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteUser(id1);
      await deleteUser(id2);
    });
  });

  describe('DELETE /:id', () => {
    it('delete', async () => {
      const createUserPayload = { username: 'cris' };
      const { id: userId } = await createUser(createUserPayload);

      const { statusCode, body } = await request(app).delete(`${BASE_USER_PATH}/${userId}`).send();

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: userId, ...createUserPayload });

      const user = await findUserById(userId);
      expect(user).toBeNull();
    });

    it('not found', async () => {
      const { statusCode } = await request(app).delete(`${BASE_USER_PATH}/${UNEXISTENT_ID}`).send();
      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
