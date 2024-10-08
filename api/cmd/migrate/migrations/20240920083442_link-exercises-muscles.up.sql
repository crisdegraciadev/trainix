CREATE TABLE exercise_muscle (
    `exerciseId` INT UNSIGNED,
    `muscleId` INT UNSIGNED,

    FOREIGN KEY (`exerciseId`) REFERENCES exercises (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`muscleId`) REFERENCES muscles (`id`) ON DELETE CASCADE,
    PRIMARY KEY (`exerciseId`, `muscleId`)
);
