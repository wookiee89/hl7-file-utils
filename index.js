const UtilsHelper = require('./utils-helper.js'),
	Logger = require('./console-logger.js'),
	Queue = require('./queue.js');

/*
	Module loader.
 */
class Utils {

	constructor() {
		this.UtilsHelper = UtilsHelper;
		this.Logger = Logger;
		this.Queue = Queue;
	}

}

module.exports = new Utils();