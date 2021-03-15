
import * as uuid from 'uuid';

//const azureStorage = require('azure-storage');
import * as azureStorage from 'azure-storage';
//import { BlobServiceClient, ContainerClient} from '@azure/storage-blob';
const getStream = require('into-stream');
const original=uuid.v1();

//interface for file response type
interface FileUploadResponse {
    filename: string;
    originalname: string;
    size: number;
    path: string;
    url: string;
}
// parse application/x-www-form-urlencoded
const getBlobName = (originalName: any):string => {   
    return `${original}-${originalName}`;
};

const azureStorageConfig = {
    accountName: '',
    accountKey: '',
    blobURL: getBlobName(original),
    containerName: ''
};
//upload File To Blob
const uploadFileToBlob = async (directoryPath: string, file: any): Promise<FileUploadResponse> => {
    
    
    return new Promise<FileUploadResponse>((resolve, reject) => {
        
        const blobName = getBlobName(file.hapi.filename);
        const stream = getStream(file._data);     
        console.log(file._data);   
        console.log(".........................");
        const streamLength = file._data.length;
        const blobService = azureStorage.createBlobService(azureStorageConfig.accountName, azureStorageConfig.accountKey); 
        blobService.createBlockBlobFromStream(azureStorageConfig.containerName, `${directoryPath}/${blobName}`, stream, streamLength, (err: any) => {
            if (err) {
                reject(err);
            } else {
                resolve({ 
                    filename: blobName, 
                    originalname:file.hapi.filename,
                    size: streamLength,   
                    path: `${azureStorageConfig.containerName}/${directoryPath}/${blobName}`,
                    url: `${azureStorageConfig.blobURL}${azureStorageConfig.containerName}/${directoryPath}/${blobName}` });
            }
        });
 
    });
 
};

export { getBlobName, uploadFileToBlob}
