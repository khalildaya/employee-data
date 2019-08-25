"use strict";

const employeeOperations = require("./employee");
const API_OPS_ERRORS = require("./errors");
const {
	STATUS_CODES,
} = require("../constants");

let apiOperations = {};

module.exports = Object.freeze({
	init,
	executeOperation,
});

async function init(config) {
	
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
