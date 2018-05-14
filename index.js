const UtilsHelper = require('./utils-helper.js'),
	Logger = require('./console-logger.js');

var Utils = function(){
	this.UtilsHelper = UtilsHelper;
	this.Logger = Logger;
}

module.exports = new Utils();
