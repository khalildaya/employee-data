"use strict";
/**
 * A module that validates the format of incoming api requests
 * base on ajv https://www.npmjs.com/package/ajv
*/
const Ajv = require("ajv");
const ERRORS = require("./errors");

module.exports = ApiRequestValidator;

/**
 * Constructor for ApiRequestValidator
 * @param {array} schemas array of api request schema definitions
 * @param {object} ajvOptions options passed to create underlying ajv object. See
 * https://www.npmjs.com/package/ajv#options for more details
 */
function ApiRequestValidator(schemas, ajvOptions = {}) {
	const options = JSON.parse(JSON.stringify(ajvOptions));
	options.schemas = schemas;
	this.ajv = new Ajv(options);
}

/**
 * Validates the format of an incoming api request
 * @param {string} schemaId id of schema to validate json object
 * @param {object} apiRequest api request to validate
 * @return {boolean} returns true if incoming api request is in a valid format.
 * Otherwise, throws an error
*/
ApiRequestValidator.prototype.validate = function(schemaId, apiRequest) {
	const validateApiRequest = this.ajv.getSchema(schemaId);
	if (validateApiRequest === undefined) {
		throw Object.assign(ERRORS.SCHEMA_ID_NOT_FOUND, {
			details: {
				schemaId,
			},
		});
	}
	const isValid = validateApiRequest(apiRequest);
	if (!isValid) {
		const {
			errors,
		} = validateApiRequest;
		throw errors;
	}
	return true;
};

