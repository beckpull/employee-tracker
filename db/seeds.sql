INSERT INTO departments (dept_name) VALUES 
    ('Customer Services'),
    ('Research and Development'),
    ('Sales & Marketing'),
    ('Accounting');

INSERT INTO roles (title, salary, dept_id) VALUES
    ('Customer Service Rep', 80000, 1),
    ('IT Specialist', 104000, 1),
    ('Software Developer', 103000, 2),
    ('Biologist', 102000, 2),
    ('Natural Resources Engineer', 107000, 2),
    ('Business Strategist', 100000, 3),
    ('Sales Specialist', 95000, 3),
    ('Marketing Specialist', 96000, 3),
    ('Accountant', 100500, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
    ('Patrick', 'Swanson', 1, NULL),
    ('Sally', 'Jensen', 1, 1),
    ('Darlene', 'Richards', 1, 1),
    ('Billy', 'Roberts', 2, 1),
    ('Allan', 'Wilde', 2, 1),
    ('Marc', 'Allen', 3, 10),
    ('Carlos', 'Winkler', 3, 10),
    ('Steve', 'Jobs', 4, 10),
    ('Donald', 'Jones', 4, 10),
    ('Trujill', 'Sandman', 5, NULL),
    ('Drake', 'Gerber', 5, 10),
    ('Sean', 'Littfin', 6, NULL),
    ('Jacob', 'Arnold', 6, 12),
    ('Bob', 'Flanagan', 7, 12),
    ('Betty', 'Potter', 7, 12),
    ('Rachel', 'Dansky', 8, 12),
    ('Sheila', 'Fader', 9, NULL);


-- SELECT
--     roles.title,
--     departments.dept_name 
-- FROM roles 
-- JOIN departments ON roles.dept_id = departments.id;

-- SELECT employees.first_name, employees.last_name, roles.title 
-- FROM employees 
-- JOIN roles ON employees.role_id = roles.id

-- SELECT employees.id, employees.first_name, employees.last_name, roles.title
-- FROM employees
-- LEFT JOIN roles ON employees.role_id = roles.id
-- LEFT JOIN departments ON roles.dept_id = departments.id 
-- WHERE departments.id = 1;
