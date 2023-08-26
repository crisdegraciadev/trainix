import {
  ActivityResponse,
  BASE_ACTIVITY_PATH,
  createActivity,
  deleteActivity,
  findActivityById,
  isValidActivityResponse,
} from '../helpers/activity';
import { HttpStatus } from '../../../src/consts';
import { isErrorResponse } from '../helpers/error';
import { cleanDatabase, createAdmin } from '../helpers/db';
import { INEXISTENT_ID, deleteRequest, getRequest, postRequest, putRequest } from '../helpers/request';
import { loginUser } from '../helpers/auth';

beforeAll(async () => {
  await createAdmin();
  await cleanDatabase({ all: false });
});

afterAll(async () => {
  await cleanDatabase({ all: true });
});

describe('ACTIVITIES', () => {
  describe('GET /:id', () => {
    it('find by id', async () => {
      const createActivityPayload = { reps: 8, sets: 4, exerciseId: 1 };
      const { id: activityId } = await createActivity(createActivityPayload);

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await getRequest({
        url: `${BASE_ACTIVITY_PATH}/${activityId}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(isValidActivityResponse(body)).toBeTruthy();

      await deleteActivity(activityId);
    });

    it('not found', async () => {
      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await getRequest({
        url: `${BASE_ACTIVITY_PATH}/${INEXISTENT_ID}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });

  describe('GET /', () => {
    it('list with 3 elements', async () => {
      const createActivityPayloads = [
        { reps: 8, sets: 4, exerciseId: 1 },
        { reps: 3, sets: 1, exerciseId: 1 },
        { reps: 1, sets: 8, exerciseId: 1 },
      ];

      const createdActivities = await Promise.all(
        createActivityPayloads.map(async (payload) => createActivity(payload))
      );

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await getRequest({
        url: `${BASE_ACTIVITY_PATH}/`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(3);

      const activities = body as ActivityResponse[];
      activities.forEach((user) => expect(isValidActivityResponse(user)).toBeTruthy());

      await Promise.all(createdActivities.map(({ id }) => deleteActivity(id)));
    });

    it('empty list', async () => {
      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await getRequest({
        url: `${BASE_ACTIVITY_PATH}/`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(0);
    });
  });

  describe('POST /', () => {
    it('create', async () => {
      const createActivityPayload = { reps: 8, sets: 4, exerciseId: 1 };

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await postRequest({
        url: `${BASE_ACTIVITY_PATH}/`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        dto: createActivityPayload,
      });

      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(isValidActivityResponse(body)).toBeTruthy();

      const { id, exercise } = body as ActivityResponse;

      expect(id).toBeDefined();
      expect(body).toMatchObject({ ...createActivityPayload });

      const { id: exerciseId, name, description } = exercise;

      expect(exerciseId).toBeDefined();
      expect(name).toBeDefined();
      expect(description).toBeDefined();

      await deleteActivity(id);
    });

    it('invalid dto', async () => {
      const createActivityPayload = { rep: 8, sets: 4 };

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await postRequest({
        url: `${BASE_ACTIVITY_PATH}/`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        dto: createActivityPayload,
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();
    });

    it('invalid relation', async () => {
      const createActivityPayload = { reps: 8, sets: 4, exerciseId: INEXISTENT_ID };

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await postRequest({
        url: `${BASE_ACTIVITY_PATH}/`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        dto: createActivityPayload,
      });

      expect(statusCode).toBe(HttpStatus.CONFLICT);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });

  describe('PUT /:id', () => {
    it('update', async () => {
      const createActivityPayload = { reps: 8, sets: 4, exerciseId: 1 };
      const { id: activityId } = await createActivity(createActivityPayload);

      const createdActivity = await findActivityById(activityId);
      expect(createdActivity).toMatchObject({ id: activityId, ...createActivityPayload });

      const updateActivityPayload = { reps: 1, sets: 9, exerciseId: 2 };

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await putRequest({
        url: `${BASE_ACTIVITY_PATH}/${activityId}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        dto: updateActivityPayload,
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: activityId, ...updateActivityPayload });

      await deleteActivity(activityId);
    });

    it('invalid dto', async () => {
      const createActivityPayload = { reps: 8, sets: 4, exerciseId: 1 };
      const { id: activityId } = await createActivity(createActivityPayload);

      const updateActivityPayload = { rep: 4, set: 4 };

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await putRequest({
        url: `${BASE_ACTIVITY_PATH}/${activityId}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        dto: updateActivityPayload,
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteActivity(activityId);
    });

    it('not found', async () => {
      const updateActivityPayload = { reps: 8, sets: 4, exerciseId: 1 };

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await putRequest({
        url: `${BASE_ACTIVITY_PATH}/${INEXISTENT_ID}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        dto: updateActivityPayload,
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });

    it('invalid relation', async () => {
      const createActivityPayload = { reps: 8, sets: 4, exerciseId: 1 };
      const { id: activityId } = await createActivity(createActivityPayload);

      const updateActivityPayload = { reps: 8, sets: 3, exerciseId: INEXISTENT_ID };

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await putRequest({
        url: `${BASE_ACTIVITY_PATH}/${activityId}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        dto: updateActivityPayload,
      });

      expect(statusCode).toBe(HttpStatus.CONFLICT);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });

  describe('DELETE /:id', () => {
    it('delete', async () => {
      const createActivityPayload = { reps: 8, sets: 4, exerciseId: 1 };
      const { id: activityId } = await createActivity(createActivityPayload);

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await deleteRequest({
        url: `${BASE_ACTIVITY_PATH}/${activityId}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: activityId, ...createActivityPayload });

      const activity = await findActivityById(activityId);
      expect(activity).toBeNull();
    });

    it('not found', async () => {
      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await deleteRequest({
        url: `${BASE_ACTIVITY_PATH}/${INEXISTENT_ID}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });
});
