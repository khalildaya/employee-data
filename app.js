"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const app = express();

const apiOperations = require("./api-operations");
const {
	STATUS_CODES,
} = require("./constants");

app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

module.exports = Object.freeze({
	createApi,
});

/**
 * Creates an express api app
 * @param {object} config config of the app
 * @return {object} express app
 */
async function createApi(config) {
	await apiOperations.init(config);
	const apiOperationIds = Object.getOwnPropertyNames(apiOperations.ops);
	for (let i = 0; i < apiOperationIds.length; i++) {
		const apiOperationId = apiOperationIds[i];
		const apiRoute = apiOperations.ops[apiOperationId];
		app[apiRoute.method](apiRoute.path, async (req, res) => {
			try {
				const result = await apiOperations.executeOperation(apiOperationId, req);
				const response = {
					status: result && result.statusCode ?  result.statusCode : STATUS_CODES.C200,
					body: result && result.body ? result.body : result,
				};
				res.status(response.status).json(response.body).end();
			} catch (error) {
				const response = {
					status: error && error.statusCode ? error.statusCode : STATUS_CODES.C500,
					body: error && error.body ? error.body : error,
				};
				res.status(response.status).json(response.body).end();
			}
		});
	}
	return app;
}
