"use strict";
const fs = require("fs-extra");
const lockFile = require('proper-lockFile');
const apiOperations = require("./index");

const config = {
	employeeDataFolder: `${__dirname}/../api-test-data/employees`,
	employeeIdsFile: `${__dirname}/../api-test-data/ids.json`,
	defaultLockFileOptions: {
		stale: 20000, // consider the lock stale after 5 seconds
		retries: 0, // try 5 times to acquire a lock on a locked resource
	},
	apiRootPath: "/",
};

describe("EmployeeService", () => {
	// Empty test folders before and after all tests
	beforeEach(() => {
		// Empty employee ids file
		fs.removeSync(config.employeeIdsFile);
		fs.ensureFileSync(config.employeeIdsFile);

		// Empty all employee data in case any exists
		fs.removeSync(config.employeeDataFolder);
		fs.ensureDirSync(config.employeeDataFolder);
  });
  afterEach(() => {
		// Delete test data folder
    fs.removeSync(config.employeeDataFolder + "/../");
	});
	test("Throws an error when unable to acquire a lock while initializing API operations", async () => {
		let release = "";
		try {
			//acquire a lock on employee ids file
			release = await lockFile.lock(config.employeeIdsFile);
			await apiOperations.init(config);

			// The code below should never execute since the above will throw an error
			expect(false).toBeTruthy();
		} catch (error) {
			// Unlock employee ids file
			await release();
			expect(error).toMatchObject({
				"code": "EMP3",
				"message": "Unable to acquire file lock",
				"details": {
					// Current directory full path will differ on different machines
					// as a result expecting only path to contain "api-test-data\ids.json"
					"file": expect.stringContaining("/api-test-data/ids.json"),
					"error": {
						"code": "ELOCKED",
						"file": expect.stringContaining("\\api-test-data\\ids.json"),
					}
				}
			});
		}
	});

	test("Throws an error when creating an employee with an already existing id", async () => {
		try {
			await apiOperations.init(config);

			// Simulate creating an employee
			fs.createFileSync(`${config.employeeDataFolder}/1.json`);
			
			// try to create an employee which will have id 1
			await apiOperations.executeOperation("post-/employee", {
				fullName: "Iron man"
			});

			// The code below should never execute since the above will throw an error
			expect(false).toBeTruthy();
		} catch (error) {
			// Remove the file used to simulate creating an employee
			fs.removeSync(`${config.employeeDataFolder}/1.json`);
			expect(error).toMatchObject({
				"statusCode": 400,
				"code": "EMP5",
				"message": "Employee already exists",
				"details": {
					"id": 1
				}
			});
		}
	});

	test("Throws an error when unable to acquire a lock while executing create employee API operation", async () => {
		let release = "";
		try {
			await apiOperations.init(config);

			//acquire a lock on employee ids file
			release = await lockFile.lock(config.employeeIdsFile);

			// try to create an employee
			await apiOperations.executeOperation("post-/employee", {
				fullName: "Spider man"
			});

			// The code below should never execute since the above will throw an error
			expect(false).toBeTruthy();
		} catch (error) {
			// Unlock employee ids file
			await release();
			expect(error).toMatchObject({
				"code": "EMP3",
				"message": "Unable to acquire file lock",
				"details": {
					// Current directory full path will differ on different machines
					// as a result expecting only path to contain "api-test-data\ids.json"
					"file": expect.stringContaining("/api-test-data/ids.json"),
					"error": {
						"code": "ELOCKED",
						"file": expect.stringContaining("\\api-test-data\\ids.json"),
					}
				}
			});
		}
	});
});