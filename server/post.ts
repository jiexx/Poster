import * as querystring from 'querystring'
import { request } from 'http';

export const httpPost = async(path, json)=>{
    
    const postData = querystring.stringify(json);
    console.log('post data:',postData)
    return new Promise((resolve,reject)=>{
        const req = request({
            hostname: '127.0.0.1',
            path: path,
            port: 6601,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        },(res)=>{
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    const parsedData = (rawData);
                    resolve(parsedData);
                } catch (e) {
                    reject(e.message);
                }
            });
        });
        req.on('error', (e) => {
            reject(`problem with request: ${e.message}`);
        });
        req.write(postData);
        req.end();
    })
}