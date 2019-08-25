require("dotenv").config();
const Employee = require("./employee");
const config = require("./config");

async function main() {
	const e = new Employee();
	await e.init(config);
	await e.create({
		fullName: "Fraser Crane"
	});

	await e.update({
		id: 2,
		fullName: "Batman"
	});
}

main().then(() => {
	console.log("success");
}).catch((error) => {
	console.log(error);
})