const UtilsHelper = require('./utils-helper.js'),
	Logger = require('./console-logger.js'),
	Queue = require('./queue.js');

var Utils = function(){
	this.UtilsHelper = UtilsHelper;
	this.Logger = Logger;
	this.Queue = Queue;
}

module.exports = new Utils();
