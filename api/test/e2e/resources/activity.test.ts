import request from 'supertest';

import app from '../../../src/app';

import { UNEXISTENT_ID, cleanDatabase, isErrorResponse } from '../helpers';
import {
  ActivityResponse,
  BASE_ACTIVITY_PATH,
  createActivity,
  deleteActivity,
  findActivityById,
  isValidActivityResponse,
} from '../helpers/activity';
import { HttpStatus } from '../../../src/consts';

beforeAll(async () => {
  await cleanDatabase();
});

describe('ACTIVITIES', () => {
  describe('GET /:id', () => {
    it('find by id', async () => {
      const createActivityPayload = { reps: 8, sets: 4, exerciseId: 1 };
      const { id: activityId } = await createActivity(createActivityPayload);

      const { statusCode, body } = await request(app).get(`${BASE_ACTIVITY_PATH}/${activityId}`).send();

      expect(statusCode).toBe(HttpStatus.OK);
      expect(isValidActivityResponse(body)).toBeTruthy();

      await deleteActivity(activityId);
    });

    it('not found', async () => {
      const { statusCode, body } = await request(app).get(`${BASE_ACTIVITY_PATH}/${UNEXISTENT_ID}`).send();
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

      const { statusCode, body } = await request(app).get(`${BASE_ACTIVITY_PATH}/`).send();

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(3);

      const activities = body as ActivityResponse[];
      activities.forEach((user) => expect(isValidActivityResponse(user)).toBeTruthy());

      await Promise.all(createdActivities.map(({ id }) => deleteActivity(id)));
    });

    it('empty list', async () => {
      const { statusCode, body } = await request(app).get(`${BASE_ACTIVITY_PATH}/`).send();

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.length).toBe(0);
    });
  });

  describe('POST /', () => {
    it('create', async () => {
      const createActivityPayload = { reps: 8, sets: 4, exerciseId: 1 };

      const { statusCode, body } = await request(app).post(`${BASE_ACTIVITY_PATH}/`).send(createActivityPayload);

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

      const { statusCode, body } = await request(app).post(`${BASE_ACTIVITY_PATH}/`).send(createActivityPayload);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();
    });

    it('invalid relation', async () => {
      const createActivityPayload = { reps: 8, sets: 4, exerciseId: UNEXISTENT_ID };

      const { statusCode, body } = await request(app).post(`${BASE_ACTIVITY_PATH}/`).send(createActivityPayload);

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

      const { statusCode, body } = await request(app)
        .put(`${BASE_ACTIVITY_PATH}/${activityId}`)
        .send(updateActivityPayload);

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: activityId, ...updateActivityPayload });

      await deleteActivity(activityId);
    });

    it('invalid dto', async () => {
      const createActivityPayload = { reps: 8, sets: 4, exerciseId: 1 };
      const { id: activityId } = await createActivity(createActivityPayload);

      const updateActivityPayload = { rep: 4, set: 4 };

      const { statusCode, body } = await request(app)
        .put(`${BASE_ACTIVITY_PATH}/${activityId}`)
        .send(updateActivityPayload);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(isErrorResponse(body)).toBeTruthy();

      await deleteActivity(activityId);
    });

    it('not found', async () => {
      const updateActivityPayload = { reps: 8, sets: 4, exerciseId: 1 };

      const { statusCode, body } = await request(app)
        .put(`${BASE_ACTIVITY_PATH}/${UNEXISTENT_ID}`)
        .send(updateActivityPayload);

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(isErrorResponse(body)).toBeTruthy();
    });

    it('invalid relation', async () => {
      const createActivityPayload = { reps: 8, sets: 4, exerciseId: 1 };
      const { id: activityId } = await createActivity(createActivityPayload);

      const updateActivityPayload = { reps: 8, sets: 3, exerciseId: UNEXISTENT_ID };

      const { statusCode, body } = await request(app)
        .put(`${BASE_ACTIVITY_PATH}/${activityId}`)
        .send(updateActivityPayload);

      expect(statusCode).toBe(HttpStatus.CONFLICT);
      expect(isErrorResponse(body)).toBeTruthy();
    });
  });

  describe('DELETE /:id', () => {
    it('delete', async () => {
      const createActivityPayload = { reps: 8, sets: 4, exerciseId: 1 };
      const { id: activityId } = await createActivity(createActivityPayload);

      const { statusCode, body } = await request(app).delete(`${BASE_ACTIVITY_PATH}/${activityId}`).send();

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({ id: activityId, ...createActivityPayload });

      const activity = await findActivityById(activityId);
      expect(activity).toBeNull();
    });

    it('not found', async () => {
      const { statusCode } = await request(app).delete(`${BASE_ACTIVITY_PATH}/${UNEXISTENT_ID}`).send();
      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
