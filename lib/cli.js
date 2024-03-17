const inquirer = require('inquirer');
const pool = require('./pool');

class CLI {
  constructor() { }

  async selectQuery(sql) {
    try {
      const result = await pool.query(sql);
      console.table(result.rows);
      return result;
    }
    catch (err) {
      throw new Error(err);
    }
  }

  async editQuery(sql, params) {
    try {
      const result = await pool.query(sql, [params]);
      // console.log(`Changes made: ${result.rowCount}`);
      return result;
    }
    catch (err) {
      throw new Error(err);
    }
  }

  async paramQuery(sql, params) {
    try {
      const result = await pool.query(sql, params);
      // console.log(`Changes made: ${result.rowCount}`);
      return result;
    }
    catch (err) {
      throw new Error(err);
    }
  }

  viewAllEmployees() {
    console.log(`\nEmployees:\n`);
    const sql = `SELECT employees.first_name, employees.last_name, roles.title FROM employees JOIN roles ON employees.role_id = roles.id;`;
    this.selectQuery(sql);
    setTimeout(() => this.run(), 1000);
  }

  viewAllDept() {
    console.log(`\nDepartments:\n`);
    const sql = `SELECT * FROM departments;`;
    this.selectQuery(sql);
    setTimeout(() => this.run(), 1000);
  }

