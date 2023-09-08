import { HttpStatus } from '../../../src/consts';
import {
  insertUser,
  BASE_USER_PATH,
  isValidUserResponse,
  deleteUser,
  insertAdminUser,
  UserResponse,
  retrieveUser,
} from '../helpers/user';
import { loginUser } from '../helpers/auth';
import { cleanDatabase } from '../helpers/db';
import { INEXISTENT_ID, deleteRequest, getRequest, postRequest, putRequest } from '../helpers/request';
import { CREATE_USER_ALBER_PAYLOAD, CREATE_USER_ANA_PAYLOAD, CREATE_USER_CRIS_PAYLOAD } from '../fixtures/users';
import { ADMIN_CREDENTIALS } from '../fixtures/auth';
import { isErrorResponse } from '../helpers/error';

beforeAll(async () => {
  await insertAdminUser();
  await cleanDatabase({ all: false });
});

afterAll(async () => {
  await cleanDatabase({ all: true });
});

describe('USERS', () => {
  describe('GET /:id', () => {
    it('find by id', async () => {
      const { id: userId } = await insertUser(CREATE_USER_CRIS_PAYLOAD);

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_USER_PATH}/${userId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(isValidUserResponse(body)).toBeTruthy();

      await deleteUser(userId);
    });

    it('not found', async () => {
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_USER_PATH}/${INEXISTENT_ID}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });

    it('password hash not returned', async () => {
      const { id: userId } = await insertUser(CREATE_USER_CRIS_PAYLOAD);

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_USER_PATH}/${userId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.password).toBeUndefined();

      await deleteUser(userId);
    });
  });

  describe('GET /', () => {
    it('list with 3 elements', async () => {
      const createUserPayloads = [CREATE_USER_CRIS_PAYLOAD, CREATE_USER_ALBER_PAYLOAD, CREATE_USER_ANA_PAYLOAD];
      const createdUsers = await Promise.all(createUserPayloads.map(async (payload) => insertUser(payload)));

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_USER_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(4);

      const users = body as UserResponse[];
      users.forEach((user) => expect(isValidUserResponse(user)).toBeTruthy());

      await Promise.all(createdUsers.map(({ id }) => deleteUser(id)));
    });

    it('empty list', async () => {
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_USER_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(1);
    });

    it('password hash not returned', async () => {
      const createUserPayloads = [CREATE_USER_CRIS_PAYLOAD, CREATE_USER_ALBER_PAYLOAD, CREATE_USER_ANA_PAYLOAD];
      const createdUsers = await Promise.all(createUserPayloads.map(async (payload) => insertUser(payload)));

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_USER_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(4);

      body.forEach((user: Record<string, unknown>) => expect(user.passwordHash).toBeUndefined());

      await Promise.all(createdUsers.map(({ id }) => deleteUser(id)));
    });
  });

  describe('POST /', () => {
    it('create', async () => {
      const { statusCode, body } = await postRequest({
        url: `${BASE_USER_PATH}/`,
        dto: CREATE_USER_CRIS_PAYLOAD,
      });

      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(isValidUserResponse(body)).toBeTruthy();

      const { id } = body as UserResponse;
      expect(id).toBeDefined();

      const { username } = CREATE_USER_CRIS_PAYLOAD;
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
      const { statusCode: statusCode1, body: body1 } = await postRequest({
        url: `${BASE_USER_PATH}/`,
        dto: CREATE_USER_CRIS_PAYLOAD,
      });

      expect(statusCode1).toBe(HttpStatus.CREATED);
      expect(isValidUserResponse(body1)).toBeTruthy();

      const { statusCode: statusCode2, body: body2 } = await postRequest({
        url: `${BASE_USER_PATH}/`,
        dto: CREATE_USER_CRIS_PAYLOAD,
      });

      expect(statusCode2).toBe(HttpStatus.CONFLICT);
      expect(isErrorResponse(body2)).toBeTruthy();

      await deleteUser(body1.id);
    });

    it('password hash not returned', async () => {
      const { statusCode, body } = await postRequest({
        url: `${BASE_USER_PATH}/`,
        dto: CREATE_USER_CRIS_PAYLOAD,
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
      const { id: userId } = await insertUser(CREATE_USER_CRIS_PAYLOAD);

      const createdUser = await retrieveUser(userId);
      const { username } = CREATE_USER_CRIS_PAYLOAD;
      expect(createdUser).toMatchObject({ id: userId, username });

      const updateUserPayload = { username: 'cfres' };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await putRequest({
        url: `${BASE_USER_PATH}/${userId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: updateUserPayload,
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: userId, ...updateUserPayload });

      await deleteUser(userId);
    });

    it('invalid dto', async () => {
      const { id: userId } = await insertUser(CREATE_USER_CRIS_PAYLOAD);

      const updateUserPayload = { user: 'cfres' };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await putRequest({
        url: `${BASE_USER_PATH}/${userId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: updateUserPayload,
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteUser(userId);
    });

    it('not found', async () => {
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await putRequest({
        url: `${BASE_USER_PATH}/${INEXISTENT_ID}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: CREATE_USER_CRIS_PAYLOAD,
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });

    it('duplicate', async () => {
      const { id: id1 } = await insertUser(CREATE_USER_CRIS_PAYLOAD);

      const { id: id2 } = await insertUser(CREATE_USER_ANA_PAYLOAD);

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await putRequest({
        url: `${BASE_USER_PATH}/${id1}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: CREATE_USER_ANA_PAYLOAD,
      });

      expect(statusCode).toBe(HttpStatus.CONFLICT);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteUser(id1);
      await deleteUser(id2);
    });

    it('password hash not returned', async () => {
      const { id: userId } = await insertUser(CREATE_USER_CRIS_PAYLOAD);

      const updateUserPayload = { username: 'cfres' };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await putRequest({
        url: `${BASE_USER_PATH}/${userId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: updateUserPayload,
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.passwordHash).toBeUndefined();

      await deleteUser(userId);
    });
  });

  describe('DELETE /:id', () => {
    it('delete', async () => {
      const { id: userId } = await insertUser(CREATE_USER_CRIS_PAYLOAD);

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await deleteRequest({
        url: `${BASE_USER_PATH}/${userId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);

      const { username } = CREATE_USER_CRIS_PAYLOAD;
      expect(body).toMatchObject({ id: userId, username });

      const user = await retrieveUser(userId);
      expect(user).toBeNull();
    });

    it('not found', async () => {
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode } = await deleteRequest({
        url: `${BASE_USER_PATH}/${INEXISTENT_ID}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('password hash not returned', async () => {
      const { id: userId } = await insertUser(CREATE_USER_CRIS_PAYLOAD);

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await deleteRequest({
        url: `${BASE_USER_PATH}/${userId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);

      expect(body.passwordHash).toBeUndefined();

      const user = await retrieveUser(userId);
      expect(user).toBeNull();
    });
  });
});
