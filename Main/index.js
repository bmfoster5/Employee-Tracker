const inquirer = require('inquirer');

function employeeManager() {
    console.log('WELCOME TO EMPLOYEE TRACKER');
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'actions',
          choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role"],
        },
      ])};
