-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('SUPER_ADMIN', 'ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER';