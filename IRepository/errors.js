"use strict";
const ERRORS_PREFIX = "REPIMP";
const {
	NUMBERS,
} = require("../constants");

module.exports = Object.freeze({
	METHOD_NOT_IMPLEMENTED: {
		code: `${ERRORS_PREFIX}${NUMBERS.ONE}`,
		message: "Method not implemented",
	}
});