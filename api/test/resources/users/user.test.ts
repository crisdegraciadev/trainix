import request from 'supertest';

import { UserResponse, createUser, deleteAllUsers, findUserById, isValidUserResponse } from './helpers';
import app from '../../../src/app';
import { HttpStatus } from '../../../src/constants';
import { isErrorResponse } from '../../helpers';

const BASE_PATH = '/users';
const UNEXISTENT_ID = 987654321;

beforeAll(async () => {
  await deleteAllUsers();
});

afterEach(async () => {
  await deleteAllUsers();
});

describe.only('GET /:id', () => {
  it.only('find by id', async () => {
    const userPayload = { username: 'cris' };
    const { id } = await createUser(userPayload);

    const { statusCode, body } = await request(app).get(`${BASE_PATH}/${id}`).send();

    expect(statusCode).toBe(HttpStatus.OK);
    expect(isValidUserResponse(body)).toBeTruthy();
  });

  it('not found', async () => {
    const { statusCode, body } = await request(app).get(`${BASE_PATH}/${UNEXISTENT_ID}`).send();
    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(isErrorResponse(body)).toBeTruthy();
  });
});

describe('GET /', () => {
  it('list with 3 elements', async () => {
    const userPayloads = [{ username: 'cris' }, { username: 'mar' }, { username: 'alber' }];
    await Promise.all(userPayloads.map(async (payload) => createUser(payload)));

    const { statusCode, body } = await request(app).get(`${BASE_PATH}/`).send();

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(3);

    const users = body as UserResponse[];
    users.forEach((user) => expect(isValidUserResponse(user)).toBeTruthy());
  });

  it('empty list', async () => {
    const { statusCode, body } = await request(app).get(`${BASE_PATH}/`).send();

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(0);
  });
});

describe('POST /', () => {
  it('create', async () => {
    const userPayload = { username: 'cris' };

    const { statusCode, body } = await request(app).post(`${BASE_PATH}/`).send(userPayload);

    expect(statusCode).toBe(HttpStatus.CREATED);
    expect(isValidUserResponse(body)).toBeTruthy();

    const { id, username } = body as UserResponse;
    expect(username).toBe(userPayload.username);
    expect(id).toBeDefined();
  });

  it('invalid dto', async () => {
    const userPayload = { user: 'cris' };

    const { statusCode, body } = await request(app).post(`${BASE_PATH}/`).send(userPayload);

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(isErrorResponse(body)).toBeTruthy();
  });

  it('duplicate username', async () => {
    const userPayload = { username: 'cris' };

    const { statusCode: statusCode1, body: body1 } = await request(app).post(`${BASE_PATH}/`).send(userPayload);

    expect(statusCode1).toBe(HttpStatus.CREATED);
    expect(isValidUserResponse(body1)).toBeTruthy();

    const { statusCode: statusCode2, body: body2 } = await request(app).post(`${BASE_PATH}/`).send(userPayload);

    expect(statusCode2).toBe(HttpStatus.CONFLICT);
    expect(isErrorResponse(body2)).toBeTruthy();
  });
});

describe('PUT /:id', () => {
  it('update', async () => {
    const createUserPayload = { username: 'cris' };
    const { id } = await createUser(createUserPayload);

    const createdUser = await findUserById(id);
    expect(createdUser).toMatchObject({ id, ...createUserPayload });

    const updateUserPayload = { username: 'cfres' };
    const { statusCode, body } = await request(app).put(`${BASE_PATH}/${id}`).send(updateUserPayload);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body).toMatchObject({ id, ...updateUserPayload });
  });

  it('not found', async () => {
    const updateUserPayload = { username: 'cfres' };
    const { statusCode, body } = await request(app).put(`${BASE_PATH}/${UNEXISTENT_ID}`).send(updateUserPayload);

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(isErrorResponse(body)).toBeTruthy();
  });

  it('invalid dto', async () => {
    const createUserPayload = { username: 'cris' };
    const { id } = await createUser(createUserPayload);

    const updateUserPayload = { user: 'cfres' };
    const { statusCode, body } = await request(app).put(`${BASE_PATH}/${id}`).send(updateUserPayload);

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(isErrorResponse(body)).toBeTruthy();
  });
});

describe('DELETE /:id', () => {
  it('delete', async () => {
    const userPayload = { username: 'cris' };
    const { id } = await createUser(userPayload);

    const createdUser = await findUserById(id);
    expect(createdUser).toMatchObject({ id, ...userPayload });

    const { statusCode, body } = await request(app).delete(`${BASE_PATH}/${id}`).send();

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body).toMatchObject({ id, ...userPayload });

    const user = await findUserById(id);
    expect(user).toBeNull();
  });

  it('not found', async () => {
    const { statusCode } = await request(app).delete(`${BASE_PATH}/${UNEXISTENT_ID}`).send();
    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
  });
});
