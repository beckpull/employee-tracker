const inquirer = require('inquirer');
const pool = require('./pool');

class CLI {
  constructor() {}

  async executeQuery(sql) {
    const result = await pool.query(sql);
    console.table(result.rows);
    return result;
  }

  viewAllEmployees() {
    const sql = `SELECT id, first_name, last_name FROM employees`;
    this.executeQuery(sql);
  }
  
  run() {
    return inquirer
      .prompt([
        {   
            type: 'list',
            message: "What would you like to do?",
            name: 'task',
            choices: [
              {
                name: 'View all employees',
                value: 'view-all-employees'
              }, 
              {
                name: 'View employees by dept',
                value: 'view-employees-by-dept'
              },
              {
                name: 'View all departments',
                value: 'view-depts'
              },
              {
                name: 'Add a department',
                value: 'add-dept'
              },
              {
                name: 'Remove a department',
                value: 'remove-dept'
              },
              {
                name: 'View all roles',
                value: 'view-roles'
              },
              {
                name: 'Add a role',
                value: 'add-role'
              },
              {
                name: 'Update role salary',
                value:'update-salary'
              },
              {
                name: 'Delete a role',
                value: 'delete-role'
              },
              {
                name: 'Add an employee',
                value: 'add-employee'
              },
              {
                name: 'Update an employee role',
                value: 'update-employee-role'
              },
              {
                name: 'Delete an employee',
                value: 'delete-employee'
              },
              {
                name: 'View dept managers',
                value: 'view-dept-managers'
              },
              {
                name: 'View employees by manager',
                value: 'view-employees-by-manager'
              },
              {
                name: 'View utilized budget by department',
                value: 'view-budget-use-by-dept'
              },
              {
                name: "View total utilized labor budget",
                value: 'view-total-budget-use'
              }
            ]
        }
      ])
      .then((res) => {
       console.log(res);
       const { task } = res;
       return task;
      })
      .then((choice) => {
        switch (choice) {
          case 'view-all-employees':
            this.viewAllEmployees();
            break;
          case 'view_employees-by-dept':
            
            break;
          case 'view-depts':
            
            break;
          case 'add-dept':
            
            break;
          case 'remove-dept':
            
            break;
          case 'view-roles':
            
            break;
          case 'add-role':
            
            break;
          case 'update_salary':
            
            break;
          case 'delete-role':
            
            break;
          case 'add-employee':
            
            break;
          case 'update-employee-role':
            
            break;
          case 'delete-employee':
            
            break;
          case 'view-dept-managers':
            
            break;
          case 'view-employees-by-manager':
            
            break;
          case 'view-budget-use-by-dept':
            
            break;
          case 'view-total-budget-use':
            break;
          default:
            console.log('No luck.');
        }
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }

}



module.exports = CLI;
