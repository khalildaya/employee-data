"use strict";
/**
 * A module providing employee CRUD operations as plugins to the api operation core
 */
const EmployeeService = require("../../employee");
const employeeService = new EmployeeService();
const EMPLOYEE_ERRORS = require("../../employee/errors");
const {
	STATUS_CODES,
} = require("../../constants");

const apiOperations = {};

module.exports = Object.freeze({
	init,
});

async function init(config) {
	const {
		apiRootPath, // API route path, default is "/"
	} = config;

	// Remove / from the apiRootPath so it works with api request validator
	let prefix = apiRootPath.split("/").join("");

	// Initialize employee service
	await employeeService.init(config);

	/**
	 * Create api operation key-value store, where key is built as 
	 * <http method>-<path> e.g. post-/api/employee
	 * value is an function to fulfill the intended functionality e.g. creating an employee
	*/
	apiOperations[`post-${prefix}employee`] = {
		func: createEmployee,
		method: "post",
		path: `${apiRootPath}employee`
	};
	apiOperations[`get-${prefix}employee`] = {
		func: retrieveEmployee,
		method: "get",
		path: `${apiRootPath}employee/:id`
	};
	apiOperations[`put-${prefix}employee`] = {
		func: updateEmployee,
		method: "put",
		path: `${apiRootPath}employee`
	};
	apiOperations[`delete-${prefix}employee`] = {
		func: deleteEmployee,
		method: "delete",
		path: `${apiRootPath}employee/:id`
	};
	apiOperations[`get-${prefix}employees`] = {
		func: listEmployees,
		method: "get",
		path: `${apiRootPath}employees`
	};

	 return apiOperations;
}

/**
 * Creates an employee.
 * @param {object} apiRequest incoming api request
 * @return {Promise} On success, returns a resolved promise holding employee's auto-incremented id.
 * On failure, throws an error.
*/
async function createEmployee(apiRequest) {
	try {
		return await employeeService.create(apiRequest.body);
	} catch (error) {
		// Add appropriate status code to error response
		if (error) {
			if (error.code === EMPLOYEE_ERRORS.EMPLOYEE_ALREADY_EXISTS.code) {
				throw Object.assign(error, {
					statusCode: STATUS_CODES.C400,
				});
			}

			if (error.code === EMPLOYEE_ERRORS.COULD_NOT_ACQUIRE_FILE_LOCK.code) {
				throw Object.assign(error, {
					statusCode: STATUS_CODES.C500,
				});
			}
		}
		throw error;
	}
}

/**
 * Retrieves and employee
 * @param {object} apiRequest incoming api request
 * @return {object} returns employee data on success otherwise throws an error.
*/
async function retrieveEmployee(apiRequest) {
	try {
		return await employeeService.read(apiRequest.params.id);
	} catch (error) {
		// Add appropriate status code to error response
		if (error) {
			if (error.code === EMPLOYEE_ERRORS.EMPLOYEE_NOT_FOUND.code) {
				throw Object.assign(error, {
					statusCode: STATUS_CODES.C404,
				});
			}
		}
		throw error;
	}
}

/**
 * Creates an employee.
 * @param {object} apiRequest incoming api request
 * @return {Promise} On success, returns a resolved promise holding employee's auto-incremented id.
 * On failure, throws an error.
*/
async function updateEmployee(apiRequest) {
	try {
		return await employeeService.update(apiRequest.body);
	} catch (error) {
		// Add appropriate status code to error response
		if (error) {
			if (error.code === EMPLOYEE_ERRORS.EMPLOYEE_NOT_FOUND.code) {
				throw Object.assign(error, {
					statusCode: STATUS_CODES.C404,
				});
			}

			if (error.code === EMPLOYEE_ERRORS.COULD_NOT_ACQUIRE_FILE_LOCK.code) {
				throw Object.assign(error, {
					statusCode: STATUS_CODES.C500,
				});
			}
		}
		throw error;
	}
}

/**
 * Deletes an employee.
 * @param {object} apiRequest incoming api request
 * @return {Promise} On success, returns resolved promise holding true.
 * On failure, returns a rejected promise.
*/
async function deleteEmployee(apiRequest) {
	try {
		return await employeeService.delete(apiRequest.params.id);
	} catch (error) {
		// Add appropriate status code to error response
		if (error) {
			if (error.code === EMPLOYEE_ERRORS.EMPLOYEE_NOT_FOUND.code) {
				throw Object.assign(error, {
					statusCode: STATUS_CODES.C404,
				});
			}

			if (error.code === EMPLOYEE_ERRORS.COULD_NOT_ACQUIRE_FILE_LOCK.code) {
				throw Object.assign(error, {
					statusCode: STATUS_CODES.C500,
				});
			}
		}
		throw error;
	}
}

/**
 * Retrieves a list of employees.
 * @return {Promise} Returns a promise holding an array of employees on success.
 * Otherwise throws an error 
*/
async function listEmployees() {
	return await employeeService.list();
}