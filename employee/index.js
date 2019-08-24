"use strict";

/**
 * A module defining the EmployeeService class which implements IRepository interface
*/

const fs = require("fs-extra");

// an npm package to lock files since we are not using a database
const lockFile = require('proper-lockFile');
const ERRORS = require("./errors");
const {
	NUMBERS,
} = require("../constants");
const IRepository = require("../IRepository");

let _employeeIdsFile = "";
let _employeeDataFolder = "";
let _defaultLockFileOptions = {};

module.exports = EmployeeService;

/**
 * EmployeeService class which will implement the IRepository interface
 */
function EmployeeService() {
	IRepository.call(this);
}

/**
 * Since JavaScript uses prototypical inheritance, EmployeeService class implements IRepository by
 * assigning the prototype of IRepository to EmployeeService. However that overrides the prototype constructor
 * of EmployeeService to be IRepository function which should not be the case,
 * so we'll set the constructor of EmployeeService prototype back to EmployeeService function.
 * The following code illustrates this
 * more details at https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance
*/
EmployeeService.prototype = Object.create(IRepository.prototype);
EmployeeService.prototype.constructor = EmployeeService;

/**
 * Initialize EmployeeServices data folder and ids file
*/
EmployeeService.prototype.init = async function(config) {
	_employeeIdsFile = config.employeeIdsFile;
	_employeeDataFolder = config.employeeDataFolder;
	// Setting a default lock file options
	// more details at https://www.npmjs.com/package/proper-lockfile#lockfile-options
	_defaultLockFileOptions = config.defaultLockFileOptions;
	await initEmployeeIdsFile(config.employeeIdsFile);
	initEmployeeDataFolder(config.employeeDataFolder);
}
/**
 * Below the methods of IRepository interface implemented in EmployeeService class
*/

/**
 * Creates an employee.
 * @param {object} employee object holding employee properties
 * @return {Promise} On success, returns resolved promise holding
 * employee's auto-incremented id. On failure, returns a rejected promise.
*/
EmployeeService.prototype.create = async function(employee) {
	// Try to lock employee ids file to get the next auto-increment for the id
	let release = null;
	try {
		release = await lockFile.lock(_employeeIdsFile);
	} catch (error) {
		throw Object.assign(ERRORS.EMPLOYEE_IDS_NO_LOCK, {
			details: {
				error,
			}
		});
	}
	try {
		// get last auto-increment id
		const {
			value,
		} = await fs.readJSON(_employeeIdsFile);

		// Assign auto-increment id to employee
		employee.id = value + NUMBERS.ONE;

		// Create employee file i.e. store employee
		await fs.writeJSON(`${_employeeDataFolder}/${employee.id}.json`, employee);

		// Set last used employee id to current employee id
		await fs.writeJSON(_employeeIdsFile, {value: employee.id});
		return release();
	} catch (error) {
		// Unlock ids file
		await lockFile.unlock(_employeeIdsFile);
		throw Object.assign(ERRORS.CREATE_EMPLOYEE_ERROR, {
			details: {
				error,
			}
		});
	}
}

EmployeeService.prototype.read = function() {
	return true;
}

EmployeeService.prototype.update = async function(employee) {
	const file = `${_employeeDataFolder}/${employee.id}.json`;
	try {
		// lock employee file to update employee
		const release = await lockFile.lock(file);

		// Update employee file
		await fs.writeJSON(`${_employeeDataFolder}/${employee.id}.json`, employee);

		return release();
	} catch (error) {
		// Unlock ids file
		await lockFile.unlock(file);
		throw Object.assign(ERRORS.UPDATE_EMPLOYEE_ERROR, {
			details: {
				error,
			}
		});
	}
}

EmployeeService.prototype.delete = function() {
	return true;
}

EmployeeService.prototype.list = function() {
	return true;
}

/**
 * Makes sure there is an EmployeeService ids file from which the auto-increment
 * id of EmployeeServices is retrieved. If ids file does not exist, creates it and
 * initializes the auto-increment value to 0 
 * @param {string} file path of EmployeeService ids file,
 * where the auto-increment value of EmployeeService id is retrieved from
 * @return {Promise} promise returned by releasing locked file
 * more details at https://www.npmjs.com/package/proper-lockfile#lockfile-options
 */
async function initEmployeeIdsFile(file) {
	try {
		// Make sure EmployeeService ids data file exists
		fs.ensureFileSync(file);

		// Lock the ids file to initialize it if needed
		const release = await lockFile.lock(file, _defaultLockFileOptions);
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
		// Force unlocking the file but still throw an error to the outer scope
		// since application cannot start up if ids file could not be initialized
		await lockFile.unlock(file);

		throw Object.assign(ERRORS.INIT_EmployeeService_IDS_ERROR, {
			details: {
				error,
			}
		});
	}
}

/**
 * Makes sure EmployeeServices folder exists
 * @param {string} folder path in which EmployeeService data will be stored 
 */
function initEmployeeDataFolder(folder) {
	fs.ensureDirSync(folder);
}