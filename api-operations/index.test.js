"use strict";
const fs = require("fs-extra");
const lockFile = require('proper-lockFile');
const apiOperations = require("./index");

"use strict";

const apiRequestSchemas = [
	{
		"$schema": "http://json-schema.org/draft-07/schema#",
		"$id": "post-employee",
		"type": "object",
		"properties": {
			"route": {
				"type": "object",
				"properties": {
					"path": {
						"type": "string",
						"const": "/employee",
					},
				},
				"required": [
					"path",
				],
			},
			"headers": {
				"type": "object",
			},
			"params": {
				"type": "object",
			},
			"body": {
				"$ref": "post-employee-body",
			},
			"method": {
				"type": "string",
				"const": "POST",
			},
		},
		"required": [
			"headers",
			"body",
			"params",
			"method",
		],
	},
	{
		"$schema": "http://json-schema.org/draft-07/schema#",
		"$id": "post-employee-body",
		"type": "object",
		"additionalProperties": false,
		"properties": {
			"fullName": {
				"type": "string",
				"maxLength": 150
			},
			"age": {
				"type": "integer",
				"minimum": 1,
				"maximum": 75
			},
			"cityCode": {
				"type": "string",
				"maxLength": 3
			},
			"email": {
				"type": "string",
				"maxLength": 150,
				"format": "email"
			},
			"salary": {
				"type": "number",
				"minimum": 10,
				"maximum": 10000
			}
		},
		"required": [
			"fullName",
			"age",
			"cityCode",
			"salary"
		],
	},
	{
		"$schema": "http://json-schema.org/draft-07/schema#",
		"$id": "delete-employee",
		"type": "object",
		"properties": {
			"route": {
				"type": "object",
				"properties": {
					"path": {
						"type": "string",
						"const": "/employee/:id",
					},
				},
				"required": [
					"path",
				],
			},
			"headers": {
				"type": "object",
			},
			"params": {
				"type": "object",
				"properties": {
					"id": {
						"type": "integer",
						"minimum": 1
					},
				},
				"required": [
					"id",
				],
			},
			"body": {
			},
			"method": {
				"type": "string",
				"const": "DELETE",
			},
		},
		"required": [
			"headers",
			"body",
			"params",
			"method",
		],
	},
	{
		"$schema": "http://json-schema.org/draft-07/schema#",
		"$id": "put-employee",
		"type": "object",
		"properties": {
			"route": {
				"type": "object",
				"properties": {
					"path": {
						"type": "string",
						"const": "/employee",
					},
				},
				"required": [
					"path",
				],
			},
			"headers": {
				"type": "object",
			},
			"params": {
				"type": "object",
			},
			"body": {
				"$ref": "put-employee-body",
			},
			"method": {
				"type": "string",
				"const": "PUT",
			},
		},
		"required": [
			"headers",
			"body",
			"params",
			"method",
		],
	},
	{
		"$schema": "http://json-schema.org/draft-07/schema#",
		"$id": "put-employee-body",
		"type": "object",
		"additionalProperties": false,
		"properties": {
			"id": {
				"type": "integer",
				"minimum": 1
			},
			"fullName": {
				"type": "string",
				"maxLength": 150
			},
			"age": {
				"type": "integer",
				"minimum": 1,
				"maximum": 75
			},
			"cityCode": {
				"type": "string",
				"maxLength": 3
			},
			"email": {
				"type": "string",
				"maxLength": 150,
				"format": "email"
			},
			"salary": {
				"type": "number",
				"minimum": 10,
				"maximum": 10000
			}
		},
		"required": [
			"id",
			"fullName",
			"age",
			"cityCode",
			"salary"
		],
	},
	{
		"$schema": "http://json-schema.org/draft-07/schema#",
		"$id": "get-employee",
		"type": "object",
		"properties": {
			"route": {
				"type": "object",
				"properties": {
					"path": {
						"type": "string",
						"const": "/employee/:id",
					},
				},
				"required": [
					"path",
				],
			},
			"headers": {
				"type": "object",
			},
			"params": {
				"type": "object",
				"properties": {
					"id": {
						"type": "integer",
						"minimum": 1
					},
				},
				"required": [
					"id",
				],
			},
			"body": {
			},
			"method": {
				"type": "string",
				"const": "GET",
			},
		},
		"required": [
			"headers",
			"body",
			"params",
			"method",
		],
	},
	{
		"$schema": "http://json-schema.org/draft-07/schema#",
		"$id": "get-employees",
		"type": "object",
		"properties": {
			"route": {
				"type": "object",
				"properties": {
					"path": {
						"type": "string",
						"const": "/employees",
					},
				},
				"required": [
					"path",
				],
			},
			"headers": {
				"type": "object",
			},
			"params": {
				"type": "object",
			},
			"body": {
				"type": "object",
			},
			"method": {
				"type": "string",
				"const": "GET",
			},
		},
		"required": [
			"headers",
			"body",
			"params",
			"method",
		],
	},
];

