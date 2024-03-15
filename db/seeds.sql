INSERT INTO departments (dept_name) VALUES 
    ('Services'),
    ('Research and Development'),
    ('Engineering'),
    ('Sales & Marketing'),
    ('Business Development'),
    ('Human Resources');

INSERT INTO roles (title, salary, dept_id) VALUES
    ('Customer Service Rep', 40000, 1),
    ('IT Specialist', 80000, 1),
    ('Software Developer', 91000, 2),
    ('Biologist', 90000, 2),
    ('Sales Specialist', 65000, 4),
    ('Bio Engineer', 91000, 3),
    ('Natural Resources Engineer', 91000, 3),
    ('Market Researcher', 67000, 4),
    ('Business Strategist', 77000, 5),
    ('Human Resources Specialist', 75000, 6);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
    ('Patrick', 'Swanson', 1, 2),
    ('Sally', 'Jensen', 1, NULL),
    ('Marc', 'Allen', 3, NULL),
    ('Darlene', 'Richards', 1, 2)
    ('Donald', 'Jones', 4, 3),
    ('Betty', 'Potter', 9, NULL),
    ('Jacob', 'Arnold', 5, 7),
    ('Trujill', 'Sandman', 6, NULL),
    ('Billy', 'Roberts', 2, 2),
    ('Allan', 'Wilde', 2, 2),
    ('Rachel', 'Dansky', 9, 5),
    ('Drake', 'Gerber', 5, 3),
    ('Bob', 'Flanagan', 8, NULL)


SELECT
    roles.title,
    departments.dept_name 
FROM roles 
JOIN departments ON roles.dept_id = departments.id;

