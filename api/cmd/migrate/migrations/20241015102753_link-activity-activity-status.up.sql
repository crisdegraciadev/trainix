ALTER TABLE activity_status ADD COLUMN `activityId` INT UNSIGNED;

ALTER TABLE activity_status ADD CONSTRAINT fk_activity_activity_status
FOREIGN KEY (`activityId`) REFERENCES activity (`id`) ON DELETE CASCADE;
