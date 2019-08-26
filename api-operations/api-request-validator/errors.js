"use strict";
const ERROR_PREFIX = "APIREQVLD";
const {
	NUMBERS,
} = require("../../constants");

module.exports = Object.freeze({
	SCHEMA_ID_NOT_FOUND: {
		code: `${ERROR_PREFIX}${NUMBERS.ONE}`,
		message: "Schema for provided id not found",
	}
});
