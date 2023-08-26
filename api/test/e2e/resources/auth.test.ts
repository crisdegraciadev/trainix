import { BASE_AUTH_PATH } from '../helpers/auth';
import { HttpStatus } from '../../../src/consts';
import { createUser, deleteUser } from '../helpers/user';
import { createAdmin, cleanDatabase } from '../helpers/db';
import { postRequest } from '../helpers/request';
import { isErrorResponse } from '../helpers/error';

beforeAll(async () => {
  await createAdmin();
  await cleanDatabase({ all: false });
});

afterAll(async () => {
  await cleanDatabase({ all: true });
});

describe('AUTH', () => {
  describe('LOGIN', () => {
    it('valid credentials', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { username, password } = createUserPayload;
      const { id: userId } = await createUser(createUserPayload);

      const { statusCode, body } = await postRequest({
        url: `${BASE_AUTH_PATH}/login`,
        dto: { username, password },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toHaveProperty('accessToken');
      expect(typeof body.accessToken === 'string').toBeTruthy();

      deleteUser(userId);
    });

    it('invalid credentials', async () => {
      const createUserPayload = { username: 'cris', password: '1234', repeatedPassword: '1234' };
      const { username } = createUserPayload;
      const { id: userId } = await createUser(createUserPayload);

      const { statusCode, body } = await postRequest({
        url: `${BASE_AUTH_PATH}/login`,
        dto: { username, password: 'b4d_p4ss' },
      });

      expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(isErrorResponse(body)).toBeTruthy();

      deleteUser(userId);
    });
  });
});
