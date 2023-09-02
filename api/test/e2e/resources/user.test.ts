import { HttpStatus } from '../../../src/consts';
import { isErrorResponse } from '../helpers/error';
import {
  createUser,
  BASE_USER_PATH,
  isValidUserResponse,
  deleteUser,
  UserResponse,
  findUserById,
} from '../helpers/user';
import { loginUser } from '../helpers/auth';
import { createAdmin, cleanDatabase } from '../helpers/db';
import { deleteRequest, getRequest, INEXISTENT_ID, postRequest, putRequest } from '../helpers/request';

beforeAll(async () => {
  await createAdmin();
  await cleanDatabase({ all: false });
});

afterAll(async () => {
  await cleanDatabase({ all: true });
});

describe('USERS', () => {
  describe('GET /:id', () => {
    it('find by id', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const ACCESS_TOKEN = await loginUser({ email: 'admin', password: 'admin' });

      const { statusCode, body } = await getRequest({
        url: `${BASE_USER_PATH}/${userId}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(isValidUserResponse(body)).toBeTruthy();

      await deleteUser(userId);
    });

    it('not found', async () => {
      const ACCESS_TOKEN = await loginUser({ email: 'admin', password: 'admin' });

      const { statusCode, body } = await getRequest({
        url: `${BASE_USER_PATH}/${INEXISTENT_ID}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });

    it('password hash not returned', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const ACCESS_TOKEN = await loginUser({ email: 'admin', password: 'admin' });

      const { statusCode, body } = await getRequest({
        url: `${BASE_USER_PATH}/${userId}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.password).toBeUndefined();

      await deleteUser(userId);
    });
  });

  describe('GET /', () => {
    it('list with 3 elements', async () => {
      const createUserPayloads = [
        { username: 'cris', password: '1234', repeatedPassword: '1234' },
        { username: 'ana', password: '1234', repeatedPassword: '1234' },
        { username: 'alberto', password: '1234', repeatedPassword: '1234' },
      ];

      const createdUsers = await Promise.all(createUserPayloads.map(async (payload) => createUser(payload)));

      const ACCESS_TOKEN = await loginUser({ email: 'admin', password: 'admin' });

      const { statusCode, body } = await getRequest({
        url: `${BASE_USER_PATH}/`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(4);

      const users = body as UserResponse[];
      users.forEach((user) => expect(isValidUserResponse(user)).toBeTruthy());

      await Promise.all(createdUsers.map(({ id }) => deleteUser(id)));
    });

    it('empty list', async () => {
      const ACCESS_TOKEN = await loginUser({ email: 'admin', password: 'admin' });

      const { statusCode, body } = await getRequest({
        url: `${BASE_USER_PATH}/`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(1);
    });

    it('password hash not returned', async () => {
      const createUserPayloads = [
        { username: 'cris', password: '1234', repeatedPassword: '1234' },
        { username: 'ana', password: '1234', repeatedPassword: '1234' },
        { username: 'alberto', password: '1234', repeatedPassword: '1234' },
      ];

      const createdUsers = await Promise.all(createUserPayloads.map(async (payload) => createUser(payload)));

      const ACCESS_TOKEN = await loginUser({ email: 'admin', password: 'admin' });

      const { statusCode, body } = await getRequest({
        url: `${BASE_USER_PATH}/`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(4);

      body.forEach((user: Record<string, unknown>) => expect(user.passwordHash).toBeUndefined());

      await Promise.all(createdUsers.map(({ id }) => deleteUser(id)));
    });
  });

  describe('POST /', () => {
    it('create', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };

      const { statusCode, body } = await postRequest({
        url: `${BASE_USER_PATH}/`,
        dto: createUserPayload,
      });

      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(isValidUserResponse(body)).toBeTruthy();

      const { id } = body as UserResponse;
      expect(id).toBeDefined();

      const { username } = createUserPayload;
      expect(body).toMatchObject({ id, username });

      await deleteUser(id);
    });

    it('invalid dto', async () => {
      const createUserPayload = { user: 'cris' };

      const { statusCode, body } = await postRequest({
        url: `${BASE_USER_PATH}/`,
        dto: createUserPayload,
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();
    });

    it('duplicate username', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };

      const { statusCode: statusCode1, body: body1 } = await postRequest({
        url: `${BASE_USER_PATH}/`,
        dto: createUserPayload,
      });

      expect(statusCode1).toBe(HttpStatus.CREATED);
      expect(isValidUserResponse(body1)).toBeTruthy();

      const { statusCode: statusCode2, body: body2 } = await postRequest({
        url: `${BASE_USER_PATH}/`,
        dto: createUserPayload,
      });

      expect(statusCode2).toBe(HttpStatus.CONFLICT);
      expect(isErrorResponse(body2)).toBeTruthy();

      await deleteUser(body1.id);
    });

    it('password hash not returned', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };

      const { statusCode, body } = await postRequest({
        url: `${BASE_USER_PATH}/`,
        dto: createUserPayload,
      });

      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(isValidUserResponse(body)).toBeTruthy();

      const { id } = body as UserResponse;
      expect(id).toBeDefined();

      expect(body.password).toBeUndefined();

      await deleteUser(id);
    });
  });

  describe('PUT /:id', () => {
    it('update', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const createdUser = await findUserById(userId);
      const { username } = createUserPayload;
      expect(createdUser).toMatchObject({ id: userId, username });

      const updateUserPayload = { username: 'cfres' };

      const ACCESS_TOKEN = await loginUser({ email: 'admin', password: 'admin' });

      const { statusCode, body } = await putRequest({
        url: `${BASE_USER_PATH}/${userId}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        dto: updateUserPayload,
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: userId, ...updateUserPayload });

      await deleteUser(userId);
    });

    it('invalid dto', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const updateUserPayload = { user: 'cfres' };

      const ACCESS_TOKEN = await loginUser({ email: 'admin', password: 'admin' });

      const { statusCode, body } = await putRequest({
        url: `${BASE_USER_PATH}/${userId}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        dto: updateUserPayload,
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteUser(userId);
    });

    it('not found', async () => {
      const updateUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };

      const ACCESS_TOKEN = await loginUser({ email: 'admin', password: 'admin' });

      const { statusCode, body } = await putRequest({
        url: `${BASE_USER_PATH}/${INEXISTENT_ID}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        dto: updateUserPayload,
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });

    it('duplicate', async () => {
      const createUserPayload1 = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: id1 } = await createUser(createUserPayload1);

      const createUserPayload2 = { username: 'ana', password: '1234', repeatedPassword: '1234' };
      const { id: id2 } = await createUser(createUserPayload2);

      const ACCESS_TOKEN = await loginUser({ email: 'admin', password: 'admin' });

      const { statusCode, body } = await putRequest({
        url: `${BASE_USER_PATH}/${id1}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        dto: createUserPayload2,
      });

      expect(statusCode).toBe(HttpStatus.CONFLICT);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteUser(id1);
      await deleteUser(id2);
    });

    it('password hash not returned', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const updateUserPayload = { username: 'cfres' };

      const ACCESS_TOKEN = await loginUser({ email: 'admin', password: 'admin' });

      const { statusCode, body } = await putRequest({
        url: `${BASE_USER_PATH}/${userId}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        dto: updateUserPayload,
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.passwordHash).toBeUndefined();

      await deleteUser(userId);
    });
  });

  describe('DELETE /:id', () => {
    it('delete', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const ACCESS_TOKEN = await loginUser({ email: 'admin', password: 'admin' });

      const { statusCode, body } = await deleteRequest({
        url: `${BASE_USER_PATH}/${userId}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.OK);

      const { username } = createUserPayload;
      expect(body).toMatchObject({ id: userId, username });

      const user = await findUserById(userId);
      expect(user).toBeNull();
    });

    it('not found', async () => {
      const ACCESS_TOKEN = await loginUser({ email: 'admin', password: 'admin' });

      const { statusCode } = await deleteRequest({
        url: `${BASE_USER_PATH}/${INEXISTENT_ID}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('password hash not returned', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const ACCESS_TOKEN = await loginUser({ email: 'admin', password: 'admin' });

      const { statusCode, body } = await deleteRequest({
        url: `${BASE_USER_PATH}/${userId}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.passwordHash).toBeUndefined();

      const user = await findUserById(userId);
      expect(user).toBeNull();
    });
  });
});
