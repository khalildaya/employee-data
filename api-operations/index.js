"use strict";
/**
 * A module that implements a plugin pattern where plugins are api operations and the core
 * is a small engine that validates the incoming api request and executes the required api operation.
 * employee CRUD operations are an example plugins
 */
const employeeOperations = require("./employee");
const API_OPS_ERRORS = require("./errors");
const ApiRequestValidator = require("./api-request-validator");

const {
	STATUS_CODES,
} = require("../constants");

let apiOperations = {};
let apiRequestValidator = null;

module.exports = Object.freeze({
	init,
	executeOperation,
	ops: apiOperations,
});

async function init(config) {
	const {
		schemas,
		ajvOptions,
	} = config.apiRequestValidatorConfig;

	// Initialize api request validator
	apiRequestValidator = new ApiRequestValidator(schemas, ajvOptions);

	// Initialize employee operations
	const employeeApiOperations = await employeeOperations.init(config);
	apiOperations = Object.assign(apiOperations, employeeApiOperations);
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

	try {
		// Validate incoming request
		apiRequestValidator.validate(operationId, request);
	} catch (error) {
		if (error.statusCode) {
			throw error;
		}
		throw Object.assign({}, {
			statusCode: STATUS_CODES.C400,
			error,
		});
	}

	// Execute and api operation and return its result
	return apiOperations[operationId].func(request);
};
