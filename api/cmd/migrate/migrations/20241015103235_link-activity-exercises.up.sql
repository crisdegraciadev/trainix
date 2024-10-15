ALTER TABLE activity ADD COLUMN `exerciseId` INT UNSIGNED;

ALTER TABLE activity ADD CONSTRAINT fk_activity_exercise
FOREIGN KEY (`exerciseId`) REFERENCES exercises (`id`) ON DELETE CASCADE;
