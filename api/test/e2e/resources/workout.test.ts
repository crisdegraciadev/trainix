import request from 'supertest';
import { HttpStatus } from '../../../src/consts';
import { INEXISTENT_ID, cleanDatabase, createUser, deleteUser, isErrorResponse } from '../helpers';
import {
  BASE_WORKOUT_PATH,
  WorkoutResponse,
  createWorkout,
  deleteWorkout,
  findWorkoutById,
  isValidWorkoutResponse,
} from '../helpers/workout';
import app from '../../../src/app';

beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
});

describe('WORKOUTS', () => {
  describe('GET /:id', () => {
    it('find by id', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const createWorkoutPayload = { name: 'Upper - Muscle Up', userId };
      const { id: workoutId } = await createWorkout(createWorkoutPayload);

      const { statusCode, body } = await request(app).get(`${BASE_WORKOUT_PATH}/${workoutId}`).send();

      expect(statusCode).toBe(HttpStatus.OK);
      expect(isValidWorkoutResponse(body)).toBeTruthy();

      await deleteWorkout(workoutId);
      await deleteUser(userId);
    });

    it('not found', async () => {
      const { statusCode, body } = await request(app).get(`${BASE_WORKOUT_PATH}/${INEXISTENT_ID}`).send();
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

      const { statusCode, body } = await request(app).get(`${BASE_WORKOUT_PATH}/`).send();

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(3);

      const workouts = body as WorkoutResponse[];
      workouts.forEach((user) => expect(isValidWorkoutResponse(user)).toBeTruthy());

      await Promise.all(createdWorkouts.map(({ id }) => deleteWorkout(id)));
      await deleteUser(userId);
    });

    it('empty list', async () => {
      const { statusCode, body } = await request(app).get(`${BASE_WORKOUT_PATH}/`).send();

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(0);
    });
  });

  describe('POST /', () => {
    it('create', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const createWorkoutPayload = { name: 'Upper - Muscle Up', userId };
      const { statusCode, body } = await request(app).post(`${BASE_WORKOUT_PATH}/`).send(createWorkoutPayload);

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

      const { statusCode, body } = await request(app).post(`${BASE_WORKOUT_PATH}/`).send(createWorkoutPayload);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteUser(userId);
    });

    it('duplicate name', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { id: userId } = await createUser(createUserPayload);

      const createWorkoutPayload = { name: 'Upper - Muscle Up', userId };

      const { statusCode: statusCode1, body: body1 } = await request(app)
        .post(`${BASE_WORKOUT_PATH}/`)
        .send(createWorkoutPayload);

      expect(statusCode1).toBe(HttpStatus.CREATED);
      expect(isValidWorkoutResponse(body1)).toBeTruthy();

      const { statusCode: statusCode2, body: body2 } = await request(app)
        .post(`${BASE_WORKOUT_PATH}/`)
        .send(createWorkoutPayload);

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
      const { statusCode, body } = await request(app)
        .put(`${BASE_WORKOUT_PATH}/${workoutId}`)
        .send(updateWorkoutPayload);

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

      const { statusCode, body } = await request(app)
        .put(`${BASE_WORKOUT_PATH}/${workoutId}`)
        .send(updateWorkoutPayload);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteWorkout(workoutId);
      await deleteUser(userId);
    });

    it('not found', async () => {
      const updateWorkoutPayload = { name: 'Upper - Muscle Up', userId: INEXISTENT_ID };
      const { statusCode, body } = await request(app)
        .put(`${BASE_WORKOUT_PATH}/${INEXISTENT_ID}`)
        .send(updateWorkoutPayload);

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

      const { statusCode, body } = await request(app)
        .put(`${BASE_WORKOUT_PATH}/${workoutId1}`)
        .send(createWorkoutPayload2);

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

      const { statusCode, body } = await request(app).delete(`${BASE_WORKOUT_PATH}/${workoutId}`).send();

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: workoutId, ...createWorkoutPayload });

      const workout = await findWorkoutById(workoutId);
      expect(workout).toBeNull();

      await deleteUser(userId);
    });

    it('not found', async () => {
      const { statusCode } = await request(app).delete(`${BASE_WORKOUT_PATH}/${INEXISTENT_ID}`).send();
      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
