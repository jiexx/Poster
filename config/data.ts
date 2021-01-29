import { HttpRequest, HttpHandler, HttpEvent, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { EDataPath, _url, UseCase, ENetConf } from './path';
import { ChangeDetectorRef } from '@angular/core';





interface IResultData {
    
}

export interface IResult {
    code : 'OK' | 'ERR' | 'OKWITHMORE';
    data ?: {[key : string] : any};
}

interface IRemote {
    postSync( path : EDataPath, param : {} ) : Promise<IResult>;
}

interface IDataStorage {
    save( key : string , value : {}) : void;
    keep( key : string , value : {}) : void;
    remove( mode : 'save' | 'keep', key : string ) : void;
    get( mode : 'save' | 'keep', key : string ) : {};
}
class DataStorage implements IDataStorage{
    storage = {};
    save(key: string, value: {}): void {
        this.storage[key] = value;
    }    
    keep(key: string, value: {}): void {
        this.storage[key] = value;
    }
    remove(mode: "save" | "keep", key: string): void {
        delete this.storage[key]
    }
    get(mode: "save" | "keep", key: string): {} {
        return this.storage[key];
    }

    
}

class CRemote implements IRemote {
    constructor(private http: HttpClient,  private storage: IDataStorage, public isLoading = false){

    };
    async getSync(url, param){
        return new Promise((resolve, reject) => {
            this.http.get(url).subscribe((result) =>{
                this.isLoading = false;
                return resolve(result);
            })
        });
    }
    async postSync(path: EDataPath, param: {}): Promise<any> {
        //this.isLoading = true;
        return new Promise((resolve, reject) => {
            try {
                this.http.post(_url(path), param, { headers: new HttpHeaders(this.header) }).subscribe((result : IResult) =>{
                    this.isLoading = false;
                    return resolve(result);
                })
            }catch(err) {
                this.isLoading = false;
                reject(err);
            }
        })
    }
    async postSync2(rest: ENetConf, path: EDataPath, param: {}): Promise<any> {
        //this.isLoading = true;
        return new Promise((resolve, reject) => {
            try {
                this.http.post((rest+path), param, { headers: new HttpHeaders(this.header) }).subscribe((result : IResult) =>{
                    this.isLoading = false;
                    return resolve(result);
                })
            }catch(err) {
                this.isLoading = false;
                reject(err);
            }
        })
    }
    header = {
        "Content-Type": "application/json",
        "W2-RPC": "true",
        "Accept": "application/json, text/javascript"
    }
    option(){
        return this.storage.get('save','tk') ? { headers: new HttpHeaders(this.header) } : {};
    }
}

export class Data {
    
    remote : CRemote;
    storage : IDataStorage;

    constructor(http: HttpClient){
        this.storage = new DataStorage();
        this.remote = new CRemote(http, this.storage);
    }
    
}

