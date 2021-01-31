const express = require('express');
import * as bodyParser from 'body-parser';
import * as https from 'https';
import { v4 as uuid } from 'uuid';
import { resolve } from 'path';
import { EDataPath, ENetConf, __debug } from '../config';
import { Mysql, Mongodb } from './database';
import { readFileSync, promises, existsSync, mkdirSync } from 'fs';
import { __db, __dbName } from './db';
import { Search } from './search';

const privateKey  = readFileSync('./private.pem', 'utf8');
const certificate = readFileSync('./file.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

const app = express();
app.use('/', express.static(process.cwd()+'/dist', {
    setHeaders: function(res, path) {
        res.set("Access-Control-Allow-Origin", "*");
    }
}) );
if(!existsSync(process.cwd()+'/upload')) {
    mkdirSync(process.cwd()+'/upload', {recursive:true});
}
app.use('/storage', express.static(process.cwd()+'/upload', {
        setHeaders: function(res, path) {
            res.set("Access-Control-Allow-Origin", "*");
        }
    }) 
);

app.use('*',(req, res)=>{
    res.sendFile(resolve(process.cwd()+'/dist/index.html')) 
})
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(ENetConf.SSLPORT, () => {
    console.log('HTTPS Server is running on: https://localhost:%s', ENetConf.SSLPORT);
});

const server = express();
server.use(bodyParser.json({ limit: '50mb' })); // for parsing application/json
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded
server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    if (req.method == 'OPTIONS') {
        res.send(200);
    }else {
        next();
    }
});


server.use(EDataPath.UPLOAD, async (req, res)=>{
    try{
        let q = {...req.body, ...req.params, ...req.query};
        __debug(`${EDataPath.UPLOAD} ${q.method}`);
        if (q.data && q.data.length > 0 && q.userid && q.data[0].filename && q.data[0].base64) {
            let d = new Date();
            let id = d.getFullYear()+'_'+d.getMonth()+'_'+d.getDay();
            if(!existsSync(process.cwd()+`/upload/${q.userid}/${id}`)) {
                mkdirSync(process.cwd()+`/upload/${q.userid}/${id}`, {recursive:true});
            }
            Promise.all(q.data.map(e=>promises.writeFile(`./upload/${q.userid}/${id}/${e.filename}`, e.base64.replace(/^data:.+?;base64,/,''), 'base64')))
            .then(r=>{
                res.json({code: 'OK', data: q.data.map(e=>({id:id, filename:e.filename}))});
            }).catch(e=>{
                __debug(`${EDataPath.UPLOAD} err at ${e.toString()} ${e.message}`);
                res.json({code: 'ERR', data: e});
            })
        }
    }catch(e){
        __debug(`${EDataPath.UPLOAD} err at ${e.toString()} ${e.message}`);
        res.json({code: 'ERR', data:{msg: `${EDataPath.UPLOAD} err at exception ${new Date().toLocaleString()}`}});
    }
});

server.use(EDataPath.QUERY, async (req, res)=>{
    try{
        let q = {...req.body, ...req.params, ...req.query};
        __debug(`${EDataPath.QUERY} ${q.col} ${q.method}`);
        if (!q || Object.keys(q).length === 0) {
            __debug(`${EDataPath.QUERY} err at parameters`);
            res.json({code: 'ERR', data:{msg: `${EDataPath.QUERY} err at parameters`}});
        }else if(q && q.col) {
            await __db.connect("mongodb");
            if(q.method=='qry'){
                let objs = await __db.find(__dbName.PLANS, q.col, q.data? q.data: {}, q.project? q.project: {}, q.limit, q.skip, q.sort );
                res.json({code: 'OK', data: objs});
            }else if(q.method=='cnt'){
                let query = {};
                if(q.data){
                    query = (q.data)
                }
                let objs = await __db.find(__dbName.PLANS, q.col, query, q.project? q.project: {}, null, null, null, true );
                res.json({code: 'OK', data: objs});
            }else if(q.method=='rm' && q.id.length > 0) {
                let deletedCount = await __db.remove(__dbName.PLANS, q.col, {_id :{$in: q.id}});
                res.json({code: 'OK', data: {deletedCount:deletedCount}});
            }else if(q.method=='add' && q.data.length > 0) {
                let insertedCount = await __db.insert(__dbName.PLANS, q.col, q.data);
                res.json({code: 'OK', data: {insertedCount:insertedCount}});
            }else if(q.method=='mod' && q.data.length > 0) {
                let modifiedCount = await __db.updates(__dbName.PLANS, q.col, q.data, {upsert:true});
                res.json({code: 'OK', data: {"nInserted":modifiedCount.nInserted,"nUpserted":modifiedCount.nUpserted,"nMatched":modifiedCount.nMatched,"nModified":modifiedCount.nModified,"nRemoved":modifiedCount.nRemoved}});
            }
        }
    }catch(e){
        __debug(`${EDataPath.QUERY} err at ${e.toString()} ${e.message}`);
        res.json({code: 'ERR', data:{msg: `${EDataPath.QUERY} err at exception ${new Date().toLocaleString()}`}});
    }
})


server.use(EDataPath.SEARCH, async (req, res)=>{
    try{
        __debug(`${EDataPath.SEARCH}`);
        let q = {...req.body, ...req.params, ...req.query};

        if (!q || Object.keys(q).length === 0) {
            __debug(`${EDataPath.SEARCH} err at parameters`);
            res.json({code: 'ERR', data:{msg: `${EDataPath.SEARCH} err at parameters`}});
        }else { 
            if(!q.keyword){
                if(q.limit) {
                    res.json({code: 'OK', data: Object.values(__search.index.i).sort((a:any,b:any)=>new Date(a.datatime).getTime() - new Date(b.datatime).getTime() ? q.sort||1 : -(q.sort||1)).filter((_,i)=>i>=(q.skip) && i<(q.skip +q.limit) ), count:__search.count});
                }else{
                    res.json({code: 'OK', data: Object.values(__search.index.i).sort((a:any,b:any)=>new Date(a.datatime).getTime() - new Date(b.datatime).getTime() ? q.sort||1 : -(q.sort||1)), count:__search.count});
                }
            }else {
                let count = __search.search(q.keyword,q.sort);
                let result = count.filter((_,i)=>i>=(q.skip) && i<(q.skip +q.limit) );
                res.json({code: 'OK', data: result, count:count ? count.length : __search.count});
            }
        }
    }catch(e){
        __debug(`${EDataPath.SEARCH} err at ${e.toString()} ${e.message}`);
        res.json({code: 'ERR', data:{msg: `${EDataPath.SEARCH} err at exception ${new Date().toLocaleString()}`}});
    }
})


let __search = new Search() ;
server.listen(6601,  async () => {
    console.log('server at：6601');
    __db.config(new Mysql(), new Mongodb());
    await __db.connect('mongodb');
    await __search.init();

    //await taskEmail();
});