const config = {
	employeeDataFolder: `${__dirname}/../api-test-data/employees`,
	employeeIdsFile: `${__dirname}/../api-test-data/ids.json`,
	defaultLockFileOptions: {
		stale: 20000, // consider the lock stale after 5 seconds
		retries: 0, // try 5 times to acquire a lock on a locked resource
	},
	apiRootPath: "/",
	apiRequestValidatorConfig: {
		schemas: apiRequestSchemas,
	}
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
			const request = {
				path: "/employee",
				headers: {},
				method: "POST",
				query: {},
				params: {},
				body: {
					fullName: "Thor",
					age: 39,
					salary: 10000,
					cityCode: "AGD"
				}
			}
			await apiOperations.init(config);

			// Simulate creating an employee
			fs.createFileSync(`${config.employeeDataFolder}/1.json`);
			
			// try to create an employee which will have id 1
			await apiOperations.executeOperation("post-employee", request);

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
			const request = {
				path: "/employee",
				headers: {},
				method: "POST",
				query: {},
				params: {},
				body: {
					fullName: "Thor",
					age: 39,
					salary: 10000,
					cityCode: "AGD"
				}
			}
			await apiOperations.init(config);

			//acquire a lock on employee ids file
			release = await lockFile.lock(config.employeeIdsFile);

			// try to create an employee
			await apiOperations.executeOperation("post-employee", request);

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
			const request = {
				path: "/employee",
				headers: {},
				method: "GET",
				query: {},
				params: {
					id: 34,
				},
				body: {}
			}
			await apiOperations.init(config);
			
			// try to create an employee which will have id 1
			await apiOperations.executeOperation("get-employee", request);

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
			const request = {
				path: "/employee",
				headers: {},
				method: "PUT",
				query: {},
				params: {},
				body: {
					id: 124,
					fullName: "Spider man",
					age: 39,
					salary: 10000,
					cityCode: "AGD"
				}
			}
			await apiOperations.init(config);
			
			// try to update an employee with id 124
			await apiOperations.executeOperation("put-employee", request);

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
			const request = {
				path: "/employee",
				headers: {},
				method: "POST",
				query: {},
				params: {},
				body: {
					fullName: "Spider man",
					age: 39,
					salary: 10000,
					cityCode: "AGD"
				}
			}
			await apiOperations.init(config);

			// create an employee
			const response = await apiOperations.executeOperation("post-employee", request);
			employeeId = response.employeeId;

			//acquire a lock on employee file
			release = await lockFile.lock(`${config.employeeDataFolder}/${employeeId}.json`);

			request.body.id = employeeId;
			request.method = "PUT";
			// try to update an employee
			await apiOperations.executeOperation("put-employee", request);

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
			const request = {
				path: "/employee",
				headers: {},
				method: "DELETE",
				query: {},
				params: {
					id: 36
				},
				body: {}
			}
			await apiOperations.init(config);
			
			// try to create an employee which will have id 1
			await apiOperations.executeOperation("delete-employee", request);

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
			const request = {
				path: "/employee",
				headers: {},
				method: "POST",
				query: {},
				params: {},
				body: {
					fullName: "Spider man",
					age: 39,
					salary: 10000,
					cityCode: "AGD"
				}
			}
			await apiOperations.init(config);

			// create an employee
			const response = await apiOperations.executeOperation("post-employee", request);
			employeeId = response.employeeId;

			//acquire a lock on employee file
			release = await lockFile.lock(`${config.employeeDataFolder}/${employeeId}.json`);

			// try to delete an employee
			request.body = {};
			request.params.id = employeeId;
			request.method = "DELETE";
			await apiOperations.executeOperation("delete-employee", request);

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
		const request = {
			path: "/employee",
			headers: {},
			method: "POST",
			query: {},
			params: {},
			body: {
				fullName: "Iron man",
				age: 39,
				salary: 10000,
				cityCode: "AGD"
			}
		};
		await apiOperations.init(config);
		await apiOperations.executeOperation("post-employee", request);
		request.body = {
			fullName: "Super man",
			age: 41,
			salary: 9000,
			cityCode: "KPT"
		}
		await apiOperations.executeOperation("post-employee", request);
		request.body = {
			fullName: "Wonder woman",
			age: 32,
			salary: 9000,
			cityCode: "KPT"
		}
		await apiOperations.executeOperation("post-employee", request);
		
		request.method = "GET";
		request.params.id = 3;
		const employee = await apiOperations.executeOperation("get-employee", request);
		
		expect(employee).toEqual({
			id: 3,
			fullName: "Wonder woman",
			age: 32,
			salary: 9000,
			cityCode: "KPT"
		});
	});

	test("Successfully reads an employee", async () => {
		const request = {
			path: "/employee",
			headers: {},
			method: "POST",
			query: {},
			params: {},
			body: {
				fullName: "Iron man",
				age: 39,
				salary: 10000,
				cityCode: "AGD"
			}
		};
		await apiOperations.init(config);
		await apiOperations.executeOperation("post-employee", request);
		request.body = {
			fullName: "Super man",
			age: 41,
			salary: 9000,
			cityCode: "KPT"
		}
		await apiOperations.executeOperation("post-employee", request);
		request.body = {
			fullName: "Wonder woman",
			age: 32,
			salary: 9000,
			cityCode: "KPT"
		}
		await apiOperations.executeOperation("post-employee", request);

		request.body = {
			fullName: "Thor",
			age: 44,
			salary: 10000,
			cityCode: "AGD"
		}
		await apiOperations.executeOperation("post-employee", request);
		
		request.method = "GET";
		request.params.id = 2;
		const employee = await apiOperations.executeOperation("get-employee", request);
		
		expect(employee).toEqual({
			id: 2,
			fullName: "Super man",
			age: 41,
			salary: 9000,
			cityCode: "KPT"
		});
	});

	test("Successfully updates an employee", async () => {
		const request = {
			path: "/employee",
			headers: {},
			method: "POST",
			query: {},
			params: {},
			body: {
				fullName: "Iron man",
				age: 39,
				salary: 10000,
				cityCode: "AGD"
			}
		};
		await apiOperations.init(config);
		await apiOperations.executeOperation("post-employee", request);
		request.body = {
			fullName: "Super man",
			age: 41,
			salary: 9000,
			cityCode: "KPT"
		}
		await apiOperations.executeOperation("post-employee", request);
		request.body = {
			fullName: "Wonder woman",
			age: 32,
			salary: 9000,
			cityCode: "KPT"
		}
		await apiOperations.executeOperation("post-employee", request);

		request.body = {
			fullName: "Thor",
			age: 44,
			salary: 10000,
			cityCode: "AGD"
		}
		await apiOperations.executeOperation("post-employee", request);
		
		request.method = "PUT";
		request.body = {
			id: 1,
			fullName: "Tony Starck",
			age: 39,
			salary: 10000,
			cityCode: "AGD"
		}
		const isUpdated = await apiOperations.executeOperation("put-employee", request);
		expect(isUpdated).toBeTruthy();
		
		request.method = "GET",
		request.params.id = 1;
		request.body = {};
		const employee = await apiOperations.executeOperation("get-employee", request);

		expect(employee).toEqual({
			id: 1,
			fullName: "Tony Starck",
			age: 39,
			salary: 10000,
			cityCode: "AGD"
		});
	});

	test("Successfully deletes an employee", async () => {
		try {
			const request = {
				path: "/employee",
				headers: {},
				method: "POST",
				query: {},
				params: {},
				body: {
					fullName: "Iron man",
					age: 39,
					salary: 10000,
					cityCode: "AGD"
				}
			};
			await apiOperations.init(config);
			await apiOperations.executeOperation("post-employee", request);
			request.body = {
				fullName: "Super man",
				age: 41,
				salary: 9000,
				cityCode: "KPT"
			}
			await apiOperations.executeOperation("post-employee", request);
			request.body = {
				fullName: "Wonder woman",
				age: 32,
				salary: 9000,
				cityCode: "KPT"
			}
			await apiOperations.executeOperation("post-employee", request);
	
			request.body = {
				fullName: "Thor",
				age: 44,
				salary: 10000,
				cityCode: "AGD"
			}
			await apiOperations.executeOperation("post-employee", request);
			
			request.method = "DELETE";
			request.params.id = 4;
			request.body = {};
			await apiOperations.executeOperation("delete-employee", request);
			
			request.method = "GET",
			request.params.id = 4;
			request.body = {};

			// Try to retrieve a non-existent employee
			await apiOperations.executeOperation("get-employee", request);

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

	test("Successfully lists all employees", async () => {
		try {
			const request = {
				path: "/employee",
				headers: {},
				method: "POST",
				query: {},
				params: {},
				body: {},
			}
			await apiOperations.init(config);
			request.body = {
				fullName: "Iron man",
				age: 44,
				salary: 6000,
				cityCode: "MLB"
			}
			await apiOperations.executeOperation("post-employee", request);
			request.body = {
				fullName: "Super man",
				age: 34,
				salary: 8000,
				cityCode: "KPT"
			}
			await apiOperations.executeOperation("post-employee", request);
	
			request.body = {
				fullName: "Wonder woman",
				age: 31,
				salary: 8000,
				cityCode: "KPT"
			}
			await apiOperations.executeOperation("post-employee", request);
	
			request.body = {
				fullName: "Thor",
				age: 39,
				salary: 10000,
				cityCode: "AGD"
			}
			await apiOperations.executeOperation("post-employee", request);
	
			request.method = "DELETE";
			request.params.id = 2;
			request.body = {}
			await apiOperations.executeOperation("delete-employee", request);

			request.method = "GET";
			request.params = {};
			let employees = await apiOperations.executeOperation("get-employees", request);
			expect(employees).toMatchObject([
				{
					id: 1,
					fullName: "Iron man",
					age: 44,
					salary: 6000,
					cityCode: "MLB"
				},
				{
					id: 3,
					age: 31,
					salary: 8000,
					cityCode: "KPT"
				},
				{
					id: 4,
					fullName: "Thor",
					age: 39,
					salary: 10000,
					cityCode: "AGD"
				}
			]);

			request.method = "DELETE";
			request.params.id = 1;
			request.body = {}
			await apiOperations.executeOperation("delete-employee", request);
			request.method = "DELETE";
			request.params.id = 3;
			request.body = {}
			await apiOperations.executeOperation("delete-employee", request);
			request.method = "DELETE";
			request.params.id = 4;
			request.body = {}
			await apiOperations.executeOperation("delete-employee", request);
			
			request.method = "GET";
			request.params = {};
			employees = await apiOperations.executeOperation("get-employees", request);
			expect(employees).toMatchObject([]);
		} catch (error) {
			console.log(JSON.stringify(error));
		}
	});
});