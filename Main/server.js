const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");

const mysqlConfig = require("./config");

const db = mysql.createConnection(mysqlConfig);

require("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const promptUser = [
  {
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
    ],
    name: "choice",
    loop: false,
  },
];

menu = () => {
  inquirer.prompt(promptUser).then((answer) => {
    switch (answer.choice) {
      case "View All Employees":
        viewAllEmployees();
        break;

      case "Add Employee":
        addEmployee();
        break;

      case "Update Employee Role":
        updateRole();
        break;

      case "View All Roles":
        viewAllRoles();
        break;

      case "Add Role":
        addRole();
        break;

      case "View All Departments":
        viewAllDepartments();
        break;

      case "Add Department":
        addDepartment();
        break;

      default:
        console.error("Option not available!");
        return;
    }
  });
};

menu();

function viewAllEmployees() {
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employee
  JOIN role ON employee.role_id=role.id
  JOIN department ON role.department_id=department.id
  LEFT OUTER JOIN employee AS manager ON manager.manager_id=employee.id`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("");
    console.table(result);
  });
  menu();
}

function viewAllRoles() {
  let sql = `SELECT role.id, role.title, department.name AS department, role.salary 
  FROM role
  JOIN department ON role.department_id=department.id`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("");
    console.table(result);
    menu();
  });
}

function viewAllDepartments() {
  let sql = `SELECT department.id, department.name 
  FROM department`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("");
    console.table(result);
    menu();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the department's name?",
      },
    ])
    .then((answer) => {
      db.query(
        `INSERT INTO department (department.name) VALUES ('${answer.department}')`
      );
      console.log(`Added ${answer.department} to the database!`);
      menu();
    });
}

function addRole() {
  let departments = [];
  let department_ids = [];
  let sql = `SELECT department.id, department.name 
  FROM department`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    for (const line of result) {
      departments.push(line.name);
      department_ids.push(line.id);
    }
  });
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the name of the role?",
      },
      {
        type: "number",
        name: "salary",
        message: "What is the salary of the role?",
      },
      {
        type: "list",
        name: "department",
        message: "Which department does the role belong to?",
        choices: departments,
        loop: false,
      },
    ])
    .then((answer) => {
      let sql = `INSERT INTO role (role.title, role.salary, role.department_id) VALUES ('${
        answer.title
      }', ${answer.salary}, ${
        department_ids[departments.indexOf(answer.department)]
      })`;
      db.query(sql, function (err, result) {
        if (err) throw err;
        console.log(`Added ${answer.title} to the database!`);
        menu();
      });
    });
}

function addEmployee() {
  let employees = [];
  let employee_ids = [];
  db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id FROM employee`,
    function (err, result) {
      if (err) throw err;
      for (const line of result) {
        employees.push(line.first_name + " " + line.last_name);
        employee_ids.push(line.id);
      }
    }
  );
  employees.push("No Manager");
  employee_ids.push(null);

  let roles = [];
  let role_ids = [];
  db.query(`SELECT role.id, role.title FROM role`, function (err, result) {
    if (err) throw err;
    for (const line of result) {
      roles.push(line.title);
      role_ids.push(line.id);
    }
  });

  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: roles,
        loop: false,
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: employees,
        loop: false,
      },
    ])
    .then((answer) => {
      const first_name = answer.firstName;
      const last_name = answer.lastName;
      const role_id = role_ids[roles.indexOf(answer.role)];
      const manager_id = employee_ids[employees.indexOf(answer.manager)];

      db.query(
        `INSERT INTO employee (employee.first_name, employee.last_name, employee.role_id, employee.manager_id) VALUES ('${first_name}', '${last_name}', ${role_id}, ${manager_id})`,
        function (err, result) {
          if (err) throw err;
          console.log(`Added ${first_name} ${last_name} to the database!`);
          menu();
        }
      );
    });
}

function updateRole() {
  let employees = [];
  let employee_ids = [];
  db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id FROM employee`,
    function (err, result) {
      if (err) throw err;
      for (const line of result) {
        employees.push(line.first_name + " " + line.last_name);
        employee_ids.push(line.id);
      }
      inquirer
        .prompt({
          type: "list",
          name: "employee",
          message: "Which employee do you want to update?",
          choices: employees,
          loop: false,
        })
        .then((answer) => {
          const employee_id = employee_ids[employees.indexOf(answer.employee)];
          db.query(`SELECT role.title, id FROM role`, (err, result) => {
            let titles = [];
            let title_ids = [];
            for (const line of result) {
              titles.push(line.title);
              title_ids.push(line.id);
            }

            inquirer
              .prompt({
                type: "list",
                name: "new_id",
                message: "What is their new title?",
                choices: titles,
                loop: false,
              })
              .then((answer) => {
                const new_role_id = title_ids[titles.indexOf(answer.new_id)];
                db.query(
                  `UPDATE employee SET employee.role_id = ${new_role_id} WHERE employee.id = ${employee_id}`,
                  (err, result) => {
                    if (err) throw err;
                    console.log("Updated employee's role!")
                    menu();
                  }
                );
              });
          });
        });
    }
  );
}