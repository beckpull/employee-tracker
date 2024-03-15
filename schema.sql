DROP DATABASE IF EXISTS tracker_db;

CREATE DATABASE tracker_db;

\c tracker_db;

CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    dept_name VARCHAR(30)
);

CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager INT,
    is_manager BOOLEAN,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
    FOREIGN KEY (manager) REFERENCES employees(id) ON DELETE SET NULL
);