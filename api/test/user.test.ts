import request from 'supertest';

import app from '../src/app';
import { UserResponse, createUser, deleteAllUsers, isValidUserResponse } from './helpers';
import { isErrorResponse } from './helpers/error';

const BASE_PATH = '/users';

beforeAll(async () => {
  await deleteAllUsers();
});

afterEach(async () => {
  await deleteAllUsers();
});

describe('GET /:id', () => {
  it('find by id', async () => {
    const userPayload = { username: 'cris' };
    const { id } = await createUser(userPayload);

    const { statusCode, body } = await request(app).get(`${BASE_PATH}/${id}`).send();

    expect(statusCode).toBe(200);
    expect(isValidUserResponse(body)).toBeTruthy();
  });

  it('not found', async () => {
    const { statusCode, body } = await request(app).get(`${BASE_PATH}/648089326353a5207d03c209`).send();
    expect(statusCode).toBe(404);
    expect(isErrorResponse(body)).toBeTruthy();
  });
});

describe('GET /', () => {
  it('list with 3 users', async () => {
    const userPayloads = [{ username: 'cris' }, { username: 'mar' }, { username: 'alber' }];
    await Promise.all(userPayloads.map(async (payload) => createUser(payload)));

    const { statusCode, body } = await request(app).get(`${BASE_PATH}/`).send();

    expect(statusCode).toBe(200);
    expect(body.length).toBe(3);

    const users = body as UserResponse[];
    users.forEach((user) => expect(isValidUserResponse(user)).toBeTruthy());
  });

  it('empty list', async () => {
    const { statusCode, body } = await request(app).get(`${BASE_PATH}/`).send();

    expect(statusCode).toBe(200);
    expect(body.length).toBe(0);
  });
});

describe('POST /', () => {
  it('create a user', async () => {
    const userPayload = { username: 'cris' };

    const { statusCode, body } = await request(app).post(`${BASE_PATH}/`).send(userPayload);

    expect(statusCode).toBe(201);
    expect(isValidUserResponse(body)).toBeTruthy();

    const { id, username } = body as UserResponse;
    expect(username).toBe(userPayload.username);
    expect(id).toBeDefined();
  });

  it('invalid dto', async () => {
    const userPayload = { user: 'cris' };

    const { statusCode, body } = await request(app).post(`${BASE_PATH}/`).send(userPayload);

    expect(statusCode).toBe(400);
    expect(isErrorResponse(body)).toBeTruthy();
  });

  it('duplicate username', async () => {
    const userPayload = { username: 'cris' };

    const { statusCode: statusCode1, body: body1 } = await request(app).post(`${BASE_PATH}/`).send(userPayload);

    expect(statusCode1).toBe(201);
    expect(isValidUserResponse(body1)).toBeTruthy();

    const { statusCode: statusCode2, body: body2 } = await request(app).post(`${BASE_PATH}/`).send(userPayload);

    expect(statusCode2).toBe(409);
    expect(isErrorResponse(body2)).toBeTruthy();
  });
});
