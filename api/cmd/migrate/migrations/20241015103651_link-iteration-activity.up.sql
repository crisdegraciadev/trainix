ALTER TABLE activity ADD COLUMN `iterationId` INT UNSIGNED;

ALTER TABLE activity ADD CONSTRAINT fk_activity_iteration
FOREIGN KEY (`iterationId`) REFERENCES iteration (`id`) ON DELETE CASCADE;
