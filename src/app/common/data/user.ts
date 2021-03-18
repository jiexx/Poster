import { Router } from '@angular/router';
import { IResult, ENetConf } from 'app/common/config';
import { Injectable, NgModule } from '@angular/core';
import { EDataPath, _url, _storageurl } from 'app/common/config';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { FormControl } from '@angular/forms';

export const nullValidator = (control: FormControl): { [key: string]: boolean | string } => {
    if (!control.value) {
        return { invalid: true, msg: '不能为空' };
    }
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
    async getSync(url){
        return new Promise((resolve) => {
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


@Injectable()
export class UserService {

    constructor(public router : Router, public http: HttpClient){
        this.data = new Data(http);
        /* if(!this.myId()){
            this.router.navigate(['/user/login'])
        } */
    }
    data : Data;
    myId(){
        try{
            return JSON.parse(localStorage.getItem('logined')).id;
        }catch(err){
            return null;
        }
    }
    a2h(){
        try{
            let d = JSON.parse(localStorage.getItem('logined'));
            d['screen'] = true;
            localStorage.setItem('logined',JSON.stringify(d));
            return true;
        }catch(err){
            return false;
        }
    }
    hasA2h(){
        try{
            return JSON.parse(localStorage.getItem('logined')).screen;
        }catch(err){
            return false;
        }
    }

    logout(){
        localStorage.removeItem('logined');
    }
    debugLogin(){
        localStorage.setItem('logined', JSON.stringify({id:1}));
    }
    async login(username, password){
        let result =  await this.data.remote.postSync(EDataPath.QUERY, [null,"staff","passwordLogin",[username,password,3600]]);
        if(result && result.result && result.result.length > 0){
            localStorage.setItem('logined',JSON.stringify(result.result[0]));
            return this.myId();
        }
        return null;
    }

    async download(url){
        let result =  await this.data.remote.getSync(url);
        return result;
    }
    async configGet(name){
        const my = this.myId();
        if(my && my.id){
            let result =  await this.data.remote.postSync(EDataPath.QUERY, [this.myId(),"config","get",[name]]);
            if(result && result.result && result.result.length > 0){
                return result.result[0];
            }
        }       
        return null;
    }
    async post(obj){
        const my = this.myId();
        if(my && my.id) {
            
        }       
        return null;
    }
    async searchBy(keyword){
        const my = this.myId();
        if(my && my.id){
            let result =  await this.data.remote.postSync(EDataPath.QUERY, [this.myId(),"reservation","searchByNAT",[keyword]]);
            if(result && result.result && result.result.length > 0){
                return result.result[0];
            }
        }       
        return null;
    }
}


@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        UserService
    ],
    
    
})
export class UserModule { }