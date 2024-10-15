ALTER TABLE iteration ADD COLUMN `workoutId` INT UNSIGNED;

ALTER TABLE iteration ADD CONSTRAINT fk_iteration_workout
FOREIGN KEY (`workoutId`) REFERENCES workout (`id`) ON DELETE CASCADE;
