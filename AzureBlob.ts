const bodyParser = require('body-parser');
const multer = require('multer')
const inMemoryStorage = multer.memoryStorage();
const singleFileUpload = multer({ storage: inMemoryStorage });
const azureStorage = require('azure-storage');
const getStream = require('into-stream');


// parse application/x-www-form-urlencoded
//const getBlobName = (originalName: any) => {
const getBlobName = (originalName: any):string => {

    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0."  from start of string
    return `${identifier}-${originalName}`;
};
const original='test';
const azureStorageConfig = {
    accountName: 'bidchucktest',
    accountKey: 'nzZ+W9ugWmK5FT/hLstscclfzVbmXmxXDjZqUavnZVIiXraqJt6D1LB6IYhv0eBB62X9kKvbJUTySJnGVfsGLw==',
    blobURL: getBlobName(original),
    containerName: 'testphotoupload'
};
const uploadFileToBlob1 = async (directoryPath: any, file:any) => {
//const uploadFileToBlob = async (directoryPath: string, file: any): Promise<FileUploadResponse> => {
 
    return new Promise((resolve, reject) => {
 
        const blobName = getBlobName(file.originalname);
        const stream = getStream(file.buffer);
        const streamLength = file.buffer.length;
 
        const blobService = azureStorage.createBlobService(azureStorageConfig.accountName, azureStorageConfig.accountKey); 
        blobService.createBlockBlobFromStream(azureStorageConfig.containerName, `${directoryPath}/${blobName}`, stream, streamLength, (err: any) => {
            if (err) {
                reject(err);
            } else {
                resolve({ filename: blobName, 
                    originalname: file.originalname, 
                    size: streamLength, 
                    path: `${azureStorageConfig.containerName}/${directoryPath}/${blobName}`,
                    url: `${azureStorageConfig.blobURL}${azureStorageConfig.containerName}/${directoryPath}/${blobName}` });
            }
        });
 
    });
 
};
interface MulterRequest extends Request{file: any}
 
/*const imageUpload = async(req:Request, res:Response, next:any) => {
    try {
        await uploadFileToBlob('images', (req as MulterRequest).file); // images is a directory in the Azure container
        return res.json(); //add image
    } catch (error) {
        next(error);
    }
}
*/