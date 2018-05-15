const path = require('path'),
	fs = require('fs');

class FsExt {

	static mkdirSync(targetDir, {isRelativeToScript = true} = {}) {
		if(fs.existsSync(targetDir)){
			return;
		}
		const sep = path.sep;
		const initDir = path.isAbsolute(targetDir) ? sep : '';
		const baseDir = isRelativeToScript ? __dirname : '.';

		targetDir.split(sep).reduce((parentDir, childDir) => {
			const curDir = path.resolve(baseDir, parentDir, childDir);
			try {
				if (!fs.existsSync(curDir)) {
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
}

module.exports = FsExt;