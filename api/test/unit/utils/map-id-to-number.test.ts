import { Effect } from 'effect';
import { mapIdToNumber } from '../../../src/utils';

describe('mapIdToNumber()', () => {
  it('valid id', () => {
    const validId = '2';
    const mapIdToNumberEffect = mapIdToNumber(validId);
    const mappedId = Effect.runSync(mapIdToNumberEffect);

    expect(typeof mappedId).toBe('number');
    expect(mappedId).toBe(Number(validId));
  });

  it('invalid id', () => {
    const invalidId = 'a';
    const mapIdToNumberEffect = mapIdToNumber(invalidId);

    expect(() => Effect.runSync(mapIdToNumberEffect)).toThrow('The provided id is invalid. The id must be a number');
  });
});
