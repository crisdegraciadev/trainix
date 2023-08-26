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
import { createUser, deleteUser } from '../helpers/user';
import { createAdmin, cleanDatabase } from '../helpers/db';
import { INEXISTENT_ID, deleteRequest, getRequest, postRequest, putRequest } from '../helpers/request';
import { loginUser } from '../helpers/auth';

beforeAll(async () => {
  await createAdmin();
  await cleanDatabase({ all: false });
});

afterAll(async () => {
  await cleanDatabase({ all: true });
});

describe('WORKOUTS', () => {
  describe('GET /:id', () => {
    it('find by id', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const createWorkoutPayload = { name: 'Upper - Muscle Up', userId };
      const { id: workoutId } = await createWorkout(createWorkoutPayload);

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await getRequest({
        url: `${BASE_WORKOUT_PATH}/${workoutId}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(isValidWorkoutResponse(body)).toBeTruthy();

      await deleteWorkout(workoutId);
      await deleteUser(userId);
    });

    it('not found', async () => {
      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await getRequest({
        url: `${BASE_WORKOUT_PATH}/${INEXISTENT_ID}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });

  describe('GET /', () => {
    it('list with 3 elements', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const createWorkoutPayloads = [
        { name: 'Upper', userId: userId },
        { name: 'Lower', userId: userId },
        { name: 'Abs', userId: userId },
      ];

      const createdWorkouts = await Promise.all(createWorkoutPayloads.map(async (payload) => createWorkout(payload)));

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await getRequest({
        url: `${BASE_WORKOUT_PATH}/`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(3);

      const workouts = body as WorkoutResponse[];
      workouts.forEach((user) => expect(isValidWorkoutResponse(user)).toBeTruthy());

      await Promise.all(createdWorkouts.map(({ id }) => deleteWorkout(id)));
      await deleteUser(userId);
    });

    it('empty list', async () => {
      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await getRequest({
        url: `${BASE_WORKOUT_PATH}/`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(0);
    });
  });

  describe('POST /', () => {
    it('create', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const createWorkoutPayload = { name: 'Upper - Muscle Up', userId };

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await postRequest({
        url: `${BASE_WORKOUT_PATH}/`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
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
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const createWorkoutPayload = { userId };

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await postRequest({
        url: `${BASE_WORKOUT_PATH}/`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        dto: createWorkoutPayload,
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteUser(userId);
    });

    it('duplicate name', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const createWorkoutPayload = { name: 'Upper - Muscle Up', userId };

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode: statusCode1, body: body1 } = await postRequest({
        url: `${BASE_WORKOUT_PATH}/`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        dto: createWorkoutPayload,
      });

      expect(statusCode1).toBe(HttpStatus.CREATED);
      expect(isValidWorkoutResponse(body1)).toBeTruthy();

      const { statusCode: statusCode2, body: body2 } = await postRequest({
        url: `${BASE_WORKOUT_PATH}/`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
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
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const createWorkoutPayload = { name: 'Upper - Muscle Up', userId };
      const { id: workoutId } = await createWorkout(createWorkoutPayload);

      const createdWorkout = await findWorkoutById(workoutId);
      expect(createdWorkout).toMatchObject({ id: workoutId, ...createWorkoutPayload });

      const updateWorkoutPayload = { name: 'Upper - Front' };

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await putRequest({
        url: `${BASE_WORKOUT_PATH}/${workoutId}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        dto: updateWorkoutPayload,
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: workoutId, ...updateWorkoutPayload });

      await deleteWorkout(workoutId);
      await deleteUser(userId);
    });

    it('invalid dto', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const createWorkoutPayload = { name: 'Upper - Muscle Up', userId };
      const { id: workoutId } = await createWorkout(createWorkoutPayload);

      const updateWorkoutPayload = { username: 'Front' };

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await putRequest({
        url: `${BASE_WORKOUT_PATH}/${workoutId}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        dto: updateWorkoutPayload,
      });

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteWorkout(workoutId);
      await deleteUser(userId);
    });

    it('not found', async () => {
      const updateWorkoutPayload = { name: 'Upper - Muscle Up', userId: 99 };

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await putRequest({
        url: `${BASE_WORKOUT_PATH}/${INEXISTENT_ID}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        dto: updateWorkoutPayload,
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });

    it('duplicate', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const createWorkoutPayload1 = { name: 'Upper - Muscle Up', userId };
      const { id: workoutId1 } = await createWorkout(createWorkoutPayload1);

      const createWorkoutPayload2 = { name: 'Upper - Front', userId };
      const { id: workoutId2 } = await createWorkout(createWorkoutPayload2);

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await putRequest({
        url: `${BASE_WORKOUT_PATH}/${workoutId1}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
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
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const createWorkoutPayload = { name: 'Upper - Muscle Up', userId };
      const { id: workoutId } = await createWorkout(createWorkoutPayload);

      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await deleteRequest({
        url: `${BASE_WORKOUT_PATH}/${workoutId}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: workoutId, ...createWorkoutPayload });

      const workout = await findWorkoutById(workoutId);
      expect(workout).toBeNull();

      await deleteUser(userId);
    });

    it('not found', async () => {
      const ACCESS_TOKEN = await loginUser({ username: 'admin', password: 'admin' });

      const { statusCode, body } = await deleteRequest({
        url: `${BASE_WORKOUT_PATH}/${INEXISTENT_ID}`,
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });
});
