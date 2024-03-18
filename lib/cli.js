const inquirer = require('inquirer');
const fs = require('fs/promises');
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

  async viewAllEmployees() {
    console.log(`\nEmployees:\n`);
    const sql = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS employees, roles.title FROM employees JOIN roles ON employees.role_id = roles.id;`;
    await this.selectQuery(sql);
    this.run();
  }

  async viewAllDept() {
    console.log(`\nDepartments:\n`);
    const sql = `SELECT * FROM departments;`;
    await this.selectQuery(sql);
    this.run();
  }

  async viewEmpsByDept() {
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
        choices: choices,
        message: 'Department:',
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
        console.log(`\n Employees in selected department:\n`);
        const sql = `SELECT employees.id, CONCAT(employees.first_name, ' ', employees.last_name) AS employees, roles.title FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.dept_id = departments.id WHERE departments.id = $1;`;
        queryObj.selectQuery(sql, param);
        // console.log(param);
        setTimeout(() => this.run(), 1000);
      })
  }

  async addEmp() {
    const result = await pool.query(`SELECT departments.id, departments.dept_name FROM departments;`);
    const rows1 = result.rows;
    // console.log(rows);
    const choices1 = rows1.map(({ id, dept_name }) => (
      {
        name: dept_name,
        value: id
      }
    ));
    inquirer.prompt([
      {
        type: 'list',
        message: 'Department:',
        choices: choices1,
        name: 'dept_id'
      }
    ])
      .then((res) => {
        const { dept_id } = res;
        this.addEmp2(dept_id);
      })
      .catch((err) => console.log(err));
  }

  async addEmp2(dept_id) {
    const { rows } = await pool.query(`SELECT roles.id, roles.title FROM roles WHERE roles.dept_id = ${dept_id};`);
    const employees = await this.getEmps();
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
        message: 'Role:',
        choices: choices,
        name: 'role'
      },
      {
        type: 'input',
        message: 'First Name:',
        name: 'first_name'
      },
      {
        type: 'input',
        message: 'Last Name:',
        name: 'last_name'
      },
      {
        type: 'list',
        message: 'Who is their manager?:',
        choices: employees,
        name: 'manager_id'
      }
    ])
      .then((data) => {
        const { role, first_name, last_name, manager_id } = data;
        const sql = `INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);`
        const params = [first_name, last_name, role, manager_id];
        console.log(`Adding ${first_name} ${last_name} to the database.`)
        return this.paramQuery(sql, params);
      })
      .then((data) => {
        // console.log(res);
        console.log(`${JSON.stringify(data.rowCount)} employee ${data.command.toLowerCase()}ed.`);
        return this.viewAllEmployees();
        // this.selectQuery(sql);
      })
      .then((res) => {
        console.log(res);
        this.run();
      })
      .catch((err) => console.log(err));
  }

  async getEmps() {
    const { rows } = await pool.query(`SELECT employees.id, CONCAT(employees.first_name, ' ', employees.last_name) AS name FROM employees;`);
    const choices = rows.map(({ id, name }) => (
      {
        name: name,
        value: id
      }
    ));
    return choices;
  }

  async getRoles() {
    const { rows } = await pool.query(`SELECT roles.id, roles.title FROM roles;`);
    // console.log(rows);
    const choices = rows.map(({ id, title }) => (
      {
        name: title,
        value: id
      }
    ));
    return choices;
  }

  async updateEmpRole() {
    const employees = await this.getEmps();
    const roles = await this.getRoles();

    inquirer.prompt([
      {
        type: 'list',
        message: 'Employee:',
        choices: employees,
        name: 'employee'
      },
      {
        type: 'list',
        message: 'New Role:',
        choices: roles,
        name: 'role'
      },
    ])
      .then((res) => {
        // console.log(res);
        const { role, employee } = res;

        const queryObj = {
          async editQuery5(sql, params) {
            try {
              const data = await pool.query(sql, params);
              console.log(`\n${JSON.stringify(data.rowCount)} employee ${data.command.toLowerCase()}d.\n`);
              return data;
            }
            catch (err) {
              throw new Error(err);
            }
          }
        }
        const params = [role, employee];
        const sql = `UPDATE employees SET role_id= $1 WHERE employees.id = $2`;
        return queryObj.editQuery5(sql, params);
      })
      .then((res) => {
        // console.log(res);
        const sql2 = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS all_employees, roles.title FROM employees JOIN roles ON employees.role_id = roles.id;`;
        this.selectQuery(sql2);
        setTimeout(() => this.run(), 1000);
      })
      .catch((err) => console.log(err));
  }

  async removeEmp() {
    const employees = await this.getEmps();
    inquirer.prompt([
      {
        type: 'list',
        message: 'Employee:',
        choices: employees,
        name: 'employee'
      },
      {
        type: 'confirm',
        message: 'Are you sure?',
        name: 'confirm'
      }
    ])
      .then((res) => {
        const { employee, confirm } = res;
        if (confirm) {
          const sql = `DELETE FROM employees WHERE employees.id = ${employee};`
          return this.selectQuery(sql);
        } else {
          console.log('No employees deleted.');
          setTimeout(() => this.run(), 1000);
        }
      })
      .then((data) => {
        console.log(`\n${JSON.stringify(data.rowCount)} employee ${data.command.toLowerCase()}d.\n`);
        const sql2 = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS all_employees, roles.title FROM employees JOIN roles ON employees.role_id = roles.id;`;
        this.selectQuery(sql2);
        setTimeout(() => this.run(), 1000);
      })
      .catch((err) => console.log(err));
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
      .catch((err) => console.log(err));
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
      .catch((err) => console.log(err));
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
      .then((res) => this.removeRole2(res))
      .catch((err) => console.log(err));
  }

  async removeRole2(res) {
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
      .catch((err) => console.log(err));
  }

  viewManagers() {
    console.log(`\n Department Managers:\n`);
    const sql = `SELECT e.id AS employee_id, CONCAT(e.first_name, ' ', e.last_name) AS employee_name,  d.dept_name AS department FROM employees e JOIN  roles r ON e.role_id = r.id JOIN departments d ON r.dept_id = d.id WHERE e.manager_id IS NULL;`;
    this.selectQuery(sql);
    // console.log(param);
    setTimeout(() => this.run(), 1000);
  }

  viewEmpByManager() {
    console.log(`\n Employees by manager:\n`);
    const sql = `SELECT CONCAT(m.first_name, ' ', m.last_name) AS manager,
    CONCAT(e.first_name, ' ', e.last_name) AS employee FROM employees e JOIN employees m ON e.manager_id = m.id;`;
    this.selectQuery(sql);
    // console.log(param);
    setTimeout(() => this.run(), 1000);
  }

  deptBudget() {
    console.log(`\n Labor budget utilized within each department:\n`);
    const sql = `SELECT departments.dept_name AS department, COUNT(employees.id) AS employee_count, SUM(roles.salary) AS utilized_budget FROM departments LEFT JOIN roles ON departments.id = roles.dept_id LEFT JOIN employees ON roles.id = employees.role_id GROUP BY departments.dept_name;`;
    this.selectQuery(sql);
    // console.log(param);
    setTimeout(() => this.run(), 1000);
  }
  async quit() {
    const showBanner = async () => {
      try {
        const data = await fs.readFile('./assets/see-ya.txt', 'utf8');
        console.log(`Have a great day! ✨\n${data}`);
      } catch (err) {
        console.log(err);
      }
    };

    const quitApp = async () => {
      await showBanner();
      process.exit();
    };

    await quitApp();
  }

  run() {
    return inquirer.prompt([
      {
        type: 'list',
        message: "What would you like to do?",
        name: 'task',
        choices: [
          {
            name: 'View All Employees',
            value: 'view-all-employees'
          },
          {
            name: 'View Employees By Department',
            value: 'view-employees-by-dept'
          },
          {
            name: 'Add Employee',
            value: 'add-employee'
          },
          {
            name: 'Update Employee Role',
            value: 'update-employee-role'
          },
          {
            name: 'Remove Employee',
            value: 'delete-employee'
          },
          {
            name: 'View All Departments',
            value: 'view-depts'
          },
          {
            name: 'Add Department',
            value: 'add-dept'
          },
          {
            name: 'Remove Department',
            value: 'remove-dept'
          },
          {
            name: 'View All Roles',
            value: 'view-roles'
          },
          {
            name: 'Add Role',
            value: 'add-role'
          },
          {
            name: 'Update Role Salary',
            value: 'update-salary'
          },
          {
            name: 'Remove Role',
            value: 'delete-role'
          },
          {
            name: 'View Department Managers',
            value: 'view-dept-managers'
          },
          {
            name: 'View All Employees by Manager',
            value: 'view-employees-by-manager'
          },
          {
            name: 'View Utilized Budget by Department',
            value: 'view-budget-use-by-dept'
          },
          {
            name: 'Quit',
            value: 'quit'
          }
        ]
      }
    ])
      .then((res) => {
        // console.log(res);
        const { task } = res;
        return task;
      })
      .then((choice) => {
        switch (choice) {
          case 'view-all-employees':
            this.viewAllEmployees();
            break;
          case 'view-employees-by-dept':
            this.viewEmpsByDept();
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
          case 'view-dept-managers':
            this.viewManagers();
            break;
          case 'view-employees-by-manager':
            this.viewEmpByManager();
            break;
          case 'view-budget-use-by-dept':
            this.deptBudget();
            break;
          case 'quit':
            this.quit();
            break;
          default:
            console.log(`No luck. Try again: \n`);
            this.run();
        }
      })
      .catch((err) => console.log(err));
  }
}

module.exports = CLI;
