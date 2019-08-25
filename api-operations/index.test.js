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
		let release = null;
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
		let release = null;
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

	test("Throws an error when trying to retrieve a non-existing employee", async () => {
		try {
			await apiOperations.init(config);
			
			// try to create an employee which will have id 1
			await apiOperations.executeOperation("get-/employee", 34);

			// The code below should never execute since the above will throw an error
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject({
				"code": "EMP4",
				"message": "Employee not found",
				"details": {
					"id": 34
				},
				"statusCode": 404
			});
		}
	});

	test("Throws an error when trying to update a non-existing employee", async () => {
		try {
			await apiOperations.init(config);
			
			// try to update an employee with id 124
			await apiOperations.executeOperation("put-/employee", {
				id: 124,
				fullName: "Spider man"
			});

			// The code below should never execute since the above will throw an error
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject({
				"code": "EMP4",
				"message": "Employee not found",
				"details": {
					"id": 124
				},
				"statusCode": 404
			});
		}
	});

	test("Throws an error when unable to acquire a lock while executing update employee API operation", async () => {
		let release = null;
		let employeeId = -1;
		try {
			await apiOperations.init(config);

			// create an employee
			employeeId = await apiOperations.executeOperation("post-/employee", {
				fullName: "Spider man"
			});

			//acquire a lock on employee file
			release = await lockFile.lock(`${config.employeeDataFolder}/${employeeId}.json`);

			// try to update an employee
			await apiOperations.executeOperation("put-/employee", {
				id: employeeId,
				fullName: "Bat man"
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
					"file": expect.stringContaining(`/api-test-data/employees/${employeeId}.json`),
					"error": {
						"code": "ELOCKED",
						"file": expect.stringContaining(`\\api-test-data\\employees\\${employeeId}.json`),
					}
				},
				"statusCode": 500
			});
		}
	});

	test("Throws an error when trying to delete a non-existing employee", async () => {
		try {
			await apiOperations.init(config);
			
			// try to create an employee which will have id 1
			await apiOperations.executeOperation("delete-/employee", 36);

			// The code below should never execute since the above will throw an error
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject({
				"code": "EMP4",
				"message": "Employee not found",
				"details": {
					"id": 36
				},
				"statusCode": 404
			});
		}
	});

	test("Throws an error when unable to acquire a lock while executing delete employee API operation", async () => {
		let release = null;
		let employeeId = -1;
		try {
			await apiOperations.init(config);

			// create an employee
			employeeId = await apiOperations.executeOperation("post-/employee", {
				fullName: "Spider man"
			});

			//acquire a lock on employee file
			release = await lockFile.lock(`${config.employeeDataFolder}/${employeeId}.json`);

			// try to delete an employee
			await apiOperations.executeOperation("delete-/employee", employeeId);

			// The code below should never execute since the above will throw an error
			expect(false).toBeTruthy();
		} catch (error) {
			// Unlock employee ids file
			await release();
			expect(error).toMatchObject({
				"code": "EMP3",
				"message": "Unable to acquire file lock",
				"details": {
					"file": expect.stringContaining(`/api-test-data/employees/${employeeId}.json`),
					"error": {
						"code": "ELOCKED",
						"file": expect.stringContaining(`\\api-test-data\\employees\\${employeeId}.json`),
					}
				},
				"statusCode": 500
			});
		}
	});

	test("Successfully creates an employee", async () => {
		await apiOperations.init(config);
		await apiOperations.executeOperation("post-/employee", {
			fullName: "Iron man"
		});
		await apiOperations.executeOperation("post-/employee", {
			fullName: "Super man"
		});
		await apiOperations.executeOperation("post-/employee", {
			fullName: "Wonder woman"
		});

		const employee = await apiOperations.executeOperation("get-/employee", 3);
		
		expect(employee).toEqual({
			id: 3,
			fullName: "Wonder woman"
		});
	});

	test("Successfully reads an employee", async () => {
		await apiOperations.init(config);
		await apiOperations.executeOperation("post-/employee", {
			fullName: "Iron man"
		});
		await apiOperations.executeOperation("post-/employee", {
			fullName: "Super man"
		});
		await apiOperations.executeOperation("post-/employee", {
			fullName: "Wonder woman"
		});

		await apiOperations.executeOperation("post-/employee", {
			fullName: "Thor"
		});

		const employee = await apiOperations.executeOperation("get-/employee", 2);
		
		expect(employee).toEqual({
			id: 2,
			fullName: "Super man"
		});
	});

	test("Successfully updates an employee", async () => {
		await apiOperations.init(config);
		await apiOperations.executeOperation("post-/employee", {
			fullName: "Iron man"
		});
		await apiOperations.executeOperation("post-/employee", {
			fullName: "Super man"
		});
		await apiOperations.executeOperation("post-/employee", {
			fullName: "Wonder woman"
		});

		await apiOperations.executeOperation("post-/employee", {
			fullName: "Thor"
		});

		const isUpdated = await apiOperations.executeOperation("put-/employee", {
			id: 1,
			fullName: "Tony Starck"
		});
		expect(isUpdated).toBeTruthy();
		
		const employee = await apiOperations.executeOperation("get-/employee", 1);
		expect(employee).toEqual({
			id: 1,
			fullName: "Tony Starck"
		});
	});

	test("Successfully deletes an employee", async () => {
		try {
			await apiOperations.init(config);
			await apiOperations.executeOperation("post-/employee", {
				fullName: "Iron man"
			});
			await apiOperations.executeOperation("post-/employee", {
				fullName: "Super man"
			});
			await apiOperations.executeOperation("post-/employee", {
				fullName: "Wonder woman"
			});

			await apiOperations.executeOperation("post-/employee", {
				fullName: "Thor"
			});

			const isDeleted = await apiOperations.executeOperation("delete-/employee", 4);
			expect(isDeleted).toBeTruthy();
			
			// Try to read a non-existent employee and expect to get a not found error
			await apiOperations.executeOperation("get-/employee", 4);

			// The code below should never execute since the above will throw an error
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject({
				"statusCode": 404,
				"code": "EMP4",
				"message": "Employee not found",
				"details": {
					"id": 4
				}
			});
		}
	
	});
});