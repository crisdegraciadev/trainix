import { HttpStatus } from '../../../src/consts';
import { isErrorResponse } from '../helpers/error';
import { cleanDatabase } from '../helpers/db';
import { INEXISTENT_ID, deleteRequest, getRequest, postRequest, putRequest } from '../helpers/request';
import { loginUser } from '../helpers/auth';
import { insertAdminUser } from '../helpers/user';
import { ADMIN_CREDENTIALS } from '../fixtures/auth';
import {
  BASE_EXERCISE_PATH,
  ExerciseResponse,
  deleteExercise,
  insertExercise,
  isValidExerciseResponse,
  retrieveExercise,
} from '../helpers/exercise';
import { EXERCISE_PULL_UP, EXERCISE_PUSH_UP, EXERCISE_SQUAT } from '../fixtures/exercise';

beforeAll(async () => {
  await insertAdminUser();
  await cleanDatabase({ all: false });
});

afterAll(async () => {
  await cleanDatabase({ all: true });
});

describe('EXERCISES', () => {
  describe('GET /:id', () => {
    it('retrieve', async () => {
      const { id: exerciseId } = await insertExercise(EXERCISE_PUSH_UP);

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_EXERCISE_PATH}/${exerciseId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(isValidExerciseResponse(body)).toBeTruthy();

      await deleteExercise(exerciseId, ACCESS_TOKEN_COOKIE);
    });

    it('not found', async () => {
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_EXERCISE_PATH}/${INEXISTENT_ID}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });

  describe('GET /', () => {
    it('list with 3 elements', async () => {
      const createExercisePayloads = [EXERCISE_PUSH_UP, EXERCISE_PULL_UP, EXERCISE_SQUAT];

      const createdExercises = await Promise.all(
        createExercisePayloads.map(async (payload) => insertExercise(payload))
      );

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_EXERCISE_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(3);

      const exercises = body as ExerciseResponse[];
      exercises.forEach((exercise) => expect(isValidExerciseResponse(exercise)).toBeTruthy());

      await Promise.all(createdExercises.map(({ id }) => deleteExercise(id, ACCESS_TOKEN_COOKIE)));
    });

    it('empty list', async () => {
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_EXERCISE_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(0);
    });

    it.todo('filter with params');
  });

  describe('POST /', () => {
    it('create', async () => {
      const createExercisePayload = { ...EXERCISE_PUSH_UP };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await postRequest({
        url: `${BASE_EXERCISE_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: createExercisePayload,
      });

      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(isValidExerciseResponse(body)).toBeTruthy();

      const { id } = body as ExerciseResponse;

      expect(id).toBeDefined();
      expect(body).toMatchObject({ ...createExercisePayload });

      await deleteExercise(id, ACCESS_TOKEN_COOKIE);
    });

    it('invalid dto', async () => {
      const createExercisePayload = { a: 8, name: 'Push Up' };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await postRequest({
        url: `${BASE_EXERCISE_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: createExercisePayload,
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });

  describe('PUT /:id', () => {
    it('update', async () => {
      const createExercisePayload = { ...EXERCISE_PULL_UP };
      const { id: exerciseId } = await insertExercise(createExercisePayload);

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const createdExercise = await retrieveExercise(exerciseId, ACCESS_TOKEN_COOKIE);
      expect(createdExercise).toMatchObject({ id: exerciseId, ...createExercisePayload });

      const updateExercisePayload = { ...EXERCISE_PUSH_UP };

      const { statusCode, body } = await putRequest({
        url: `${BASE_EXERCISE_PATH}/${exerciseId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: updateExercisePayload,
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: exerciseId, ...updateExercisePayload });

      await deleteExercise(exerciseId, ACCESS_TOKEN_COOKIE);
    });

    it('invalid dto', async () => {
      const createExercisePayload = { ...EXERCISE_PULL_UP };
      const { id: exerciseId } = await insertExercise(createExercisePayload);

      const updateExercisePayload = { a: 4, b: 4 };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await putRequest({
        url: `${BASE_EXERCISE_PATH}/${exerciseId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: updateExercisePayload,
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteExercise(exerciseId, ACCESS_TOKEN_COOKIE);
    });

    it('not found', async () => {
      const updateExercisePayload = { ...EXERCISE_SQUAT };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await putRequest({
        url: `${BASE_EXERCISE_PATH}/${INEXISTENT_ID}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: updateExercisePayload,
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });

  describe('DELETE /:id', () => {
    it('delete', async () => {
      const createExercisePayload = { ...EXERCISE_PULL_UP };
      const { id: exerciseId } = await insertExercise(createExercisePayload);

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await deleteRequest({
        url: `${BASE_EXERCISE_PATH}/${exerciseId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: exerciseId, ...createExercisePayload });

      const exerciseNotFound = await retrieveExercise(exerciseId, ACCESS_TOKEN_COOKIE);
      expect(isErrorResponse(exerciseNotFound)).toBeTruthy();
    });

    it('not found', async () => {
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await deleteRequest({
        url: `${BASE_EXERCISE_PATH}/${INEXISTENT_ID}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });
});
