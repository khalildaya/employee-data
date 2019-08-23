"use strict";

/**
 * A module defining the Employee class which implements IRepository interface 
*/
const IRepository = require("../IRepository");
module.exports = Employee;

/**
 * Employee class which will implement the IRepository interface
 */
function Employee() {
	IRepository.call(this);
}

/**
 * Since JavaScript uses prototypical inheritance, Employee class implements IRepository by
 * assigning the prototype of IRepository to Employee. However that overrides the prototype constructor
 * of Employee to be IRepository function which should not be the case,
 * so we'll set the constructor of Employee prototype back to Employee function.
 * The following code illustrates this
 * more details at https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance
*/
Employee.prototype = Object.create(IRepository.prototype);
Employee.prototype.constructor = Employee;

/**
 * Below the methods of IRepository interface are implemented in Employee class
*/

Employee.prototype.create = function() {
	return true;
}

Employee.prototype.read = function() {
	return true;
}

Employee.prototype.update = function() {
	return true;
}

Employee.prototype.delete = function() {
	return true;
}

Employee.prototype.list = function() {
	return true;
}