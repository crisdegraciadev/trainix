-- create users table
CREATE TABLE IF NOT EXISTS users (
    `id` INT UNSIGNED AUTO_INCREMENT NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY (`email`)
);

-- create exercises table
CREATE TABLE IF NOT EXISTS exercises (
    `id` INT UNSIGNED AUTO_INCREMENT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `videoUrl` TEXT,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE (`name`)
);

-- create muscles table
CREATE TABLE IF NOT EXISTS muscles (
    `id` INT UNSIGNED AUTO_INCREMENT NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `value` INT NOT NULL,

    PRIMARY KEY (`id`)
);

-- create difficulties table
CREATE TABLE IF NOT EXISTS difficulties (
    `id` INT UNSIGNED AUTO_INCREMENT NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `value` INT NOT NULL,

    PRIMARY KEY (`id`)
);

-- link exercises with muscles
CREATE TABLE exercise_muscle (
    `exerciseId` INT UNSIGNED,
    `muscleId` INT UNSIGNED,

    FOREIGN KEY (`exerciseId`) REFERENCES exercises (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`muscleId`) REFERENCES muscles (`id`) ON DELETE CASCADE,
    PRIMARY KEY (`exerciseId`, `muscleId`)
);


-- link exercises with difficulties
ALTER TABLE exercises ADD COLUMN `difficultyId` INT UNSIGNED;
ALTER TABLE exercises ADD CONSTRAINT fk_exercise_difficulty
FOREIGN KEY (`difficultyId`) REFERENCES difficulties (`id`) ON DELETE CASCADE;


-- link exercises with users
ALTER TABLE exercises ADD COLUMN `userId` INT UNSIGNED;
ALTER TABLE exercises ADD CONSTRAINT fk_user_exercise
FOREIGN KEY (`userId`) REFERENCES users (`id`) ON DELETE CASCADE;

-- insert muscles data
INSERT INTO muscles (label, value) VALUES
('chest', 1),
('triceps', 2),
('biceps', 3),
('shoulders', 4),
('upper back', 5),
('dorsals', 6),
('lower back', 7),
('trapezius', 8),
('deltoid', 9),
('forearms', 10),
('core', 11),
('quadriceps', 12),
('gluteus', 13),
('hamstrings', 14),
('calf', 15);

-- insert difficulties data
INSERT INTO difficulties (label, value) VALUES
('easy', 1),
('medium', 2),
('hard', 3);

-- create status table
CREATE TABLE IF NOT EXISTS status (
    `id` INT UNSIGNED AUTO_INCREMENT NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `value` INT NOT NULL,

    PRIMARY KEY (`id`)
);

-- create activities table
CREATE TABLE IF NOT EXISTS activities (
    `id` INT UNSIGNED AUTO_INCREMENT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `sets` INT NOT NULL,
    `reps` INT NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`)
);

-- create iterations table
CREATE TABLE IF NOT EXISTS iterations (
    `id` INT UNSIGNED AUTO_INCREMENT NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`)
);

-- create workout table
CREATE TABLE IF NOT EXISTS workouts (
    `id` INT UNSIGNED AUTO_INCREMENT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY (`name`)
);

-- link activities with status
ALTER TABLE activities ADD COLUMN `statusId` INT UNSIGNED;
ALTER TABLE activities ADD CONSTRAINT fk_activity_status
FOREIGN KEY (`statusId`) REFERENCES status (`id`) ON DELETE CASCADE;

-- link activities with exercises
ALTER TABLE activities ADD COLUMN `exerciseId` INT UNSIGNED;
ALTER TABLE activities ADD CONSTRAINT fk_activity_exercise
FOREIGN KEY (`exerciseId`) REFERENCES exercises (`id`) ON DELETE CASCADE;

-- link activities with iteration
ALTER TABLE activities ADD COLUMN `iterationId` INT UNSIGNED;
ALTER TABLE activities ADD CONSTRAINT fk_activity_iteration
FOREIGN KEY (`iterationId`) REFERENCES iterations (`id`) ON DELETE CASCADE;

-- link iterations with workout
ALTER TABLE iterations ADD COLUMN `workoutId` INT UNSIGNED;
ALTER TABLE iterations ADD CONSTRAINT fk_iteration_workout
FOREIGN KEY (`workoutId`) REFERENCES workouts (`id`) ON DELETE CASCADE;

-- link muscles with workout
CREATE TABLE workout_muscle (
    `workoutId` INT UNSIGNED,
    `muscleId` INT UNSIGNED,

    FOREIGN KEY (`workoutId`) REFERENCES workouts (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`muscleId`) REFERENCES muscles (`id`) ON DELETE CASCADE,
    PRIMARY KEY (`workoutId`, `muscleId`)
);

-- link workouts with difficulties
ALTER TABLE workouts ADD COLUMN `difficultyId` INT UNSIGNED;
ALTER TABLE workouts ADD CONSTRAINT fk_workout_difficulty
FOREIGN KEY (`difficultyId`) REFERENCES difficulties (`id`) ON DELETE CASCADE;

-- link workouts with users
ALTER TABLE workouts ADD COLUMN `userId` INT UNSIGNED;
ALTER TABLE workouts ADD CONSTRAINT fk_workout_user
FOREIGN KEY (`userId`) REFERENCES users (`id`) ON DELETE CASCADE;

-- insert status data
INSERT INTO status (label, value) VALUES
('slow down', 1),
('stay', 2),
('level up', 3);
