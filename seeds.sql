INSERT INTO departments (dept_name) VALUES 
    ('Services'),
    ('Support'),
    ('Research and Development'),
    ('Sales'),
    ('Engineering'),
    ('Marketing'),
    ('Business Development'),
    ('Training'),
    ('Human Resources');

INSERT INTO roles (title, salary, dept_id) VALUES
    ('Customer Service Rep', 40000, 1),
    ('IT Specialist', 80000, 2),
    ('Software Developer', 91000, 3),
    ('Biologist', 90000, 3),
    ('Sales Specialist', 65000, 4),
    ('Software Engineer', 91000, 5),
    ('Bio Engineer', 91000, 5),
    ('Natural Resources Engineer', 91000, 5),
    ('Market Researcher', 67000, 6),
    ('Business Strategist', 77000, 6),
    ('Human Resources Specialist', 75000, 7);

INSERT INTO employees (first_name, last_name, role_id) VALUES
    ('Patrick', 'Swanson', 9),
    ('Sally', 'Jensen', 1),
    ('Marc', 'Allen', 3),
    ('Donald', 'Jones', 4),
    ('Betty', 'Potter', 11),
    ('Jacob', 'Arnold', 7),
    ('Trujill', 'Sandman', 8),
    ('Billy', 'Roberts', 6),
    ('Allan', 'Wilde', 2),
    ('Rachel', 'Dansky', 5),
    ('Drake', 'Gerber', 10);


SELECT
    roles.title,
    departments.dept_name 
FROM roles 
JOIN departments ON roles.dept_id = departments.id;

