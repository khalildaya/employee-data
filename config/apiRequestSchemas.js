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
			},
		},
		"required": [
			"fullName"
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
				"type": "string",
				"format": "uuid",
			},
			"fullName": {
				"type": "string",
			},
		},
		"required": [
			"id",
			"fullName"
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