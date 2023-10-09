import { Effect } from 'effect';
import { isValidCreateWorkoutDto, isValidUpdateWorkoutDto } from '../../../../../src/resources/workouts/utils';

describe('isValidCreateWorkoutDto()', () => {
  it('valid dto', () => {
    const validDto = {
      name: 'name',
      userId: 1,
    };

    const dto = Effect.runSync(isValidCreateWorkoutDto(validDto));

    expect(dto).toEqual(validDto);
  });

  it('invalid dto', () => {
    const invalidDto = {};

    const effect = isValidCreateWorkoutDto(invalidDto);

    expect(() => Effect.runSync(effect)).toThrow('Invalid dto');
  });
});

describe('isValidUpdateWorkoutDto()', () => {
  it('valid dto', () => {
    const validDto = {
      name: 'name',
      userId: 1,
    };

    const dto = Effect.runSync(isValidUpdateWorkoutDto(validDto));

    expect(dto).toEqual(validDto);
  });

  it('invalid dto', () => {
    const invalidDto = {};

    const effect = isValidCreateWorkoutDto(invalidDto);

    expect(() => Effect.runSync(effect)).toThrow('Invalid dto');
  });
});
