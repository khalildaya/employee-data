"use strict";

module.exports = Object.freeze([
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
						"type": "string",
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
						"type": "string",
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
]);