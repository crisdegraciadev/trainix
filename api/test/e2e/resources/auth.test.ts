import { BASE_AUTH_PATH } from '../helpers/auth';
import { HttpStatus } from '../../../src/consts';
import { createAdminUser, createUser, deleteUser } from '../helpers/user';
import { cleanDatabase } from '../helpers/db';
import { postRequest } from '../helpers/request';
import { isErrorResponse } from '../helpers/error';
import { CREATE_USER_CRIS_PAYLOAD } from '../fixtures/users';

beforeAll(async () => {
  await createAdminUser();
  await cleanDatabase({ all: false });
});

afterAll(async () => {
  await cleanDatabase({ all: true });
});

describe('AUTH', () => {
  describe('LOGIN', () => {
    it('valid credentials', async () => {
      const { email, password } = CREATE_USER_CRIS_PAYLOAD;
      const { id: userId } = await createUser(CREATE_USER_CRIS_PAYLOAD);

      const { statusCode, body, headers } = await postRequest({
        url: `${BASE_AUTH_PATH}/login`,
        dto: { email, password },
      });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toMatchObject({});
      expect(headers).toHaveProperty('set-cookie');
      expect(headers['set-cookie'][0]).toMatch(
        /^token=([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]+); Max-Age=\d+; Path=\/; HttpOnly; SameSite=Strict$/
      );

      deleteUser(userId);
    });

    it('invalid credentials', async () => {
      const { email } = CREATE_USER_CRIS_PAYLOAD;
      const { id: userId } = await createUser(CREATE_USER_CRIS_PAYLOAD);

      const { statusCode, body } = await postRequest({
        url: `${BASE_AUTH_PATH}/login`,
        dto: { email, password: 'b4d_p4ss' },
      });

      expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(isErrorResponse(body)).toBeTruthy();

      deleteUser(userId);
    });
  });
});
