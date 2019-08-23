"use strict";
/**
 * A module defining the IRepository interface which Employee class has to implement
 * Classes in JavaScript are functions at the end of the day and there is no explicit way to 
 * define an interface of abstract class. As a result, we'll define the IRepository class by having
 * only the methods signature and making the method body throw an error be default
 * as a way to force (or remind) the implementing class to override and define the interface methods
*/

module.exports = IRepository;

/**
 * The IRepository interface.
 * Since JavaScript uses prototypical inheritance, we'll attach the methods to the prototype
 * so they belong to the prototype level rather than belonging directly to each of
 * the instantiated objects of the class
 */
function IRepository() {

}

const ERRORS = require("./errors");

IRepository.prototype.create = function() {
	throw Object.assign(ERRORS.METHOD_NOT_IMPLEMENTED, {
		method: "create",
	});
}

IRepository.prototype.read = function() {
	throw Object.assign(ERRORS.METHOD_NOT_IMPLEMENTED, {
		method: "read",
	});
}

IRepository.prototype.update = function() {
	throw Object.assign(ERRORS.METHOD_NOT_IMPLEMENTED, {
		method: "update",
	});
}

IRepository.prototype.delete = function() {
	throw Object.assign(ERRORS.METHOD_NOT_IMPLEMENTED, {
		method: "delete",
	});
}

IRepository.prototype.list = function() {
	throw Object.assign(ERRORS.METHOD_NOT_IMPLEMENTED, {
		method: "list",
	});
}