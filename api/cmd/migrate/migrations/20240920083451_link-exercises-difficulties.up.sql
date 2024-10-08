CREATE TABLE exercise_difficulty (
    `exerciseid` INT UNSIGNED,
    `difficultyid` INT UNSIGNED,

    FOREIGN KEY (`exerciseid`) REFERENCES exercises (id) ON DELETE CASCADE,
    FOREIGN KEY (`difficultyid`) REFERENCES difficulties (id) ON DELETE CASCADE,
    PRIMARY KEY (`exerciseId`, `difficultyid`)
);
