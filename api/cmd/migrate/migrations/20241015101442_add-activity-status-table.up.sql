CREATE TABLE IF NOT EXISTS activity_status (
    `id` INT UNSIGNED AUTO_INCREMENT NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `value` INT NOT NULL,

    PRIMARY KEY (`id`)
);
