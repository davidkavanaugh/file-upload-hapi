import { Server } from 'hapi';
import * as Boom from 'boom';
import * as path from 'path'
import * as fs from 'fs';
import * as Loki from 'lokijs';

import {
    getBlobName, uploadFileToBlob
} from './utils';
;

// app
const app = new Server({
    port: 3001,
    host: 'localhost',
    routes: {
        cors: true
    }
});

app.route({
    method: 'POST',
    path: '/profile',
    options: {
        payload: {
            output: 'stream',
         //   maxBytes: 209715200,
            allow: 'multipart/form-data'
        }
    },
    handler: async function (request, h) {
        try {
            const data = request.payload;
            const file = data['avatar'];
            console.log(file);
            const image = await uploadFileToBlob('images', file);
            return image;
        } catch (err) {
            return Boom.badRequest(err.message, err);
        }
    }
});



const init = async () => {
    await app.start();
    console.log(`Server running at: ${app.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();