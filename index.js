  
const { prompt } = require("inquirer");
const db = require("./db");
const { listenerCount, allowedNodeEnvironmentFlags } = require("process");
const { async } = require("rxjs");
const { type } = require("os");
require("console.table");
mainPrompts()
async function mainPrompts(){
    const { choice } = await prompt([
        {
            type: "list",
            name: "choice",
            message: "what would you like to do?",
            choices: [
                {
                    name: "view all employees",
                    value: "VIEW_EMPLOYEES"
                },{
                    name: "view all departments",
                    value: "VIEW_DEPARTMENTS"
                },{
                    name: "view all roles",
                    value: "VIEW_ROLES"
                },{
                    name: "add employee",
                    value: "ADD_EMPLOYEE"
                },{
                    name: "add department",
                    value: "ADD_DEPARTMENT"
                },{
                    name: "add role",
                    value: "ADD_ROLE"
                },{
                    name: "update employee role",
                    value: "UPDATE_ROLE"
                },{
                    name: "quit",
                    value: "QUIT"
                }

            ]
        }
    ])
    switch(choice){
        case "VIEW_EMPLOYEES":
            return viewEmployees();
        case "VIEW_DEPARTMENTS":
            return viewDepartments();
        case "VIEW_ROLES":
            return viewRoles();
        case "ADD_EMPLOYEE":
            return addEmployee();
        case "ADD_DEPARTMENT":
            return addDepartment();
        case "ADD_ROLE":
            return addRole();
        case "UPDATE_ROLE":
            return updateEmployeeRole();
        default:
            return quit();
    }
}
async function viewEmployees(){
    const employees = await db.findAllEmployees()
    console.log("\n");
    console.table(employees);
    mainPrompts();
};
async function viewDepartments(){
    const departments = await db.findAllDepartments()
    console.log("\n");
    console.table(departments);
    mainPrompts();
};
async function viewRoles(){
    const roles = await db.findAllRoles()
    console.log("\n");
    console.table(roles);
    mainPrompts();
};


async function addEmployee() {
    const roles = await db.findAllRoles();
    const employees = await db.findAllEmployees();
    const employee = await prompt([
        {
            name: "first_name",
            message: "what is the employees first name?"

        },{
            name: "last_name",
            message: "what is the employees last name?"
        }
    ])
    const roleChoices = roles.map(({ id, title }) =>({
        name: title,
        value: id
    }))
    const { roleId } = await prompt({
        type: "list",
        name: "roleId",
        message: "what is the employees role?",
        choices: roleChoices
    })
    employee.role_id = roleId;
    const managerChoices = employees.map(({ id, first_name, last_name })=>({
        name: `${first_name} ${last_name}`,
        value: id
    }))
    managerChoices.unshift({ name:"none", value:null })
    const { managerId } = await prompt({
        type: "list",
        name: "managerId",
        message: "who is the employees manager?",
        choices: managerChoices
    })
    employee.manager_id = managerId
    await db.createEmployee(employee)
    console.log("added employee to the database")
    mainPrompts();
}

async function addRole(){
    const department = await db.findAllDepartments()
    const departmentChoices = department.map(({id, name}) => ({
        name: name,
        value: id
    }))
    const role = await prompt([
        {
            name: "title",
            message: "what new role would you like to add?"
        },
        {
            name: "salary",
            message: "How much does this role earn?"
        },
        {
            name: "department_id",
            message: "What department does this role belong to?",
            type: "list",
            choices: departmentChoices
        },
    ])
    await db.createRole(role)
    mainPrompts()
}


async function addDepartment(){
    const department = await prompt([
        {
        name: "name",
        message: "What is the name of the department?"
    }
    ])
    await db.createDepartment(department)
    mainPrompts() 
}


async function updateEmployeeRole(){
    const employees = await db.findAllEmployees()
    const employeeChoices = employees.map(({ id, first_name, last_name}) =>({
        name: `${first_name} ${last_name}`,
        value: id
    }))
    const { employeeId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "which employee role do you want to update?",
            choices: employeeChoices
        }
    ])
    const roles = await db.findAllRoles();
    const roleChoices = roles.map(({ id, title }) =>({
        name: title,
        value: id
    }))
    const { roleId } = await prompt([{
        type: "list",
        name: "roleId",
        message: "which role do you want to assign to the employee?",
        choices: roleChoices
    }])
    await db.updateEmployeeRole(roleId, employeeId)
    console.log("updated employees role")
    mainPrompts()
}
function quit() {
    console.log("quitting application")
    process.exit()
}