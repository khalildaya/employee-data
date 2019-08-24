"use strict";
const ERRORS_PREFIX = "EMP";
const {
	NUMBERS,
} = require("../constants");

module.exports = Object.freeze({
	INIT_EMPLOYEE_IDS_ERROR: {
		code: `${ERRORS_PREFIX}${NUMBERS.ONE}`,
		message: "Error while initializing employee ids file",
	},
	CREATE_EMPLOYEE_ERROR: {
		code: `${ERRORS_PREFIX}${NUMBERS.TWO}`,
		message: "Error while creating employee",
	},
	UPDATE_EMPLOYEE_ERROR: {
		code: `${ERRORS_PREFIX}${NUMBERS.TWO}`,
		message: "Error while updating employee",
	},
	EMPLOYEE_IDS_NO_LOCK: {
		code: `${ERRORS_PREFIX}${NUMBERS.THREE}`,
		message: "Unable to acquire lock on employee ids file",
	}
});