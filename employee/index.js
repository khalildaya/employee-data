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
	initEmployeeDataFolder(config.employeeDataFolder);
	await initEmployeeIdsFile(config.employeeIdsFile);
}
/**
 * Below the methods of IRepository interface implemented in EmployeeService class
*/

/**
 * Creates an employee.
 * @param {object} employee object holding employee properties
 * @return {Promise} On success, returns a resolved promise holding employee's auto-incremented id.
 * On failure, throws an error.
*/
EmployeeService.prototype.create = async function(employee) {
	// Try to lock employee ids file to get the next auto-increment for the id
	let release = await acquireFileLock(_employeeIdsFile);
	try {
		// get last auto-increment id
		const {
			value,
		} = await fs.readJSON(_employeeIdsFile);

		// Assign auto-increment id to employee
		employee.id = value + NUMBERS.ONE;

		// Check if employee exists
		if (employeeExists(employee)) {
			throw Object.assign(ERRORS.EMPLOYEE_ALREADY_EXISTS, {
				details: {
					id: employee.id,
				}
			});
		}

		// Create employee file i.e. store employee
		await fs.writeJSON(`${_employeeDataFolder}/${employee.id}.json`, employee);

		// Set last used employee id to current employee id
		await fs.writeJSON(_employeeIdsFile, {value: employee.id});
		await release();
		return employee.id;
	} catch (error) {
		// Unlock ids file
		await release();
		if (error && error.code && error.code === ERRORS.EMPLOYEE_ALREADY_EXISTS.code) {
			throw error;
		}
		throw Object.assign(ERRORS.CREATE_EMPLOYEE_ERROR, {
			details: {
				error,
			}
		});
	}
}

/**
 * Retrieves and employee
 * @param {number} employeeId id of employee to retrieve
 * @return {Promise} returns a resolve promise holding employee data on success, otherwise throws an error.
*/
EmployeeService.prototype.read = function(employeeId) {
	// throw an error if employee does not exist
	if (!employeeExists({id: employeeId})) {
		throw Object.assign(ERRORS.EMPLOYEE_NOT_FOUND, {
			details: {
				id: employeeId,
			}
		});
	}
	const file = `${_employeeDataFolder}/${employeeId}.json`;
	return fs.readJSONSync(file);
}

/**
 * Updates an employee.
 * @param {object} employee employee to update
 * @return {boolean} returns true if employee was updated successfully. Throws an error otherwise 
*/
EmployeeService.prototype.update = async function(employee) {
	// throw an error if employee does not exist
	if (!employeeExists(employee)) {
		throw Object.assign(ERRORS.EMPLOYEE_NOT_FOUND, {
			details: {
				id: employee.id
			}
		});
	}
	const file = `${_employeeDataFolder}/${employee.id}.json`;
	// lock employee file to update employee
	let release = await acquireFileLock(file);
	try {
		// Update employee file
		await fs.writeJSON(`${_employeeDataFolder}/${employee.id}.json`, employee);

		await release();
		return true;
	} catch (error) {
		// Unlock ids file
		await release();
		throw Object.assign(ERRORS.UPDATE_EMPLOYEE_ERROR, {
			details: {
				error,
			}
		});
	}
}

/**
 * Deletes an employee.
 * @param {number} employeeId id of employee to delete
 * @return {Promise} On success, returns resolved promise holding true.
 * On failure, returns a rejected promise.
*/
EmployeeService.prototype.delete = async function(employeeId) {
	// throw an error if employee does not exist
	if (!employeeExists({id: employeeId})) {
		throw Object.assign(ERRORS.EMPLOYEE_NOT_FOUND, {
			details: {
				id: employeeId
			}
		});
	}
	const file = `${_employeeDataFolder}/${employeeId}.json`;
	// lock employee file to delete employee
	let release = await acquireFileLock(file);
	try {
		// Delete employee file
		await fs.remove(`${_employeeDataFolder}/${employeeId}.json`);

		await release();
		return true;
	} catch (error) {
		// Unlock ids file
		await release();
		throw Object.assign(ERRORS.DELETE_EMPLOYEE_ERROR, {
			details: {
				error,
			}
		});
	}
}

/**
 * Retrieves a list of items.
 * @return {Promise} Returns a promise holding an array fo items on success.
 * Otherwise throws an error 
*/
EmployeeService.prototype.list = function() {
	/**
	 * We can ready all the files under employee data folder in a synchronous way,
	 * however, to take advantage of Node.js very good asynchronous I/O performance,
	 * we'll read the file in an asynchronous manner.
	*/
	return new Promise((resolve, reject) => {
		const temp = [];
		fs.readdir(_employeeDataFolder, (err, files) => {
			if (err) {
				reject(err);
				return;
			}
			const promises = files.map(file => {
				return new Promise((resolve, reject) => {
					fs.readJSON(`${_employeeDataFolder}/${file}`)
					.then(employee => {
						temp[employee.id] = employee;
						resolve();
					})
					.catch(error => {
						reject(error);
					});
				});
			})
			Promise.all(promises)
			.then(() => {
				// Remove any indexes of the array that contain no employees
				// for example, if an employee with id 30 has been deleted, then temp[30] in the above will be undefined
				const result = [];
				temp.forEach(employee => {
					if (employee !== undefined) {
						result.push(employee);
					}
				});
				resolve(result);
			})
			.catch(error => {
				reject(error);
			});
		});
	});
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
	// Make sure EmployeeService ids data file exists
	fs.ensureFileSync(file);
	
	// Lock the ids file to initialize it if needed
	let release = await acquireFileLock(file, _defaultLockFileOptions);
	try {
		let id = {
			value: 0,
		}
		try {
			fs.readJSONSync(file);
			await release();
		} catch (error) {
			/**
			 * If reading the json failed, that means either
			 * content is not in json format or file is still empty.
			 * Either way we have to initialize the file
			*/
			fs.writeJSONSync(file, id);
			await release();
		}
	} catch (error) {
		// Force unlocking the file but still throw an error to the outer scope
		// since application cannot start up if ids file could not be initialized
		await release();

		throw Object.assign(ERRORS.INIT_EMPLOYEE_IDS_ERROR, {
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

/**
 * Attempts to lock a file. If fails throws an error
 * @param {string} file path of file to lock
 * @param {object} options options to pass to lockFile as defined in proper-lockfile
 * @return {Promise} Promise to release file if locking the file succeeded.
 * Otherwise throws an error.
 */
async function acquireFileLock(file, options) {
	// Try to lock the file
	let release = null;
	try {
		release = await lockFile.lock(file, options);
	} catch (error) {
		throw Object.assign(ERRORS.COULD_NOT_ACQUIRE_FILE_LOCK, {
			details: {
				file,
				error,
			}
		});
	}
	return release;
}

/**
 * checks if an employee already exists
 * @param {object} employee employee for which ti check existence
 * @return {boolean} true if employee exists, false otherwise
 */
function employeeExists(employee) {
	return fs.pathExistsSync(`${_employeeDataFolder}/${employee.id}.json`);
}