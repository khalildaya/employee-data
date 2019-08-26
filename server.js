"use strict";
require("dotenv").config();
const http = require("http");
const config = require("./config");
const {
	createApi,
} = require("./app");

createApi(config)
.then(app => {
	const server = http.createServer(app);
	server.listen(config.apiPort, () => {
		console.log(`Server listening to port ${config.apiPort}`);
	});
})
.catch(error => {
	console.log("Error starting server", error);
});
