-- delete data from status
DELETE FROM status;

-- unlink workouts and users
ALTER TABLE workouts DROP FOREIGN KEY fk_workout_user;
ALTER TABLE workouts DROP COLUMN `userId`;

-- unlink workouts and difficulties
ALTER TABLE workouts DROP FOREIGN KEY fk_workout_difficulty;
ALTER TABLE workouts DROP COLUMN `difficultyId`;

-- unlink workouts and muscles
DROP TABLE IF EXISTS workout_muscle;

-- unlink activities and iteration
ALTER TABLE activities DROP FOREIGN KEY fk_activity_iteration;
ALTER TABLE activities DROP COLUMN `iterationId`;

-- unlink activity and exercises
ALTER TABLE activities DROP FOREIGN KEY fk_activity_exercise;
ALTER TABLE activities DROP COLUMN `exerciseId`;

-- unlink activity and status
ALTER TABLE activities DROP FOREIGN KEY fk_activity_status;
ALTER TABLE activities DROP COLUMN `statusId`;

-- unlink iterations and workout
ALTER TABLE iterations DROP FOREIGN KEY fk_iteration_workout;
ALTER TABLE iterations DROP COLUMN `workoutId`;

-- delete table workouts
DROP TABLE IF EXISTS workouts;

-- delete table iterations
DROP TABLE IF EXISTS iterations;

-- delete table activities
DROP TABLE IF EXISTS activities;

-- delete table status
DROP TABLE IF EXISTS status;

-- delete data from difficulties
DELETE FROM difficulties;

-- delete data from muscles
DELETE FROM muscles;

-- unlink exercises and users
ALTER TABLE exercises DROP FOREIGN KEY fk_user_exercise;
ALTER TABLE exercises DROP COLUMN `userId`;

-- unlink exercises and difficulties
ALTER TABLE exercises DROP FOREIGN KEY fk_exercise_difficulty;
ALTER TABLE exercises DROP COLUMN `difficultyId`;

-- unlink exercises and muscles
DROP TABLE IF EXISTS exercise_muscle;

-- delete table difficulties
DROP TABLE IF EXISTS difficulties;

-- delete table muscles
DROP TABLE IF EXISTS muscles;


-- delete table exercises
DROP TABLE IF EXISTS exercises;

-- delete table users
DROP TABLE IF EXISTS users;
