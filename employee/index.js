"use strict";

/**
 * A module defining the EmployeeService class which implements IRepository interface 
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
const ERRORS = require("./errors");

const IRepository = require("../IRepository");

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
EmployeeService.prototype.init = async function() {
	await initEmployeeIdsFile(employeeIdsFile);
	initEmployeeDataFolder(employeeDataFolder);
}
/**
 * Below the methods of IRepository interface are implemented in EmployeeService class
*/

EmployeeService.prototype.create = function() {
	// lock EmployeeService ids file to get the next auto-increment for the id
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
			console.error("Error acquiring/releasing lock on EmployeeService ids file", e);
			return lockFile.unlock(employeeIdsFile);
	});
	return true;
}

EmployeeService.prototype.read = function() {
	return true;
}

EmployeeService.prototype.update = function() {
	return true;
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
		// Force unlocking the file but still throw an error to the outer scope
		// since application cannot start up if ids file could not be initialized
		lockFile.unlock(file);

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