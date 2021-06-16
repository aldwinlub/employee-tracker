const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'root',

    database: 'employee_trackerDB'
});

connection.connect((err) => {
    if (err) throw err;
    promptUser();
});

// This function prompts the user with vairous choices to pick from in the Employee Tracker
function promptUser() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'initialPrompt',
                message: 'What would you like to do in the Employee Tracker?',
                choices: [
                    'Add a new Department',
                    'Add a new Role',
                    'Add a new Employee',
                    'View Departments',
                    'View Roles',
                    'View Employees',
                    'Update Employee Role',
                    'End'
                ]
            }
        ])
        .then((answers) => {
            switch (answers.initialPrompt) {
                case 'Add a new Department':
                    return addDepartment();
                case 'Add a new Role':
                    return addRole();
                case 'Add a new Employee':
                    return addEmployee();
                case 'View Departments':
                    return viewDepartment();
                case 'View Roles':
                    return viewRoles();
                case 'View Employees':
                    return viewEmployees();
                case 'Update Employee Role':
                    return updateEmployeeRole();
                case 'End':
                    connection.end();
            }
        })
};

// This function is used to add a new Department to the employee_trackerDB
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'newDepartment',
                message: 'What department would you like to add?'
            }
        ])
        .then((res) => {
        connection.query('INSERT INTO department SET ?', 
            {
                name: res.newDepartment
            },
            (err) => {
                if (err) throw err
                console.log('The New Department has been successfully added.');
                promptUser();
            });
        });
};

// This function is used to add a Role to the employee_trackerDB
function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'newRole',
                message: 'Enter a New Role title: '
            },
            {
                type: 'number',
                name: 'salary',
                message: 'Enter the salary of the New Role: '
            },
            {
                type: 'list',
                name: 'Department',
                message: 'Enter the Department for this New Role: ',
                choices: () => {
                    var departmentArray =[];
                    const sqlquery = 'SELECT id, name FROM department';
                    connection.query(sqlquery, (err, res) => {
                        if (err) throw err
                        for (var i = 0; i < res.length; i++) {
                            departmentArray.push(res[i].name);
                        };
                    });
                    return departmentArray;
                }
            }
        ])
        .then((res) => {
            for (let i = 0; i < departmentArray.length; i++) {
                if (res.Department === departmentArray[i])
                var departmentID = i+1;
            }
            connection.query('INSERT INTO role SET ?', 
                {
                    title: res.newRole,
                    salary: res.salary,
                    department_id: departmentID
                },
                (err) => {
                    if (err) throw err
                    console.log('The New Role has been successfully added.');
                    promptUser();
                });          
        });
};

// This function is used to add an Employee to the employee_trackerDB
function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter Employee\'s First Name: '
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter Employee\'s Last Name: '
            },
            {
                type: 'list',
                name: 'role',
                message: 'Enter Employee\'s Role: ',
                choices: () => {
                    var roleArray = [];
                    const sqlquery = 'SELECT id, title FROM role';
                    connection.query(sqlquery, (err, res) => {
                        if (err) throw err
                        for (var i = 0; i < res.length; i++) {
                            roleArray.push(res[i].title);
                        }
                    });
                    return roleArray;
                }
            },
            {
                type: 'list',
                name: 'hasAManager',
                message: 'Does the Employee have a Manager? ',
                choices: ['Yes', 'No']
            },
            {
                type: 'list',
                name: 'nameOfManager',
                message: 'Enter the Manager\'s name: ',
                choices: () => {
                    var employeeArray = [];
                    var sqlquery = 'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name FROM employee';
                    connection.query(sqlquery, (err, res) => {
                        if (err) throw err
                        for (var i = 0; i < res.length; i++) {
                            employeeArray.push(res[i].name);
                        };
                    });
                    return employeeArray;
                },
                when: (res) => res.hasAManager === 'Yes'
            }
        ])
        .then((res) => {
            for (let i = 0; roleArray.length; i++) {
                if (res.role === roleArray[i])
                var roleID = i+1;
            }
            if (res.hasAManager === 'Yes') {
                for (let i = 0; i < employeeArray.length; i++) {
                    if (res.nameOfManager === employeeArray[i])
                    var managerID = i+1;
                }
            } else {
                managerID = null
            }
            connection.query('INSERT INTO employee SET ?',
                {
                    first_name: res.first_name,
                    last_name: res.last_name,
                    role_id: roleID,
                    manager_id: managerID
                },
                (err) => {
                    if (err) throw err
                    console.log('The New Employee has been successfully added.');
                    promptUser();
                }
            );
        });
};


// This function is used to view the Departments of the employee_trackerDB
function viewDepartment() {
    var sqlquery = 'SELECT id, name FROM department ORDER BY id ASC';
    connection.query(sqlquery, (err, res) =>{
        if (err) throw err;
        console.table('All Departments: ', res);
        promptUser();
    })
};

// This function is used to view the Roles of the employee_trackerDB
function viewRoles() {
    var sqlquery = 'SELECT id, title FROM role ORDER BY id ASC';
    connection.query(sqlquery, (err, res) => {
        if (err) throw err;
        console.table('All Roles: ', res);
        promptUser();
    })
};

// This function is used to view the Employees of the employee_trackerDB
function viewEmployees() {
    const sqlquery = 'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name FROM employee';
    connection.query(sqlquery, (err, res) => {
        if (err) throw err;
        console.log('Number of Employees Found: ' + res.length);
        console.table('All Employees: ', res);
        promptUser();
    })
};

// function updateEmployeeRole() {

// };