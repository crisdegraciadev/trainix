import {
  BASE_ACTIVITY_PATH,
  insertActivity,
  deleteActivity,
  isValidActivityResponse,
  ActivityResponse,
  retrieveActivity,
} from '../helpers/activity';
import { HttpStatus } from '../../../src/consts';
import { isErrorResponse } from '../helpers/error';
import { cleanDatabase } from '../helpers/db';
import { INEXISTENT_ID, deleteRequest, getRequest, postRequest, putRequest } from '../helpers/request';
import { loginUser } from '../helpers/auth';
import { insertAdminUser } from '../helpers/user';
import { ACTIVITY_EASY, ACTIVITY_HARD, ACTIVITY_MEDIUM } from '../fixtures/activities';
import { ADMIN_CREDENTIALS } from '../fixtures/auth';
import { deleteExercise, insertExercise } from '../helpers/exercise';
import { EXERCISE_PULL_UP, EXERCISE_PUSH_UP } from '../fixtures/exercise';

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
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { id: exerciseId } = await insertExercise(EXERCISE_PUSH_UP, ACCESS_TOKEN_COOKIE);
      const { id: activityId } = await insertActivity({ ...ACTIVITY_EASY, exerciseId }, ACCESS_TOKEN_COOKIE);

      const { statusCode, body } = await getRequest({
        url: `${BASE_ACTIVITY_PATH}/${activityId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(isValidActivityResponse(body)).toBeTruthy();

      await deleteActivity(activityId, ACCESS_TOKEN_COOKIE);
      await deleteExercise(exerciseId, ACCESS_TOKEN_COOKIE);
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
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { id: exerciseId } = await insertExercise(EXERCISE_PUSH_UP, ACCESS_TOKEN_COOKIE);
      const createActivityPayloads = [
        { ...ACTIVITY_EASY, exerciseId },
        { ...ACTIVITY_MEDIUM, exerciseId },
        { ...ACTIVITY_HARD, exerciseId },
      ];

      const createdActivities = await Promise.all(
        createActivityPayloads.map(async (payload) => insertActivity(payload, ACCESS_TOKEN_COOKIE))
      );

      const { statusCode, body } = await getRequest({
        url: `${BASE_ACTIVITY_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(3);

      const activities = body as ActivityResponse[];
      activities.forEach((exercise) => expect(isValidActivityResponse(exercise)).toBeTruthy());

      await Promise.all(createdActivities.map(({ id }) => deleteActivity(id, ACCESS_TOKEN_COOKIE)));
      await deleteExercise(exerciseId, ACCESS_TOKEN_COOKIE);
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
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { id: exerciseId } = await insertExercise(EXERCISE_PUSH_UP, ACCESS_TOKEN_COOKIE);
      const createActivityPayload = { ...ACTIVITY_EASY, exerciseId };

      const { statusCode, body } = await postRequest({
        url: `${BASE_ACTIVITY_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: createActivityPayload,
      });

      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(isValidActivityResponse(body)).toBeTruthy();

      const { id: activityId, exercise } = body as ActivityResponse;

      expect(activityId).toBeDefined();
      expect(body).toMatchObject({ ...createActivityPayload });

      const { id: linkedExerciseId, name, description } = exercise;

      expect(linkedExerciseId).toBeDefined();
      expect(linkedExerciseId).toBe(exerciseId);
      expect(name).toBeDefined();
      expect(description).toBeDefined();

      await deleteActivity(activityId, ACCESS_TOKEN_COOKIE);
      await deleteExercise(exerciseId, ACCESS_TOKEN_COOKIE);
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
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { id: exercisePushUpId } = await insertExercise(EXERCISE_PUSH_UP, ACCESS_TOKEN_COOKIE);
      const { id: exercisePullUpId } = await insertExercise(EXERCISE_PULL_UP, ACCESS_TOKEN_COOKIE);

      const createActivityPayload = { ...ACTIVITY_EASY, exerciseId: exercisePushUpId };
      const { id: activityId } = await insertActivity(createActivityPayload, ACCESS_TOKEN_COOKIE);

      const createdActivity = await retrieveActivity(activityId);
      expect(createdActivity).toMatchObject({ id: activityId, ...createActivityPayload });

      const updateActivityPayload = { reps: 1, sets: 9, exerciseId: exercisePullUpId };

      const { statusCode, body } = await putRequest({
        url: `${BASE_ACTIVITY_PATH}/${activityId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: updateActivityPayload,
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: activityId, ...updateActivityPayload });

      await deleteActivity(activityId, ACCESS_TOKEN_COOKIE);
      await deleteExercise(exercisePushUpId, ACCESS_TOKEN_COOKIE);
      await deleteExercise(exercisePullUpId, ACCESS_TOKEN_COOKIE);
    });

    it('invalid dto', async () => {
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const createActivityPayload = { ...ACTIVITY_EASY };
      const { id: activityId } = await insertActivity(createActivityPayload, ACCESS_TOKEN_COOKIE);

      const updateActivityPayload = { rep: 4, set: 4 };

      const { statusCode, body } = await putRequest({
        url: `${BASE_ACTIVITY_PATH}/${activityId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: updateActivityPayload,
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteActivity(activityId, ACCESS_TOKEN_COOKIE);
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
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { id: exerciseId } = await insertExercise(EXERCISE_PUSH_UP, ACCESS_TOKEN_COOKIE);

      const createActivityPayload = { ...ACTIVITY_HARD, exerciseId };
      const { id: activityId } = await insertActivity(createActivityPayload, ACCESS_TOKEN_COOKIE);

      const updateActivityPayload = { reps: 8, sets: 3, exerciseId: INEXISTENT_ID };

      const { statusCode, body } = await putRequest({
        url: `${BASE_ACTIVITY_PATH}/${activityId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: updateActivityPayload,
      });

      expect(statusCode).toBe(HttpStatus.CONFLICT);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteActivity(activityId, ACCESS_TOKEN_COOKIE);
      await deleteExercise(exerciseId, ACCESS_TOKEN_COOKIE);
    });
  });

  describe('DELETE /:id', () => {
    it('delete', async () => {
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { id: exerciseId } = await insertExercise(EXERCISE_PUSH_UP, ACCESS_TOKEN_COOKIE);

      const createActivityPayload = { ...ACTIVITY_EASY, exerciseId };
      const { id: activityId } = await insertActivity(createActivityPayload, ACCESS_TOKEN_COOKIE);

      const { statusCode, body } = await deleteRequest({
        url: `${BASE_ACTIVITY_PATH}/${activityId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: activityId, ...createActivityPayload });

      const activity = await retrieveActivity(activityId);
      expect(activity).toBeNull();

      await deleteExercise(exerciseId, ACCESS_TOKEN_COOKIE);
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
