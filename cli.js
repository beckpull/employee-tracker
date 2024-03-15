const inquirer = require('inquirer');


class CLI {
  constructor() {
    this.options = [];
  }
  run() {
    return inquirer
      .prompt([
        {   
            type: 'list',
            message: "What would you like to do?",
            choices: ['View all departments', 'View all roles', 'View all employees', 'View employees by dept', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'View managers', 'View employees by manager', "Delete a role",'Delete an employee', 'Delete a department', 'View budget by department'],        
            name: 'task'
        },
        // {
        //   type: 'input',
        //   message: "What text would you like in your logo? You may choose up to 3 (three) characters.",
        //   name: 'text',
        //   validate: function(response) {
        //       if (response.length > 3 || response.length < 1) {
        //           return console.log('Please enter a valid response - do limit your response to three characters.');
        //       } 
        //       return true;
        //   }
        // },
        // {
        //   type: 'input',
        //   message: "Next, what color would you like that text to be? Colors or hexidecimal color reference numbers are valid input.",
        //   name: 'textColor',
        //   validate: function(response) {
        //       if (response.length < 1) {
        //           return console.log('Please enter a color without spaces (or a hexidecimal color reference).');
        //       } 
        //       return true;
        //   }
        // },
        // {
        //   type: 'input',
        //   message: "Next, what color would you like the shape to be? Colors or hexidecimal color reference numbers are valid input. (Do not choose white.)",
        //   name: 'shapeColor',
        //   validate: function(response) {
        //       if (response.length < 1) {
        //           return console.log('Please enter a color without spaces (or a hexidecimal color reference).');
        //       } 
        //       return true;
        //   }
        // }
      ])
      .then((res) => {
        this.options = res;
      })
      .then(() => {})
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }

}

module.exports = CLI;
