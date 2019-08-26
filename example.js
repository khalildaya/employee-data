require("dotenv").config();
const Employee = require("./employee");
const config = require("./config");
const apiOperations = require("./api-operations");
async function main() {
	await apiOperations.init(config);
	const request = {
		path: "/employee",
		headers: {},
		method: "POST",
		query: {},
		params: {},
		body: {
			fullName: "Fraser Crane",
			age: 41,
			salary: 5000,
			cityCode: "STL"
		}
	}
	await apiOperations.executeOperation("post-employee", request);
}

main().then(() => {
	console.log("success");
}).catch((error) => {
	console.log(error);
})