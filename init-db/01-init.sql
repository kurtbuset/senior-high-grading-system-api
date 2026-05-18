-- MySQL Initialization Script for Senior High Grading System
-- This script runs automatically when the MySQL container starts for the first time

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `senior-high-db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE `senior-high-db`;

-- Grant privileges to the application user
GRANT ALL PRIVILEGES ON `senior-high-db`.* TO 'senior_high_user'@'%';
FLUSH PRIVILEGES;

-- Log initialization
SELECT 'Database initialized successfully' AS message;
