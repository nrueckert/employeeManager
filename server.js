const mysql = require('mysql2')
const inquirer = require('inquirer')
require('dotenv').config()

const db = mysql.createConnection ({
    host: 'localhost',
    user: process.env.USER,
    password: process.env.PW,
    database: process.env.DB
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected");
    viewData()
})


function viewAllDepartments(){
    let query = `Select * from departments`
    db.query(query, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.table(res);
        }
        viewData()    
    })
};
        
function viewAllRoles(){
    let query = `Select * from roles`
    db.query(query, (err, res) => {
        if(err){
           console.log(err)
        } else {
        console.table(res)
        }
        viewData()
    })
 };
        
function viewAllEmployees(){
    let query = `Select * from employees`
    db.query(query, (err, res) => {
        if(err){
          console.log(err)
        } else {
        console.table(res)
        }
        viewData()
    })
};

function addDepartment(){
    inquirer
        .prompt({
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the department.'
        })
    
        .then((answer) => {
            let query = `INSERT INTO departments (name) VALUES ('${answer.departmentName}')`
            db.query(query, (err, res) => {
                if(err){
                    console.log(err)
                } else {
                console.log('New Department Added!')
                }
                viewData()
            })
        })
}


function addEmployee(){
    let query = "select * from roles";
    db.query(query, (err, res) => {
        if(err){
            console.log(err)
        } else {
            inquirer
                .prompt([
                    {
                        type:'input',
                        name:'firstName',
                        message: 'Enter the employees first name',
                    },
                    {
                        type:'input',
                        name:'lastName',
                        message: 'Enter the employees last name',
                    },
                    {
                        type:'list',
                        name:'title',
                        message: 'Select the employees job',
                        choices: res.map(({id, title}) => ({name:title, value:id}))
                    }
                ])
                .then((answers) => {
                    let query = `INSERT INTO employees (firstName, lastName, role_id) VALUES ('${answers.firstName}, ${answers.lastName}, ${answers.title}')` 
                    db.query(query, (err, res) => {
                        if(err){
                            console.log(err)
                        } else {
                            console.log('Employee Added')
                        }
                        viewData()
                    })
                })
            }
        })
    };
    
function updateEmployee() {
    let query = 'SELECT * FROM employees'
    db.query(query, (err, res) => {
            if(err){
                console.log(err)
            } else {
                inquirer
                    .prompt([
                        {
                            type:'list',
                            name:'selectedEmployee',
                            message:'Select the employee to change',
                            choices:
                                res.map(({id, firstName, lastName}) => ({name:firstName + ' ' + lastName, value:id}))
                                
                            
                        },
                        {
                            type:'list',
                            name:'doToEmployee',
                            message:'What would you like to update about the employee?',
                            choices: [
                                'Change First Name',
                                'Change Last Name',
                                'Change Job',
                                'Remove Employee',
                                'Return to Menu'
                            ]
                        }
                    ])
                    
                    .then((answers) => {
                        const employeeToChange = answers.selectedEmployee
                        switch(answers.doToEmployee){
                            case'Return to Menu':
                            updateEmployee()
                            break;

                            
                            case'Remove Employee':
                            let query = `DELETE FROM employees WHERE id = ${employeeToChange}`
                            db.query(query, (err, res) => {
                                if(err){
                                    console.log(err)
                                } else {
                                    console.log('Employee Removed')
                                    viewData()
                                }
                            })
                            break;


                            case'Change First Name':
                                inquirer
                                    .prompt({
                                        type:'input',
                                        name:'firstNameChange',
                                        message:'Type employees first name.'
                                    })
                                    .then((answers) => {
                                        let query = `UPDATE employees SET firstName = '${answers.firstNameChange}' WHERE id = ${employeeToChange}`
                                        db.query(query, (err, res) => {
                                            if(err){
                                                console.log(err)
                                            } else {
                                                console.log('Employee updated')
                                                viewData()
                                            }
                                        })
                                    })
                            break;
                            

                            case'Change Last Name':
                                inquirer
                                    .prompt({
                                        type:'input',
                                        name:'lastNameChange',
                                        message:'Type employees last name.'
                                     })
                                    .then((answers) => {
                                        let query = `UPDATE employees SET lastName = '${answers.lastNameChange}' WHERE id = ${employeeToChange}`
                                        db.query(query, (err, res) => {
                                            if(err){
                                                console.log(err)
                                            } else {
                                                console.log('Employee Updated')
                                                viewData()
                                            }
                                        })
                                    })
                            break;
                            case'Change Job':
                            let jobQuery = 'SELECT * FROM roles'
                            db.query(jobQuery, (err, res) => {
                                if(err){
                                    console.log(err)
                                } else{
                                    inquirer
                                        .prompt({
                                            type:'list',
                                            name:'jobChange',
                                            message:'Select the Employees job',
                                            choices: res.map(({id, title}) => ({name:title, value:id}))
                                        })
                                        .then((answers) => {
                                            let query = `UPDATE employees SET roles_id = '${answers.jobChange}' WHERE id = ${employeeToChange}`
                                            db.query(query, (err, res) => {
                                                if(err){
                                                    console.log(err)
                                                } else {
                                                    console.log('Employee Updated')
                                                    updateEmployee()
                                                }
                                            })
                                        })

                                }
                            })
                            break;
                        }           
                    })
            }

    })
}

function addRole() {
    let query = 'SELECT * FROM departments'
    db.query(query, (err, res) => {
        if(err){
            console.log(err)
        } else {
            inquirer
                .prompt([
                    {
                        type:'input',
                        name:'title',
                        message:'Enter the roles name'
                    },
                    {
                        type:'number',
                        name:'salary',
                        message:'Enter the salary amount',
                    },
                    {
                        type:'list',
                        name:'department',
                        message:'What department does this role belong to',
                        choices: res.map(({id, name}) => ({name:name, value:id}))
                    }
                ])
                .then((answers) => {
                    let query = `INSERT INTO roles (title, salary, departments_id) VALUES ('${answers.title}', '${answers.salary}', '${answers.department}')`
                    db.query(query, (err, res) => {
                        if(err){
                            console.log(err)
                        } else {
                            console.log('Role Added')
                        }
                        viewData()
                    })
                })
        }
    })
};


const questions = [
    {
        type:'list',
        name:'selection',
        Message:'What would you like to do?',
        choices: 
        [
            'View ALL Departments',
            'View ALL Roles',
            'View ALL Employees',
            'Add a Department',
            'Add a Role',
            'Add an employee',
            'Update an employee'
        ]
        
    }
]


function viewData() {
    inquirer.prompt(questions).then((answer) => {
        console.log(answer.selection)
        if(answer.selection == 'View ALL Departments'){
            viewAllDepartments()
        } else if (answer.selection == 'View ALL Roles'){
            viewAllRoles()
        } else if (answer.selection == 'View ALL Employees'){
            viewAllEmployees()
        } else if (answer.selection == 'Add a Department'){
            addDepartment()
        } else if (answer.selection == 'Add a Role'){
            addRole()
        } else if (answer.selection == 'Add an employee'){
            addEmployee()
        } else if (answer.selection == 'Update an employee'){
            updateEmployee()
        } else {
            console.log('Status 500')
        }
    })
};

