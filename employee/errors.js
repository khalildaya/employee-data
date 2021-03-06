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
	COULD_NOT_ACQUIRE_FILE_LOCK: {
		code: `${ERRORS_PREFIX}${NUMBERS.THREE}`,
		message: "Unable to acquire file lock",
	},
	EMPLOYEE_NOT_FOUND: {
		code: `${ERRORS_PREFIX}${NUMBERS.FOUR}`,
		message: "Employee not found",
	},
	EMPLOYEE_ALREADY_EXISTS: {
		code: `${ERRORS_PREFIX}${NUMBERS.FIVE}`,
		message: "Employee already exists",
	},
	DELETE_EMPLOYEE_ERROR: {
		code: `${ERRORS_PREFIX}${NUMBERS.SIX}`,
		message: "Error while deleting employee",
	},
});