  async viewEmployeesByDept() {
    const { rows } = await pool.query(`SELECT departments.id, departments.dept_name FROM departments;`);
    console.log(rows);
    const choices = rows.map(({ id, dept_name }) => (
      {
        name: dept_name,
        value: id
      }
    ));
    // console.log(choices);
    inquirer.prompt([
      {
        type: 'list',
        choices: choices,
        name: 'dept'
      }
    ])
      .then((res) => {
        // console.log(res);
        const param = res.dept;
        // console.log(`Param: ${param}`);
        const queryObj = {
          async selectQuery(sql, params) {
            try {
              const { rows } = await pool.query(sql, [params]);
              console.table(rows);
              return rows;
            }
            catch (err) {
              throw new Error(err);
            }
          }
        }
        console.log(`\n Employees in ${param} department:\n`);
        const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.dept_id = departments.id WHERE departments.id = $1;`;
        queryObj.selectQuery(sql, param);
        // console.log(param);
        setTimeout(() => this.run(), 1000);
      })
  }

  addEmp() {

  }

  updateEmpRole() {

  }

  removeEmp() {

  }


  addDept() {
    inquirer.prompt([
      {
        type: 'input',
        message: "What is your new department's name?",
        name: 'dept'
      }
    ])
      .then((res) => {
        const { dept } = res;
        // console.log(dept);
        const sql = `INSERT INTO departments(dept_name) VALUES ($1);`
        const params = dept;
        return this.editQuery(sql, params);
      })
      .then((data) => {
        // console.log(`Data: ${JSON.stringify(data)}`);
        console.log(`${JSON.stringify(data.rowCount)} department ${data.command.toLowerCase()}ed.`);
        console.log(`\nDepartments:\n`);
        const sql2 = `SELECT * FROM departments;`;
        this.selectQuery(sql2);
        setTimeout(() => this.run(), 1000);
      })
      .catch((err) => console.log(err));
  }

  async removeDept() {
    const { rows } = await pool.query(`SELECT departments.id, departments.dept_name FROM departments;`);
    // console.log(rows);
    const choices = rows.map(({ id, dept_name }) => (
      {
        name: dept_name,
        value: id
      }
    ));
    // console.log(choices);
    inquirer.prompt([
      {
        type: 'list',
        message: 'Which department would you like to remove?',
        choices: choices,
        name: 'dept'
      }
    ])
      .then((res) => {
        console.log(res);
        const param = res.dept;
        // console.log(`Param: ${param}`);
        const queryObj = {
          async editQuery2(sql, params) {
            try {
              const data = await pool.query(sql, [params]);
              console.log(`${JSON.stringify(data.rowCount)} department ${data.command.toLowerCase()}d.`);
              return rows;
            }
            catch (err) {
              throw new Error(err);
            }
          }
        }
        const sql = `DELETE FROM departments WHERE departments.id = $1`;
        queryObj.editQuery2(sql, param);
        // console.log(param);
      })
      .then((res) => {
        console.log(`\nDepartments:\n`);
        const sql2 = `SELECT * FROM departments;`;
        this.selectQuery(sql2);
        setTimeout(() => this.run(), 1000);

      })
  }

  viewRoles() {
    console.log(`\nRoles:\n`);
    const sql = `SELECT roles.title AS role, departments.dept_name AS department FROM roles JOIN departments ON roles.dept_id = departments.id;`;
    this.selectQuery(sql);
    setTimeout(() => this.run(), 1000);
  }

  async addRole() {
    const { rows } = await pool.query(`SELECT departments.id, departments.dept_name FROM departments;`);
    // console.log(rows);
    const choices = rows.map(({ id, dept_name }) => (
      {
        name: dept_name,
        value: id
      }
    ));
    inquirer.prompt([
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
        const { title, salary, dept_id } = res;
        console.log(title, salary, dept_id);
        // console.log(dept);
        const sql2 = `INSERT INTO roles(title, salary, dept_id) VALUES ($1, $2, $3);`
        const params2 = [title, salary, dept_id];
        return this.paramQuery(sql2, params2);
      })
      .then((data) => {
        // console.log(`Data: ${JSON.stringify(data)}`);
        console.log(`${JSON.stringify(data.rowCount)} role ${data.command.toLowerCase()}ed.`)
        const sql3 = `SELECT roles.id, roles.title, roles.salary, departments.dept_name FROM roles JOIN departments ON roles.dept_id = departments.id;`;
        console.log(`\nNew Roles: \n`)
        this.selectQuery(sql3);
        setTimeout(() => this.run(), 1000);
      })
      .catch((err) => console.log(err));
  }

  async updateSalary() {
    const { rows } = await pool.query(`SELECT roles.id, roles.title FROM roles;`);
    // console.log(rows);
    const choices = rows.map(({ id, title }) => (
      {
        name: title,
        value: id
      }
    ));
    inquirer.prompt([
      {
        type: 'list',
        message: 'Which role would you like to update?',
        choices: choices,
        name: 'role'
      },
      {
        type: 'number',
        message: 'What is the updated salary of this position?',
        name: 'salary'
      }
    ])
      .then((res) => {
        // console.log(res);
        const { role, salary } = res;

        const queryObj = {
          async editQuery3(sql, params) {
            try {
              const data = await pool.query(sql, params);
              console.log(`\n${JSON.stringify(data.rowCount)} role ${data.command.toLowerCase()}d.\n`);
              return rows;
            }
            catch (err) {
              throw new Error(err);
            }
          }
        }
        const params = [role, salary];
        const sql = `UPDATE roles SET salary= $2 WHERE roles.id = $1`;
        // console.log(`SQL: \n${sql} \nPARAMS: \n${params}`);
        return queryObj.editQuery3(sql, params);
      })
      .then((res) => {
        console.log(res);
        const sql2 = `SELECT roles.title, roles.salary FROM roles;`;
        this.selectQuery(sql2);
        setTimeout(() => this.run(), 1000);

      })
  }

  async removeRole() {
    const { rows } = await pool.query(`SELECT departments.id, departments.dept_name FROM departments;`);
    const choices = rows.map(({ id, dept_name }) => (
      {
        name: dept_name,
        value: id
      }
    ));

    inquirer.prompt([
      {
        type: 'list',
        message: "Which department is the role you'd like to delete in?",
        choices: choices,
        name: 'dept'
      }
    ])
      .then((res) => {
        console.log(res);
        return res;
      })
      .then((res) => this.runQuery(res));
  }

  async runQuery(res) {
    const { dept } = res;
    const { rows } = await pool.query(`SELECT roles.id, roles.title FROM roles WHERE roles.dept_id = ${dept};`);
    const choices2 = rows.map(({ id, title }) => (
      {
        name: title,
        value: id
      }
    ));
    inquirer.prompt([
      {
        type: 'list',
        message: 'Which role would you like to delete?',
        choices: choices2,
        name: 'role'
      }
    ])
      .then((res) => {
        // console.log(res);
        const param = res.role;
        // console.log(`Param: ${param}`);
        const queryObj = {
          async editQuery4(sql, params) {
            try {
              const data = await pool.query(sql, [params]);
              console.log(`${JSON.stringify(data.rowCount)} role ${data.command.toLowerCase()}d.`);
              return rows;
            }
            catch (err) {
              throw new Error(err);
            }
          }
        }
        const sql = `DELETE FROM roles WHERE roles.id = $1`;
        return queryObj.editQuery4(sql, param);
        // console.log(param);
      })
      .then((res) => {
        console.log(res);
        console.log(`\nAll roles:\n`);
        const sql2 = `SELECT roles.id, roles.title, roles.salary, departments.dept_name FROM roles JOIN departments on roles.dept_id = departments.id;`;
        this.selectQuery(sql2);
        setTimeout(() => this.run(), 1000);

      })
  }

  viewManagers() {

  }

  viewEmpByManager() {

  }

  deptBudget() {

  }

  totalBudget() {

  }

  run() {
    return inquirer.prompt([
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
            name: 'Add an employee',
            value: 'add-employee'
          },
          {
            name: 'Update an employee role',
            value: 'update-employee-role'
          },
          {
            name: 'Remove an employee',
            value: 'delete-employee'
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
            value: 'update-salary'
          },
          {
            name: 'Remove a role',
            value: 'delete-role'
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
          case 'update-salary':
            this.updateSalary();
            break;
          case 'delete-role':
            this.removeRole();
            break;
          case 'add-employee':
            this.addEmp();
            break;
          case 'update-employee-role':
            this.updateEmpRole();
            break;
          case 'delete-employee':
            this.removeEmp();
            break;
          case 'view-dept-managers':
            this.viewManagers();
            break;
          case 'view-employees-by-manager':
            this.viewEmpByManager();
            break;
          case 'view-budget-use-by-dept':
            this.deptBudget();
            break;
          case 'view-total-budget-use':
            this.totalBudget();
            break;
          default:
            console.log(`No luck. Try again: \n`);
            this.run();
        }
      })
      .then(() => { })
      .catch((err) => {
        console.log(err);
      });
  }

}



module.exports = CLI;
