import {
  ActivityResponse,
  BASE_ACTIVITY_PATH,
  insertActivity,
  deleteActivity,
  retrieveActivity,
  isValidActivityResponse,
} from '../helpers/activity';
import { HttpStatus } from '../../../src/consts';
import { isErrorResponse } from '../helpers/error';
import { cleanDatabase } from '../helpers/db';
import { INEXISTENT_ID, deleteRequest, getRequest, postRequest, putRequest } from '../helpers/request';
import { loginUser } from '../helpers/auth';
import { insertAdminUser } from '../helpers/user';
import { ACTIVITY_EASY, ACTIVITY_HARD, ACTIVITY_MEDIUM } from '../fixtures/activities';
import { ADMIN_CREDENTIALS } from '../fixtures/auth';

beforeAll(async () => {
  await insertAdminUser();
  await cleanDatabase({ all: false });
});

afterAll(async () => {
  await cleanDatabase({ all: true });
});

describe('ACTIVITIES', () => {
  describe('GET /:id', () => {
    it('find by id', async () => {
      const { id: activityId } = await insertActivity(ACTIVITY_EASY);

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_ACTIVITY_PATH}/${activityId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(isValidActivityResponse(body)).toBeTruthy();

      await deleteActivity(activityId);
    });

    it('not found', async () => {
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_ACTIVITY_PATH}/${INEXISTENT_ID}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });

  describe('GET /', () => {
    it('list with 3 elements', async () => {
      const createActivityPayloads = [ACTIVITY_EASY, ACTIVITY_MEDIUM, ACTIVITY_HARD];

      const createdActivities = await Promise.all(
        createActivityPayloads.map(async (payload) => insertActivity(payload))
      );

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_ACTIVITY_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(3);

      const activities = body as ActivityResponse[];
      activities.forEach((exercise) => expect(isValidActivityResponse(exercise)).toBeTruthy());

      await Promise.all(createdActivities.map(({ id }) => deleteActivity(id)));
    });

    it('empty list', async () => {
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_ACTIVITY_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(0);
    });
  });

  describe('POST /', () => {
    it('create', async () => {
      const createActivityPayload = { ...ACTIVITY_EASY };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await postRequest({
        url: `${BASE_ACTIVITY_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
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

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await postRequest({
        url: `${BASE_ACTIVITY_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: createActivityPayload,
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();
    });

    it('invalid relation', async () => {
      const createActivityPayload = { ...ACTIVITY_MEDIUM, exerciseId: INEXISTENT_ID };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await postRequest({
        url: `${BASE_ACTIVITY_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: createActivityPayload,
      });

      expect(statusCode).toBe(HttpStatus.CONFLICT);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });

  describe('PUT /:id', () => {
    it('update', async () => {
      const createActivityPayload = { ...ACTIVITY_EASY };
      const { id: activityId } = await insertActivity(createActivityPayload);

      const createdActivity = await retrieveActivity(activityId);
      expect(createdActivity).toMatchObject({ id: activityId, ...createActivityPayload });

      const updateActivityPayload = { reps: 1, sets: 9, exerciseId: 2 };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await putRequest({
        url: `${BASE_ACTIVITY_PATH}/${activityId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: updateActivityPayload,
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: activityId, ...updateActivityPayload });

      await deleteActivity(activityId);
    });

    it('invalid dto', async () => {
      const createActivityPayload = { ...ACTIVITY_EASY };
      const { id: activityId } = await insertActivity(createActivityPayload);

      const updateActivityPayload = { rep: 4, set: 4 };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await putRequest({
        url: `${BASE_ACTIVITY_PATH}/${activityId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: updateActivityPayload,
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteActivity(activityId);
    });

    it('not found', async () => {
      const updateActivityPayload = { ...ACTIVITY_EASY };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await putRequest({
        url: `${BASE_ACTIVITY_PATH}/${INEXISTENT_ID}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: updateActivityPayload,
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });

    it('invalid relation', async () => {
      const createActivityPayload = { ...ACTIVITY_HARD };
      const { id: activityId } = await insertActivity(createActivityPayload);

      const updateActivityPayload = { reps: 8, sets: 3, exerciseId: INEXISTENT_ID };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await putRequest({
        url: `${BASE_ACTIVITY_PATH}/${activityId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: updateActivityPayload,
      });

      expect(statusCode).toBe(HttpStatus.CONFLICT);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });

  describe('DELETE /:id', () => {
    it('delete', async () => {
      const createActivityPayload = { ...ACTIVITY_EASY };
      const { id: activityId } = await insertActivity(createActivityPayload);

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await deleteRequest({
        url: `${BASE_ACTIVITY_PATH}/${activityId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: activityId, ...createActivityPayload });

      const activity = await retrieveActivity(activityId);
      expect(activity).toBeNull();
    });

    it('not found', async () => {
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await deleteRequest({
        url: `${BASE_ACTIVITY_PATH}/${INEXISTENT_ID}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });
});
