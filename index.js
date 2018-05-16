const UtilsHelper = require('./utils-helper.js'),
	Logger = require('./console-logger.js'),
	fsext = require('./fsext.js');

/*
	Module loader.
 */
class Utils {

	constructor() {
		this.UtilsHelper = UtilsHelper;
		this.Logger = Logger;
		this.fsExt = fsext;
	}

}

module.exports = new Utils();