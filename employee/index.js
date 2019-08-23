"use strict";

/**
 * A module defining the Employee class which implements IRepository interface 
*/
const fs = require("fs-extra");

// an npm package to lock files since we are not using a database
const lockFile = require('proper-lockFile');

// Setting a default lock file options
// more details at https://www.npmjs.com/package/proper-lockfile#lockfile-options
const defaultLockFileOptions = {
	stale: 5000, // consider the lock stale after 5 seconds
	retries: 5, // try 5 times to acquire a lock on a locked resource
}
const {
	employeeDataFolder,
	employeeIdsFile,
} = require("../config");

// Initialize employee ids file
initEmployeeIdsFile(employeeIdsFile);

// Initialize employee data folder
initEmployeesDataFolder(employeeDataFolder);

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
 * Initialize employees data folder and ids file
*/
Employee.prototype.init = async function() {
	await initEmployeeIdsFile(employeeIdsFile);
	initEmployeesDataFolder(employeeDataFolder);
}
/**
 * Below the methods of IRepository interface are implemented in Employee class
*/

Employee.prototype.create = function() {
	// lock employee ids file to get the next auto-increment for the id
	lockFile.lock(employeeIdsFile)
	.then((release) => {
		// get last auto-increment id
		const {
			value,
		} = fs.readJSONSync(employeeIdsFile);
		this.id = value + 1;
		fs.writeJSONSync(`${employeeDataFolder}/${this.id}.json`, this);
		fs.writeJSONSync(employeeIdsFile, {value: this.id});
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

/**
 * Makes sure there is an employee ids file from which the auto-increment
 * id of employees is retrieved. If ids file does not exist, creates it and
 * initializes the auto-increment value to 0 
 * @param {string} file path of employee ids file,
 * where the auto-increment value of employee id is retrieved from
 * @return {Promise} promise returned by releasing locked file
 * more details at https://www.npmjs.com/package/proper-lockfile#lockfile-options
 */
async function initEmployeeIdsFile(file) {
	// Make sure employee ids data file exists
	fs.ensureFileSync(file);

	try {
		// Lock the ids file to initialize it if needed
		const release = await lockFile.lock(file, defaultLockFileOptions);
		let id = {
			value: 0,
		}
		try {
			fs.readJSONSync(file);
			return release();
		} catch (error) {
			/**
			 * If reading the json failed, that means either
			 * content is not in json format or file is still empty.
			 * Either way we have to initialize the file
			*/
			fs.writeJSONSync(file, id);
			return release();
		}
	} catch (error) {
		console.error("Error acquiring/releasing lock on employee ids file", error);
		// Force unlocking the file
		return lockFile.unlock(file);
	}
}

/**
 * Makes sure employees folder exists
 * @param {string} folder path in which employee data will be stored 
 */
function initEmployeesDataFolder(folder) {
	fs.ensureDirSync(folder);
}