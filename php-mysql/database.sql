-- MySQL Database Blueprint for Enterprise AI-Solutions
-- To use, import this file into PHPMyAdmin or run via MySQL terminal:
-- mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS enterprise_ai; USE enterprise_ai;" < database.sql

CREATE DATABASE IF NOT EXISTS enterprise_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE enterprise_ai;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uid VARCHAR(128) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NULL,
    phone VARCHAR(50) NULL,
    company VARCHAR(255) NULL,
    country VARCHAR(100) NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Inquiries (Contact Forms) Table
CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    company VARCHAR(255) NULL,
    country VARCHAR(100) NULL,
    job_title VARCHAR(255) NULL,
    type VARCHAR(100) NOT NULL, -- e.g. "General Enquiry", "Technical Support"
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Demo Requests Table
CREATE TABLE IF NOT EXISTS demo_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    company VARCHAR(255) NULL,
    country VARCHAR(100) NULL,
    service VARCHAR(255) NOT NULL, -- e.g. "Workflow Automation"
    requirements TEXT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. Events Table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Event Registrations Table
CREATE TABLE IF NOT EXISTS event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255) NULL,
    country VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- 6. Testimonials & Website Reviews Table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Initial Seed Data

-- Populate Events
INSERT INTO events (title, description, location, date) VALUES
('AI Transforming the Workplace 2026', 'Discover how top companies harness agentic AI systems to transform daily work and scale operations.', 'London, UK & Virtual', '2026-09-15'),
('Prototyping with AI Masterclass', 'A comprehensive hands-on workshop focused on leveraging LLMs to build rapid MVPs and software tools.', 'Online', '2026-10-02'),
('Enterprise AI Summit 2026', 'Our flagship annual summit focusing on agentic workflows, custom automation, and local digital evolution.', 'Sunderland, UK', '2026-03-10'),
('Custom LLM Fine-Tuning Workshop', 'A technical deep-dive into self-hosting, fine-tuning, and setting up vector databases securely in high-privacy sectors.', 'Newcastle, UK', '2025-11-14');

-- Populate Testimonials / Website Reviews
INSERT INTO testimonials (name, company, rating, comment) VALUES
('Sarah Jenkins', 'CTO, TechNorth Dynamics', 5, 'The enterprise automation solutions designed by AI-Solutions have boosted our operational throughput by over 40% in just three months! Highly recommended.'),
('Marcus Finch', 'VP of Operations, Sunderland Digital', 5, 'Absolute game-changer! Their 24/7 digital virtual companions have streamlined employee queries and reduced standard waiting times to zero.'),
('Aisha Patel', 'Lead Architect, GreenScale Enterprise', 4, 'Very reliable custom LLM integration. The private self-hosting model kept our corporate legal contracts fully secure. Fantastic job!');

-- Populate Demo Requests (Example Bookings)
INSERT INTO demo_requests (name, email, phone, company, country, service, requirements, date, status) VALUES
('John Doe', 'john.doe@example.com', '+44 7700 900077', 'JD Consultancies', 'United Kingdom', 'Intelligent Chatbots', 'Looking to deploy an internal HR chatbot.', '2026-08-10', 'pending'),
('Elena Rostova', 'elena@innovatelabs.io', '+1 415 555 2671', 'Innovate Labs', 'United States', 'Workflow Automation', 'Automating daily client bookkeeping reports.', '2026-08-12', 'pending');
