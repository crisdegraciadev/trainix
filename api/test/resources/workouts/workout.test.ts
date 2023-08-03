import { deleteAllUsers } from '../users/helpers';
import { deleteAllWorkouts } from './helpers';

// const BASE_PATH = '/worksuts';

beforeAll(async () => {
  await deleteAllUsers();
  await deleteAllWorkouts();
});

afterEach(async () => {
  await deleteAllUsers();
  await deleteAllWorkouts();
});

describe('GET /:id', () => {
  it('find by id', async () => {});

  it('not found', async () => {});
});

describe('GET /', () => {
  it('list with 3 elements', async () => {});

  it('empty list', async () => {});
});

describe('POST /', () => {
  it('create', async () => {});

  it('invalid dto', async () => {});

  it('duplicate name', async () => {});
});

describe('PUT /:id', () => {
  it('update', async () => {});

  it('not found', async () => {});

  it('invalid dto', async () => {});
});

describe('DELETE /:id', () => {
  it('delete', async () => {});

  it('not found', async () => {});
});
