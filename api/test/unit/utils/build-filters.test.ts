import { User } from '@prisma/client';
import { Filters, buildFilters } from '../../../src/utils';

describe('buildFilters()', () => {
  it('simple assignment constraints', () => {
    const userFilters: Filters<User> = { id: 2, username: 'cristian' };

    const filterObject = buildFilters(userFilters);
    expect(filterObject).toStrictEqual({ where: { ...userFilters } });
  });

  it('empty filter', () => {
    const filterObject = buildFilters({});
    expect(filterObject).toStrictEqual({ where: {} });
  });
});
