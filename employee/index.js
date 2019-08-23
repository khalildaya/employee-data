"use strict";

/**
 * A module defining the Employee class which implements IRepository interface 
*/
const fs = require("fs-extra");

// an npm package to lock files since we are not using a database
const lockFile = require('proper-lockFile');

const {
	employeeDataFolder,
	employeeIdsFile,
} = require("../config");

// Initialize employee ids file
initEmployeeIdsFile(employeeIdsFile);

// Make sure employee data folder exists
fs.ensureDirSync(employeeDataFolder);

const IRepository = require("../IRepository");

module.exports = Employee;

/**
 * Employee class which will implement the IRepository interface
 */
function Employee(fullName, age, cityCode, salary, email) {
	IRepository.call(this);
	this.age = age;
	this.fullName = fullName;
	this.cityCode = cityCode;
	this.salary = salary;
	this.email = email;
}

/**
 * Since JavaScript uses prototypical inheritance, Employee class implements IRepository by
 * assigning the prototype of IRepository to Employee. However that overrides the prototype constructor
 * of Employee to be IRepository function which should not be the case,
 * so we'll set the constructor of Employee prototype back to Employee function.
 * The following code illustrates this
 * more details at https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance
*/
Employee.prototype = Object.create(IRepository.prototype);
Employee.prototype.constructor = Employee;

/**
 * Below the methods of IRepository interface are implemented in Employee class
*/

Employee.prototype.create = function() {
	lockFile.lock(employeeIdsFile)
	.then((release) => {
			return release();
	})
	.catch((e) => {
			console.error("Error acquiring/releasing lock on employee ids file", e);
			return lockFile.unlock(employeeIdsFile);
	});
	return true;
}

Employee.prototype.read = function() {
	return true;
}

Employee.prototype.update = function() {
	return true;
}

Employee.prototype.delete = function() {
	return true;
}

Employee.prototype.list = function() {
	return true;
}

function initEmployeeIdsFile(employeeIdsFile) {
	// Make sure employee ids data file exists
	fs.ensureFileSync(employeeIdsFile);

	// Lock the ids file to initialize it if needed
	lockFile.lock(employeeIdsFile)
	.then((release) => {
		let id = {
			value: 0,
		}
		try {
			fs.readJSONSync(employeeIdsFile);
			return release();
		} catch (error) {
			/**
			 * If reading the json failed, that means either
			 * content is not in json format or file is still empty.
			 * Either way we have to initialize the file
			*/
			fs.writeJSONSync(employeeIdsFile, id);
			return release();
		}
	})
	.catch((e) => {
			console.error("Error acquiring/releasing lock on employee ids file", e);
			// Force unlocking the file
			return lockFile.unlock(employeeIdsFile);
	});
}