"use strict";

const EmployeeService = require("../employee");
const employeeService = new EmployeeService();
const EMPLOYEE_ERRORS = require("../employee/errors");
const API_OPS_ERRORS = require("./errors");
const {
	STATUS_CODES,
} = require("../constants");

const apiOperations = {};

module.exports = Object.freeze({
	init,
	executeOperation,
});

async function init(config) {
	const {
		apiRootPath, // API route path, default is "/"
	} = config;

	// Initialize employee service
	await employeeService.init(config);

	/**
	 * Create api operation key-value store, where key is built as 
	 * <http method>-<path> e.g. post-/api/employee
	 * value is an function to fulfill the intended functionality e.g. creating an employee
	  */
	 apiOperations[`post-${apiRootPath}employee`] = createEmployee;
	 apiOperations[`get-${apiRootPath}employee`] = retrieveEmployee;
	 apiOperations[`put-${apiRootPath}employee`] = updateEmployee;
	 apiOperations[`delete-${apiRootPath}employee`] = deleteEmployee;
	 apiOperations[`get-${apiRootPath}employees`] = listEmployees;
}

/**
 * Executes an api operation.
 * @param {string} operationId api operation id to execute
 * @param {object} request api incoming request
 * @return {Promise} on success, returns a resolved promise holding the result of executed api operation.
 * Otherwise throws an error
*/
async function executeOperation(operationId, request) {
	if (!apiOperations[operationId]) {
		throw Object.assign(API_OPS_ERRORS.OPERATION_NOT_FOUND, {
			operationId,
		});
	}

	/* try {
		// Validate incoming request
		this.requestValidator.validate(request, requestValidationSchemaId);
	} catch (error) {
		if (error.statusCode) {
			throw error;
		}
		throw Object.assign({}, {
			statusCode: RESPONSE_CODES.C400,
			error,
		});
	} */

	// Execute and api operation and return its result
	return apiOperations[operationId](request);
};

/**
 * Creates an employee.
 * @param {object} employee object holding employee properties
 * @return {Promise} On success, returns a resolved promise holding employee's auto-incremented id.
 * On failure, throws an error.
*/
async function createEmployee(employee) {
	try {
		return await employeeService.create(employee);
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
 * @param {number} employeeId id of employee to retrieve
 * @return {object} returns employee data on success otherwise throws an error.
*/
async function retrieveEmployee(employeeId) {
	try {
		return await employeeService.read(employeeId);
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
 * @param {object} employee object holding employee properties
 * @return {Promise} On success, returns a resolved promise holding employee's auto-incremented id.
 * On failure, throws an error.
*/
async function updateEmployee(employee) {
	try {
		return await employeeService.update(employee);
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
 * @param {number} employeeId id of employee to delete
 * @return {Promise} On success, returns resolved promise holding true.
 * On failure, returns a rejected promise.
*/
async function deleteEmployee(employeeId) {
	try {
		return await employeeService.delete(employeeId);
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