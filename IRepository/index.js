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

/**
 * Creates an item.
 * @param {object} item object holding item properties
 * @return {Promise} On success, returns resolved promise holding
 * item's auto-incremented id. On failure, returns a rejected promise.
*/
IRepository.prototype.create = async function(item) {
	throw Object.assign(ERRORS.METHOD_NOT_IMPLEMENTED, {
		method: "create",
	});
}

/**
 * Retrieves an item.
 * @param {number} itemId id of item to retrieve
 * @return {Promise} On success, returns resolved promise holding item.
 * On failure, returns a rejected promise.
*/
IRepository.prototype.read = async function(itemId) {
	throw Object.assign(ERRORS.METHOD_NOT_IMPLEMENTED, {
		method: "read",
	});
}

/**
 * Updates an item.
 * @param {object} item object holding to-update item properties
 * @return {Promise} On success, returns resolved promise holding true.
 * On failure, returns a rejected promise.
*/
IRepository.prototype.update = async function(item) {
	throw Object.assign(ERRORS.METHOD_NOT_IMPLEMENTED, {
		method: "update",
	});
}

/**
 * Deletes an item.
 * @param {number} itemId id of item to delete
 * @return {Promise} On success, returns resolved promise holding true.
 * On failure, returns a rejected promise.
*/
IRepository.prototype.delete = async function(itemId) {
	throw Object.assign(ERRORS.METHOD_NOT_IMPLEMENTED, {
		method: "delete",
	});
}

/**
 * Retrieves a list of items.
 * @return {Promise} Returns a promise holding an array fo items on success.
 * Otherwise throws an error 
*/
IRepository.prototype.list = async function() {
	throw Object.assign(ERRORS.METHOD_NOT_IMPLEMENTED, {
		method: "list",
	});
}