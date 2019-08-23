require("dotenv").config();
const Employee = require("./employee");

async function main() {
	const e = new Employee();
	await e.init();
	await e.create();
}

main().then(() => {
	console.log("success");
}).catch((error) => {
	console.log(error);
})