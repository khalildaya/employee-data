"use strict";
const ERRORS_PREFIX = "APIOPS";
const {
	NUMBERS,
	STATUS_CODES,
} = require("../constants");

module.exports = Object.freeze({
	OPERATION_NOT_FOUND: {
		statusCode: STATUS_CODES.C404,
		code: `${ERRORS_PREFIX}${NUMBERS.ONE}`,
		message: "API operation not found",
	},
});