-- =============================================
-- Jobify - MySQL Database Schema
-- Color Theme: Dark Blue
-- =============================================

CREATE DATABASE IF NOT EXISTS jobify_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE jobify_db;

-- ─── USERS ───────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(150)        NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255)        NOT NULL,
  phone         VARCHAR(30),
  role          ENUM('JOB_SEEKER','EMPLOYER','ADMIN') NOT NULL DEFAULT 'JOB_SEEKER',
  avatar_url    VARCHAR(500),
  is_active     BOOLEAN             NOT NULL DEFAULT TRUE,
  created_at    DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── EMPLOYERS / COMPANIES ───────────────────────────────────────────────────
CREATE TABLE companies (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT              NOT NULL UNIQUE,
  company_name  VARCHAR(255)        NOT NULL,
  industry      VARCHAR(150),
  website       VARCHAR(255),
  logo_url      VARCHAR(500),
  description   TEXT,
  location      VARCHAR(255),
  size          ENUM('1-10','11-50','51-200','201-500','500+'),
  founded_year  YEAR,
  is_verified   BOOLEAN             NOT NULL DEFAULT FALSE,
  created_at    DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_company_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── JOB SEEKER PROFILES ─────────────────────────────────────────────────────
CREATE TABLE seeker_profiles (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT NOT NULL UNIQUE,
  headline        VARCHAR(255),
  summary         TEXT,
  cv_url          VARCHAR(500),
  location        VARCHAR(255),
  years_exp       TINYINT UNSIGNED,
  education_level ENUM('HIGH_SCHOOL','DIPLOMA','BACHELOR','MASTER','PHD','OTHER'),
  linkedin_url    VARCHAR(255),
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_seeker_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── CATEGORIES ──────────────────────────────────────────────────────────────
CREATE TABLE categories (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) UNIQUE NOT NULL,
  icon       VARCHAR(50),
  job_count  INT NOT NULL DEFAULT 0
);

INSERT INTO categories (name, icon) VALUES
  ('Information Technology', 'laptop'),
  ('Finance & Accounting', 'chart-line'),
  ('Engineering', 'cog'),
  ('Health & Medicine', 'heartbeat'),
  ('Education & Training', 'graduation-cap'),
  ('Sales & Marketing', 'bullhorn'),
  ('Human Resources', 'users'),
  ('Legal', 'gavel'),
  ('NGO & Development', 'globe'),
  ('Logistics & Transport', 'truck'),
  ('Construction', 'hard-hat'),
  ('Hospitality & Tourism', 'hotel');

-- ─── JOBS ────────────────────────────────────────────────────────────────────
CREATE TABLE jobs (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  company_id       BIGINT              NOT NULL,
  category_id      BIGINT,
  title            VARCHAR(255)        NOT NULL,
  description      LONGTEXT            NOT NULL,
  requirements     TEXT,
  responsibilities TEXT,
  job_type         ENUM('FULL_TIME','PART_TIME','CONTRACT','INTERNSHIP','FREELANCE') NOT NULL DEFAULT 'FULL_TIME',
  location         VARCHAR(255),
  is_remote        BOOLEAN             NOT NULL DEFAULT FALSE,
  salary_min       DECIMAL(12,2),
  salary_max       DECIMAL(12,2),
  salary_currency  VARCHAR(10)         NOT NULL DEFAULT 'ETB',
  experience_years TINYINT UNSIGNED,
  education_level  ENUM('HIGH_SCHOOL','DIPLOMA','BACHELOR','MASTER','PHD','ANY'),
  deadline         DATE,
  status           ENUM('ACTIVE','CLOSED','DRAFT') NOT NULL DEFAULT 'ACTIVE',
  views            INT                 NOT NULL DEFAULT 0,
  created_at       DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_job_company  FOREIGN KEY (company_id)  REFERENCES companies(id)  ON DELETE CASCADE,
  CONSTRAINT fk_job_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE INDEX idx_jobs_status   ON jobs(status);
CREATE INDEX idx_jobs_deadline ON jobs(deadline);
CREATE INDEX idx_jobs_company  ON jobs(company_id);
CREATE FULLTEXT INDEX idx_jobs_fulltext ON jobs(title, description, requirements);

-- ─── APPLICATIONS ────────────────────────────────────────────────────────────
CREATE TABLE applications (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  job_id       BIGINT NOT NULL,
  seeker_id    BIGINT NOT NULL,
  cover_letter TEXT,
  cv_url       VARCHAR(500),
  status       ENUM('PENDING','REVIEWED','SHORTLISTED','REJECTED','HIRED') NOT NULL DEFAULT 'PENDING',
  applied_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_app_job    FOREIGN KEY (job_id)    REFERENCES jobs(id)   ON DELETE CASCADE,
  CONSTRAINT fk_app_seeker FOREIGN KEY (seeker_id) REFERENCES users(id)  ON DELETE CASCADE,
  UNIQUE KEY uq_application (job_id, seeker_id)
);

-- ─── SAVED JOBS ──────────────────────────────────────────────────────────────
CREATE TABLE saved_jobs (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  job_id     BIGINT NOT NULL,
  user_id    BIGINT NOT NULL,
  saved_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_saved_job  FOREIGN KEY (job_id)  REFERENCES jobs(id)  ON DELETE CASCADE,
  CONSTRAINT fk_saved_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_saved (job_id, user_id)
);

-- ─── NOTIFICATIONS ───────────────────────────────────────────────────────────
CREATE TABLE notifications (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT NOT NULL,
  title      VARCHAR(255) NOT NULL,
  body       TEXT,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  type       ENUM('APPLICATION','JOB_ALERT','SYSTEM') NOT NULL DEFAULT 'SYSTEM',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── SKILLS ──────────────────────────────────────────────────────────────────
CREATE TABLE skills (
  id   BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE seeker_skills (
  seeker_id BIGINT NOT NULL,
  skill_id  BIGINT NOT NULL,
  PRIMARY KEY (seeker_id, skill_id),
  CONSTRAINT fk_ss_seeker FOREIGN KEY (seeker_id) REFERENCES seeker_profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_ss_skill  FOREIGN KEY (skill_id)  REFERENCES skills(id)          ON DELETE CASCADE
);

CREATE TABLE job_skills (
  job_id   BIGINT NOT NULL,
  skill_id BIGINT NOT NULL,
  PRIMARY KEY (job_id, skill_id),
  CONSTRAINT fk_js_job   FOREIGN KEY (job_id)   REFERENCES jobs(id)   ON DELETE CASCADE,
  CONSTRAINT fk_js_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- ─── DEMO DATA ───────────────────────────────────────────────────────────────
INSERT INTO users (full_name, email, password_hash, role) VALUES
  ('Admin User',       'admin@ethiojobs.et',    '$2a$10$PLACEHOLDER_HASH', 'ADMIN'),
  ('Abebe Kebede',     'abebe@techcorp.et',     '$2a$10$PLACEHOLDER_HASH', 'EMPLOYER'),
  ('Tigist Hailu',     'tigist@seeker.et',      '$2a$10$PLACEHOLDER_HASH', 'JOB_SEEKER'),
  ('Dawit Mekonen',    'dawit@ngo.et',          '$2a$10$PLACEHOLDER_HASH', 'EMPLOYER');

INSERT INTO companies (user_id, company_name, industry, location, description, is_verified) VALUES
  (2, 'TechCorp Ethiopia', 'Information Technology', 'Addis Ababa', 'Leading tech company in Ethiopia.', TRUE),
  (4, 'HopeAfrica NGO',   'NGO & Development',       'Addis Ababa', 'Development organization working across Africa.', TRUE);
