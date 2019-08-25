"use strict";

module.exports = Object.freeze({
	// employee data folder
	employeeDataFolder: `${__dirname}/../${process.env.EMPLOYEE_DATA_FOLDER}`,

	// file where last auto-increment id is stored
	employeeIdsFile: `${__dirname}/../${process.env.EMPLOYEE_IDS_FILE}`,

	// Setting a default lock file options
	// more details at https://www.npmjs.com/package/proper-lockfile#lockfile-options
	defaultLockFileOptions: {
		// Duration in milliseconds after which a lock is considered stale, default is 5 seconds
		stale: process.env.LOCK_FILE_OPTIONS_STALE || 5000,

		// Number of retires to acquire a lock on a locked resource, default is 5
		retries: process.env.LOCK_FILE_OPTIONS_STALE || 5,
	},
	// Prefix for api routes
	apiRootPath: process.env.API_ROOT_PATH || "/",
});
