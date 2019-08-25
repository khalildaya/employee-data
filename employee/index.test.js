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
	test("Throws an error when unable to acquire a lock on while initializing EmployeeService", async () => {
		let release = "";
		try {
			//acquire a lock on employee ids file
			release = await lockFile.lock(config.employeeIdsFile);
			const employeeService = new EmployeeService();
			await employeeService.init(config);

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
					// as a result expecting only path to contain "test-data\ids.json"
					"file": expect.stringContaining("/test-data/ids.json"),
					"error": {
						"code": "ELOCKED",
						"file": expect.stringContaining("\\test-data\\ids.json"),
					}
				}
			});
		}
	});
	test("Throws an error when unable to acquire a lock on id files", async () => {
		let release = "";
		try {
			const employeeService = new EmployeeService();
			await employeeService.init(config);

			//acquire a lock on employee ids file
			release = await lockFile.lock(config.employeeIdsFile);
			
			// try to create an employee while a lock is present at employee ids file
			await employeeService.create({fullName: "Spider man"});

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
					// as a result expecting only path to contain "test-data\ids.json"
					"file": expect.stringContaining("/test-data/ids.json"),
					"error": {
						"code": "ELOCKED",
						"file": expect.stringContaining("\\test-data\\ids.json"),
					}
				}
			});
		}
	});

	test("Throws an error when creating an employee with an already existing id", async () => {
		try {
			const employeeService = new EmployeeService();
			await employeeService.init(config);

			// Simulate creating an employee
			fs.createFileSync(`${config.employeeDataFolder}/1.json`);
			
			// try to create an employee which will have id 1
			await employeeService.create({
				fullName: "Iron man"
			});

			// The code below should never execute since the above will throw an error
			expect(false).toBeTruthy();
		} catch (error) {
			// Remove the file used to simulate creating an employee
			fs.removeSync(`${config.employeeDataFolder}/1.json`);
			expect(error).toMatchObject({
				"code": "EMP5",
				"message": "Employee already exists",
				"details": {
					"id": 1
				}
			});
		}
	});

	test("Successfully creates an employee", async () => {
		const employeeService = new EmployeeService();
		await employeeService.init(config);
		await employeeService.create({
			fullName: "Iron man"
		});
		await employeeService.create({
			fullName: "Super man"
		});
		const lastId = await employeeService.create({
			fullName: "Wonder woman"
		});
		expect(lastId).toEqual(3);
	});

	test("Throws an error when retrieving a non-existent employee", async () => {
		try {
			const employeeService = new EmployeeService();
			await employeeService.init(config);
			await employeeService.read(100);
			// The code below should never execute since the above will throw an error
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error).toMatchObject({
				"code": "EMP4",
				"message": "Employee not found",
				"details": {
					"id": 100
				}
			});
		}
	});

	test("Successfully reads an employee", async () => {
		const employeeService = new EmployeeService();
		await employeeService.init(config);
		await employeeService.create({
			fullName: "Iron man"
		});
		await employeeService.create({
			fullName: "Super man"
		});
		await employeeService.create({
			fullName: "Wonder woman"
		});
		const employee = await employeeService.read(3);
		expect(employee).toMatchObject({
			id: 3,
			fullName: "Wonder woman",
		});
	});
});