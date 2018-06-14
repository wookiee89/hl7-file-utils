const path = require('path'),
	fs = require('fs'),
	CLOUD_ERROR = 'mirth-error';

let blobs = {};

class AzureHelper {

	constructor(azureStorage){
		this.azure = azureStorage;
	}

	async getBlobSvc( client_name, connStr, postCall ) {
		if(!blobs[client_name]){

			if( !connStr ){
				throw new Error('Blob conn string is undefined.');
			}
			let bSrv = this.azure.createBlobService(connStr);

			if(bSrv && postCall){
				postCall(bSrv);
			}

			blobs[client_name] = bSrv;
		}
		return blobs[client_name];
	}

	createContainerIfNotExists(blob_service, containerName ) {
		return new Promise((resolve, reject) => {
			blob_service.createContainerIfNotExists(containerName, {	publicAccessLevel: 'blob'	}, (err, result, response)=>{
				if (err) {
					console.log('Failed to create blob:', containerName, err);
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	}
	writeFile(blob_service, sourceFilePath, blobName, containerName ){
		containerName = containerName || CLOUD_ERROR;
		return new Promise((resolve, reject) => {
			blob_service.createBlockBlobFromLocalFile(containerName, blobName, sourceFilePath, err => {
				if(err) {
					reject(err);
				} else {
					resolve({ message: `Upload of '${blobName}' complete` });
				}
			});
		});
	};


	removeFile( blob_service, sourceFilePath, containerName ){
		containerName = containerName || CLOUD_ERROR;
		let blobName = path.basename(sourceFilePath);
		return new Promise((resolve, reject) => {
			blob_service.deleteBlobIfExists(containerName, blobName, err => {
				if(err) {
					reject(err);
				} else {
					resolve({ message: `Block blob '${blobName}' deleted` });
				}
			});
		});
	};

	createQueueIfNotExists(sbService, queueName) {
		return new Promise((resolve, reject) => {
			sbService.createQueueIfNotExists(queueName, function (err) {
				if (err) {
					console.log('Failed to create queue: ', err);
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	createMessage(sbService, queueName, txt) {
		return new Promise((resolve, reject) => {
			sbService.createMessage(queueName, txt, (err, data) =>{
				if (err) {
					console.error('Send', err);
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}
}

module.exports = AzureHelper;