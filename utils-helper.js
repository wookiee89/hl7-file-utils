const path = require('path'),
			fs = require('fs'),
			CSV_INFO_HEADER = [
			'code',
			'mode',
			'protocol',
			'method',
			'path',
			'client',
			'historical',
			'mtype',
			'message',
			'error',
			'fileName',
			'start',
			'end',
			'time',
			'rec_ip',
			'sender_ip',
			'outfile',
			'msgid',
			'count',
			'ts'];

function formatNumberLength(num, length) {
	let r = '' + num;
	while (r.length < length) {
		r = '0' + r;
	}
	return r;
};

class UtilsHelper {
	static getCsvHeader(){
		return CSV_INFO_HEADER;
	}

	static createDir(folder){
		fs.existsSync(folder) || UtilsHelper.mkDirByPathSync(folder,{isRelativeToScript: true});
	}

	static mkDirByPathSync(targetDir, {isRelativeToScript = false} = {}) {
		const sep = path.sep;
		const initDir = path.isAbsolute(targetDir) ? sep : '';
		const baseDir = isRelativeToScript ? __dirname : '.';

		targetDir.split(sep).reduce((parentDir, childDir) => {
			const curDir = path.resolve(baseDir, parentDir, childDir);
			try {
				if(!fs.existsSync(curDir)) {
					fs.mkdirSync(curDir);
					//logger.debug(`Directory created ${curDir}`);
				}
			} catch (err) {
				logger.error(err);
				if (err.code !== 'EEXIST') {
					throw err;
				}

				//logger.debug(`Directory ${curDir} already exists!`);
			}

			return curDir;
		}, initDir);
	}

	static moveToStorage( savingPath, moveToPath ){
		let moveToDir = path.dirname(moveToPath);
		UtilsHelper.createDir(moveToDir);
		//logger.debug('Moved to', moveToDir, moveToPath);
		fs.renameSync(savingPath, moveToPath);
	}

	static getTSDiff( ts ){
		ts = ts || [];
		let now = Date.now(),
			prevTS = now;
		if(ts.length>0){
			prevTS = ts[ts.length-1].ts || prevTS;
		}
		return now - prevTS;
	}

	static formatNumberLength(num, length) {
		return formatNumberLength(num, length);
	};

	static getFileNameTime( fileIntervalSec, includeMSec, d ){
		let fileIntervalHour = fileIntervalSec >= 3600 ? Math.round(fileIntervalSec / 3600) : 0;
		let fileIntervalMin = fileIntervalSec >= 60 ? Math.round(fileIntervalSec / 60) : 0;
		fileIntervalSec = (fileIntervalSec >= 60 ? Math.round(fileIntervalSec % 60) : fileIntervalSec) || 0;
		d = d || new Date();
		return  (d.getFullYear()-2000)
			+ formatNumberLength((d.getMonth() + 1), 2)
			+ formatNumberLength(d.getDate(), 2)
			+ formatNumberLength(d.getHours() - (fileIntervalHour > 0 ? d.getHours() % fileIntervalHour : 0), 2)
			+ formatNumberLength(d.getMinutes() - (fileIntervalMin > 0 ? d.getMinutes() % fileIntervalMin : 0), 2)
			+ formatNumberLength(fileIntervalSec > 0 ? d.getSeconds() - d.getSeconds() % fileIntervalSec : 0, 2)
			+ (includeMSec ? formatNumberLength(d.getMilliseconds(), 3) : '');
	}

	static readdir(folderPath, opts ) {
		opts = opts || {};
		opts['splitter'] = opts['splitter'] || '_';
		let list = [],
				ext = opts.ext || '.xml',
				files = fs.existsSync(folderPath) && fs.readdirSync(folderPath).filter(f => f.indexOf('.')!=0 ) || [];

		if (!files.length) {
			return list;
		}

		files.forEach(function (file) {
			let filePath = path.join(folderPath, file);

			if (filePath.indexOf(ext)<0) {
				list = list.concat(UtilsHelper.readdir(filePath, {ext: ext}));
			} else {
				if(filePath.indexOf(ext)>0){
					list.push(filePath);
				}
			}
		});
		return list;
	}

	static sortDescFiles(array, opts) {
		opts = opts || {};
    let field = opts.sort_fields || false,
	    splitter = opts.splitter || '_';

		return array.sort(function(a, b) {
			a = a && field && a[field] || a;
			b = b && field && b[field] || b;
			let x = path.basename(a, opts.ext).split(splitter)[0];
			let y = path.basename(b, opts.ext).split(splitter)[0];

			if (typeof x == 'string'){
				x = (''+x).toLowerCase();
			}
			if (typeof y == 'string'){
				y = (''+y).toLowerCase();
			}
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	}

	static returnResponse(httpResponse, status, message, logger){

		if( (typeof message).toLowerCase() == 'object' ) {
			message = JSON.stringify(message);
		}

		if(logger) {
			if (status === 200) {
				logger.info(message);
			} else {
				logger.error(message);
			}
		}

		httpResponse.writeHead(status);
		httpResponse.write(message);
		httpResponse.end();
	}

}

module.exports = UtilsHelper;

String.prototype.replaceAll = function(search, replacement) {
	let target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};
