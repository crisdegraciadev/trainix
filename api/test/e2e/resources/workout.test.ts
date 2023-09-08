import { HttpStatus } from '../../../src/consts';
import {
  BASE_WORKOUT_PATH,
  WorkoutResponse,
  createWorkout,
  deleteWorkout,
  findWorkoutById,
  isValidWorkoutResponse,
} from '../helpers/workout';
import { isErrorResponse } from '../helpers/error';
import { insertAdminUser, insertUser, deleteUser } from '../helpers/user';
import { cleanDatabase } from '../helpers/db';
import { INEXISTENT_ID, deleteRequest, getRequest, postRequest, putRequest } from '../helpers/request';
import { loginUser } from '../helpers/auth';
import { CREATE_USER_CRIS_PAYLOAD } from '../fixtures/users';
import { WORKOUT_ABS, WORKOUT_LEGS, WORKOUT_MUSCLE_UP } from '../fixtures/workouts';
import { ADMIN_CREDENTIALS } from '../fixtures/auth';

beforeAll(async () => {
  await insertAdminUser();
  await cleanDatabase({ all: false });
});

afterAll(async () => {
  await cleanDatabase({ all: true });
});

describe('WORKOUTS', () => {
  describe('GET /:id', () => {
    it('find by id', async () => {
      const { id: userId } = await insertUser(CREATE_USER_CRIS_PAYLOAD);

      const createWorkoutPayload = { ...WORKOUT_MUSCLE_UP, userId };
      const { id: workoutId } = await createWorkout(createWorkoutPayload);

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_WORKOUT_PATH}/${workoutId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(isValidWorkoutResponse(body)).toBeTruthy();

      await deleteWorkout(workoutId);
      await deleteUser(userId);
    });

    it('not found', async () => {
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_WORKOUT_PATH}/${INEXISTENT_ID}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });

  describe('GET /', () => {
    it('list with 3 elements', async () => {
      const { id: userId } = await insertUser(CREATE_USER_CRIS_PAYLOAD);

      const createWorkoutPayloads = [
        { ...WORKOUT_MUSCLE_UP, userId },
        { ...WORKOUT_ABS, userId },
        { ...WORKOUT_LEGS, userId },
      ];

      const createdWorkouts = await Promise.all(createWorkoutPayloads.map(async (payload) => createWorkout(payload)));

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_WORKOUT_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(3);

      const workouts = body as WorkoutResponse[];
      workouts.forEach((user) => expect(isValidWorkoutResponse(user)).toBeTruthy());

      await Promise.all(createdWorkouts.map(({ id }) => deleteWorkout(id)));
      await deleteUser(userId);
    });

    it('empty list', async () => {
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await getRequest({
        url: `${BASE_WORKOUT_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(0);
    });
  });

  describe('POST /', () => {
    it('create', async () => {
      const { id: userId } = await insertUser(CREATE_USER_CRIS_PAYLOAD);

      const createWorkoutPayload = { ...WORKOUT_MUSCLE_UP, userId };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await postRequest({
        url: `${BASE_WORKOUT_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: createWorkoutPayload,
      });

      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(isValidWorkoutResponse(body)).toBeTruthy();

      const { id } = body as WorkoutResponse;
      expect(id).toBeDefined();
      expect(body).toMatchObject({ id, ...createWorkoutPayload });

      await deleteWorkout(id);
      await deleteUser(userId);
    });

    it('invalid dto', async () => {
      const { id: userId } = await insertUser(CREATE_USER_CRIS_PAYLOAD);

      const createWorkoutPayload = { userId };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await postRequest({
        url: `${BASE_WORKOUT_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: createWorkoutPayload,
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteUser(userId);
    });

    it('duplicate name', async () => {
      const { id: userId } = await insertUser(CREATE_USER_CRIS_PAYLOAD);

      const createWorkoutPayload = { ...WORKOUT_MUSCLE_UP, userId };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode: statusCode1, body: body1 } = await postRequest({
        url: `${BASE_WORKOUT_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: createWorkoutPayload,
      });

      expect(statusCode1).toBe(HttpStatus.CREATED);
      expect(isValidWorkoutResponse(body1)).toBeTruthy();

      const { statusCode: statusCode2, body: body2 } = await postRequest({
        url: `${BASE_WORKOUT_PATH}/`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: createWorkoutPayload,
      });

      expect(statusCode2).toBe(HttpStatus.CONFLICT);
      expect(isErrorResponse(body2)).toBeTruthy();

      await deleteWorkout(body1.id);
      await deleteUser(userId);
    });
  });

  describe('PUT /:id', () => {
    it('update', async () => {
      const { id: userId } = await insertUser(CREATE_USER_CRIS_PAYLOAD);

      const createWorkoutPayload = { ...WORKOUT_MUSCLE_UP, userId };
      const { id: workoutId } = await createWorkout(createWorkoutPayload);

      const createdWorkout = await findWorkoutById(workoutId);
      expect(createdWorkout).toMatchObject({ id: workoutId, ...createWorkoutPayload });

      const updateWorkoutPayload = { ...WORKOUT_ABS };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await putRequest({
        url: `${BASE_WORKOUT_PATH}/${workoutId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: updateWorkoutPayload,
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: workoutId, ...updateWorkoutPayload });

      await deleteWorkout(workoutId);
      await deleteUser(userId);
    });

    it('invalid dto', async () => {
      const { id: userId } = await insertUser(CREATE_USER_CRIS_PAYLOAD);

      const createWorkoutPayload = { ...WORKOUT_MUSCLE_UP, userId };
      const { id: workoutId } = await createWorkout(createWorkoutPayload);

      const updateWorkoutPayload = { username: 'Front' };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await putRequest({
        url: `${BASE_WORKOUT_PATH}/${workoutId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: updateWorkoutPayload,
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteWorkout(workoutId);
      await deleteUser(userId);
    });

    it('not found', async () => {
      const updateWorkoutPayload = { ...WORKOUT_MUSCLE_UP, userId: 99 };

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await putRequest({
        url: `${BASE_WORKOUT_PATH}/${INEXISTENT_ID}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: updateWorkoutPayload,
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });

    it('duplicate', async () => {
      const { id: userId } = await insertUser(CREATE_USER_CRIS_PAYLOAD);

      const createWorkoutPayload1 = { ...WORKOUT_MUSCLE_UP, userId };
      const { id: workoutId1 } = await createWorkout(createWorkoutPayload1);

      const createWorkoutPayload2 = { ...WORKOUT_LEGS, userId };
      const { id: workoutId2 } = await createWorkout(createWorkoutPayload2);

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await putRequest({
        url: `${BASE_WORKOUT_PATH}/${workoutId1}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
        dto: createWorkoutPayload2,
      });

      expect(statusCode).toBe(HttpStatus.CONFLICT);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteWorkout(workoutId1);
      await deleteWorkout(workoutId2);
      await deleteUser(userId);
    });
  });

  describe('DELETE /:id', () => {
    it('delete', async () => {
      const { id: userId } = await insertUser(CREATE_USER_CRIS_PAYLOAD);

      const createWorkoutPayload = { ...WORKOUT_MUSCLE_UP, userId };
      const { id: workoutId } = await createWorkout(createWorkoutPayload);

      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await deleteRequest({
        url: `${BASE_WORKOUT_PATH}/${workoutId}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: workoutId, ...createWorkoutPayload });

      const workout = await findWorkoutById(workoutId);
      expect(workout).toBeNull();

      await deleteUser(userId);
    });

    it('not found', async () => {
      const ACCESS_TOKEN_COOKIE = await loginUser(ADMIN_CREDENTIALS);

      const { statusCode, body } = await deleteRequest({
        url: `${BASE_WORKOUT_PATH}/${INEXISTENT_ID}`,
        headers: { Cookie: ACCESS_TOKEN_COOKIE },
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });
});
