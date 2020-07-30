const connection = require("./connection");
class DB {
    constructor(connection){
        this.connection = connection
    }
    findAllEmployees(){
        return this.connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id")
    }
    findAllDepartments(){
        return this.connection.query("SELECT department.id, department.name, SUM (role.salary) AS budget FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id GROUP BY department.id, department.name;")
    }
    findAllRoles(){
        return this.connection.query("SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;")
    }
    updateEmployeeRole(roleId, employeeId){
        return this.connection.query("UPDATE employee SET role_id = ? WHERE id = ?",[roleId, employeeId])
    }

   createEmployee(employee){
        return this.connection.query("INSERT INTO employee SET ?", employee)
    }

   createRole(role){
        return this.connection.query("INSERT INTO role SET ?", role)
    }
    
    createDepartment(department){
        return this.connection.query("INSERT INTO department SET ?", department)
    }
}
module.exports = new DB(connection);



// SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, from employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;