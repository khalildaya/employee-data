"use strict";
const Employee = require("./index");

describe("Employee", () => {
	test("Successfully create an Employee object", () => {
		const employee = new Employee();
		employee.create();
		employee.read();
		employee.create();
		employee.list();
		employee.delete();
		employee.delete();
	});
});