const inquirer = require('inquirer');
const pool = require('./pool');

class CLI {
  constructor() {}

  async selectQuery(sql) {
    try {
      const result = await pool.query(sql);
      console.table(result.rows);
      return result;
    } 
    catch(err) {
      throw new Error(err);
    }
  }

  async editQuery(sql, params) {
    try {
      const result = await pool.query(sql, [params]);
      // console.log(`Changes made: ${result.rowCount}`);
      return result;
    }
    catch(err) {
      throw new Error(err);
    }
  }

  viewAllEmployees() {
    const sql = `SELECT employees.first_name, employees.last_name, roles.title FROM employees JOIN roles ON employees.role_id = roles.id;`;
    this.selectQuery(sql);
    setTimeout(() =>  this.run(), 1000);
  }

  viewAllDept() {
    const sql = `SELECT * FROM departments;`;
    this.selectQuery(sql);
    setTimeout(() =>  this.run(), 1000);
  }

  async viewEmployeesByDept() {
      const {rows} = await pool.query(`SELECT departments.id, departments.dept_name FROM departments;`);
      console.log(rows);
      const choices = rows.map(({id, dept_name}) => (
        {
          name: dept_name,
          value: id
        }
      ));
      // console.log(choices);
      inquirer
      .prompt([
        {
          type: 'list',
          choices: choices,
          name: 'dept'
        }
      ])
      .then((res) => {
        console.log(res);
        const param = res.dept;
        // console.log(`Param: ${param}`);
        const queryObj = {
           async selectQuery(sql, params) {
          try {
            const {rows} = await pool.query(sql, [params]);
            console.table(rows);
            return rows;
          } 
          catch(err) {
            throw new Error(err);
          }
        } 
        }
        const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.dept_id = departments.id WHERE departments.id = $1;`;
        queryObj.selectQuery(sql, param);
        // console.log(param);
        setTimeout(() =>  this.run(), 1000);
      })
  }


  addDept() {
    inquirer
      .prompt([
        {
          type: 'input',
          message: "What is your new department's name?",
          name: 'dept'
        }
      ])
      .then((res) => {
        const {dept} = res;
        // console.log(dept);
        const sql = `INSERT INTO departments(dept_name) VALUES ($1);`
        const params = dept;
        return this.editQuery(sql, params);
      })
      .then((data) => {
        // console.log(`Data: ${JSON.stringify(data)}`);
        console.log(`${JSON.stringify(data.rowCount)} department ${data.command.toLowerCase()}ed.`)
        const sql2 = `SELECT * FROM departments;`;
        this.selectQuery(sql2);
        setTimeout(() =>  this.run(), 1000);
      })
      .catch((err) => console.log(err));
  }

  async removeDept() {
    const {rows} = await pool.query(`SELECT departments.id, departments.dept_name FROM departments;`);
    console.log(rows);
    const choices = rows.map(({id, dept_name}) => (
      {
        name: dept_name,
        value: id
      }
    ));
    // console.log(choices);
    inquirer
    .prompt([
      {
        type: 'list',
        choices: choices,
        name: 'dept'
      }
    ])
    .then((res) => {
      console.log(res);
      const param = res.dept;
      // console.log(`Param: ${param}`);
      const queryObj = {
         async editQuery(sql, params) {
        try {
          const data = await pool.query(sql, [params]);
          console.log(`${JSON.stringify(data.rowCount)} department ${data.command.toLowerCase()}d.`);
          return rows;
        } 
        catch(err) {
          throw new Error(err);
        }
      }}
      const sql = `DELETE FROM departments WHERE departments.id = $1`;
      queryObj.editQuery(sql, param);
      // console.log(param);
    })
    .then((res) => {
      // console.log(res);
      const sql2 = `SELECT * FROM departments;`;
      this.selectQuery(sql2);
      setTimeout(() =>  this.run(), 1000);

    })
  }
  
  viewRoles() {
    const sql = `SELECT roles.title AS role, departments.dept_name AS department FROM roles JOIN departments ON roles.dept_id = departments.id;`;
    this.selectQuery(sql);
    setTimeout(() =>  this.run(), 1000);
  }

  async addRole() {
    const {rows} = await pool.query(`SELECT departments.id, departments.dept_name FROM departments;`);
    // console.log(rows);
    const choices = rows.map(({id, dept_name}) => (
      {
        name: dept_name,
        value: id
      }
    ));
    inquirer
      .prompt([
        {
          type: 'input',
          message: "What is your new role title?",
          name: 'title'
        },
        {
          type: 'number',
          message: 'What is the salary of this role?',
          name: 'salary'
        },
        {
          type: 'list',
          message: 'Which department is this a part of?',
          choices: choices,
          name: 'dept_id'
        }
      ])
      .then((res) => {
        console.log(res);
        const {title, salary, dept_id} = res;
        console.log(title, salary, dept_id);
        // console.log(dept);
        const sql = `INSERT INTO roles(title, salary, dept_id) VALUES ($1, $2, $3);`
        const params2 = [JSON.stringify(title), salary, dept_id];
        return this.editQuery(sql, params2);
      })
      .then((data) => {
        // console.log(`Data: ${JSON.stringify(data)}`);
        console.log(`${JSON.stringify(data.rowCount)} role ${data.command.toLowerCase()}ed.`)
        const sql2 = `SELECT * FROM roles;`;
        this.selectQuery(sql2);
        setTimeout(() =>  this.run(), 1000);
      })
      .catch((err) => console.log(err));
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
          case 'view-employees-by-dept':
            this.viewEmployeesByDept();
            break;
          case 'view-depts':
            this.viewAllDept();
            break;
          case 'add-dept':
            this.addDept();
            break;
          case 'remove-dept':
            this.removeDept();
            break;
          case 'view-roles':
            this.viewRoles();
            break;
          case 'add-role':
            this.addRole();
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
