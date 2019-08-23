"use strict";
const IRepository = require("./index");

describe("IRepository", () => {
	test("Throw an error when trying to call a method directly on IRepository interface", () => {
		const obj = new IRepository();
		try {
			obj.create();

			// The line of code below should never run since the above code will throw an error
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject({
				"code": "REPIMP1",
				"message": "Method not implemented",
				"method": "create"
			});
		}
	});
});