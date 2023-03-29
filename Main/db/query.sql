-- viewAllEmployees
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
ROM employee
JOIN role ON employee.role_id=role.id
JOIN department ON role.department_id=department.id
LEFT OUTER JOIN employee AS manager ON manager.manager_id=employee.id;


SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee
JOIN role ON employee.role_id=role.id
JOIN department ON role.department_id=department.id;
-- viewAllRoles
SELECT * FROM role

-- viewAllDepartments
SELECT * FROM department

-- addEmployee
INSERT INTO employee (employee.first_name, employee.last_name, employee.role_id, employee.manager_id) VALUES ('Sam', 'Kash', 9, 3)

-- addRole
INSERT INTO role

-- addDepartment
INSERT INTO department (department_name)
VALUES (?)

-- updateRole
UPDATE employee SET employee.role_id = ${new_role_id} WHERE employee.id = ${employee_id}