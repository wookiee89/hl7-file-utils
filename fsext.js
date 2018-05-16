const path = require('path'),
	fs = require('fs');

class FsExt {

	static mkdirSync(targetDir, {isRelativeToScript = false} = {}) {
		targetDir = targetDir.trim();

		if(!targetDir || fs.existsSync(targetDir)){
			return;
		}
		const sep = path.sep;
		const initDir = path.isAbsolute(targetDir) ? sep : '';
		const baseDir = isRelativeToScript ? __dirname : '.';

		targetDir.split(sep).reduce((parentDir, childDir) => {
			let curDir = path.resolve(baseDir, parentDir, childDir).trim();
			try {
				if (!fs.existsSync(curDir)) {
					console.log(`Directory creating ${curDir}`);
					fs.mkdirSync(curDir);
				}
			} catch (err) {
				console.error('Error', curDir, err);
				if (err.code !== 'EEXIST') {
					throw err;
				}

				//console.debug(`Directory ${curDir} already exists!`);
			}

			return curDir;
		}, initDir);
	}
}

module.exports = FsExt;