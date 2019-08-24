"use strict";
const fs = require("fs-extra");
const lockFile = require('proper-lockFile');
const EmployeeService = require("./index");

const config = {
	employeeDataFolder: `${__dirname}/../test-data/employees`,
	employeeIdsFile: `${__dirname}/../test-data/ids.json`,
	defaultLockFileOptions: {
		stale: 20000, // consider the lock stale after 5 seconds
		retries: 0, // try 5 times to acquire a lock on a locked resource
	}
};

describe("EmployeeService", () => {
	// Empty test folders before and after all tests
	beforeAll(() => {
		// Empty employee ids file
		fs.removeSync(config.employeeIdsFile);
		fs.ensureFileSync(config.employeeIdsFile);

		// Empty all employee data in case any exists
		fs.removeSync(config.employeeDataFolder);
		fs.ensureDirSync(config.employeeDataFolder);
  });
  afterAll(() => {
		// Delete test data folder
    fs.removeSync(config.employeeDataFolder + "/../");
  });
	test("Throws an error when unable to acquire a lock on id files", async () => {
		let release = "";
		try {
				const employeeService = new EmployeeService();
				await employeeService.init(config);

				//acquire a lock on employee ids file
				release = await lockFile.lock(config.employeeIdsFile);
				
				// try to create an employee while a lock is present at employee ids file
				await employeeService.create({fullName: "Spiderman"});

				// The code below should never execute since the above will throw an error
				expect(false).toBeTruthy();
		} catch (error) {
			// Unlock employee ids file
			await release();
			expect(error).toMatchObject( {
				"code": "EMP3",
				"message": "Unable to acquire lock on employee ids file",
				"details": {
					"error": {
						"code": "ELOCKED",
						"file": "C:\\Dev\\test\\employee-data\\test-data\\ids.json"
					}
				}
			});
		}
	});
});