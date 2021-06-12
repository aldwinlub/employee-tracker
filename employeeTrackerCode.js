const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",

    database: "employee_trackerDB"
});

connection.connect((err) => {
    if (err) throw err;
    promptUser();
});

// This function prompts the user with vairous choices to pick from in the Employee Tracker
function promptUser() {
    inquirer
        .prompt([{
            type: "list",
            name: "toDo",
            message: "What would you like to do in the Employee Tracker?",
            choices: [
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "View Departments",
                "View Roles",
                "View Employees",
                "Update Employee Role",
                "End"
            ]
        }])
        .then((answer) => {
            switch (answer.toDo) {
                case "Add a Department":
                    addDepartment();
                    break;
                case "Add a Role":
                    addRole();
                    break;
                case "Add an Employee":
                    addEmployee();
                    break;
                case "View Departments":
                    viewDepartment();
                    break;
                case "View Roles":
                    viewRoles();
                    break;
                case "View Employees":
                    viewEmployees();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "End":
                    connection.end();
                    break;

            }
        });
};

// This function is used to add a Department to the employee_trackerDB
function addDepartment() {
    inquirer
        .prompt([{
                type: "input",
                name: "newDepartment",
                message: "What department would you like to add?"
            }])
        .then((answer) => {
        connection.query(
            "INSERT INTO department SET ?", 
            {
                name: answer.newDepartment
            });
        const query = "SELECT * FROM department";
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.log("The New Department has been successfully added.");
            console.table("All Deparments:", res);
            promptUser();
        })
    })
};

// This function is used to add a Role to the employee_trackerDB
function addRole() {
    connection.query("SELECT * FROM deparment", (err, res) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    type: "input",
                    name: "newRole",
                    message: "Enter a New Role title: "
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Enter the salary of the New Role: "
                },
                {
                    type: "list",
                    name: "Department",
                    choices: () => {
                        const departmentArray =[];
                        for (let i = 0; i < res.length; i++) {
                            departmentArray.push(res[i].name);
                        }
                        return departmentArray;
                    }
                }])
            .then((answer) => {
                let department_id;
                for (let j = 0; j < res.length; j++) {
                    if (res[j].name == answer.Department) {
                        department_id = res[j].id;
                    }
                }
            
            connection.query(
                "INSERT * INTO role SET ?", 
                {
                    title: answer.newRole,
                    salary: answer.salary,
                    department_id: department_id
                },
                (err, res) => {
                    if (err) throw err;
                    console.log("The New Role has been successfully added.")
                });
            })
    })
};

// This function is used to add an Employee to the employee_trackerDB
function addEmployee() {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    type: "input",
                    name: "first_name",
                    message: "Enter Employee's First Name: "
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "Enter Employee's Last Name: "
                },
                {
                    type: "input",
                    name: "manager_id",
                    message: "Enter Employee's Manager ID: "
                },
                {
                    type: "list",
                    name: "newRole",
                    choices: () => {
                    const roleArray = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                        }
                    return roleArray;
                    },
                    message: "Enter Employee's Role: "
                }])
            .then((answer) => {
                let role_id;
                for (let j = 0; j < res.length; j++) {
                    if (res[j].title == answer.newRole) {
                        role_id = res[j].id;
                        console.log(role_id);
                    }
                }
            
            connection.query(
                "INSERT INTO employee SET ?", 
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    manager_id: answer.manager_id,
                    role_id: role_id
                },
                (err) => {
                    if (err) throw err;
                    console.log("The New Employee has been successfully added.");
                    promptUser();
                    })
                })
        })
};

// This function is used to view the Departments of the employee_trackerDB
function viewDepartment() {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) =>{
        if (err) throw err;
        console.table("All Departments: ", res);
        promptUser();
    })
};

// This function is used to view the Roles of the employee_trackerDB
function viewRoles() {
    const query = "SELECT * FROM role";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table("All Roles: ", res);
        promptUser();
    })
};

// This function is used to view the Employees of the employee_trackerDB
function viewEmployees() {
    const query = "SELECT * FROM employee";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(res.length + "Employees Found.");
        console.table("All Employees: ", res);
        promptUser();
    })
};

// function updateEmployeeRole() {

// };