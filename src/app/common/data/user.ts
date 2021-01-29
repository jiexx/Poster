import { Router } from '@angular/router';
import { Data, ENetConf } from 'app/common/config';
import { Injectable, NgModule } from '@angular/core';
import { EDataPath, _url, _storageurl } from 'app/common/config';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { resolve } from 'q';

@Injectable()
export class UserService {

    constructor(public router : Router, public http: HttpClient){
        this.data = new Data(http);
        if(!this.myId()){
            this.router.navigate(['/user/login'])
        }
    }
    subtotal : {I:number, V:number, R:number, C:number, X:number}
    data : Data;
    schedid : string; 

    myId(){
        try{
            return JSON.parse(this.getCookie('logined'));
        }catch(err){
            return null;
        }
    }
    private deleteCookie(name) {
        this.setCookie(name, '', -1);
    }

    private setCookie(name: string, value: string, timeoutSecond: number, path: string = '') {
        let d:Date = new Date();
        d.setTime(d.getTime() + timeoutSecond * 1000);
        let expires:string = `expires=${d.toUTCString()}`;
        let cpath:string = path ? `; path=${path}` : '';
        document.cookie = `${name}=${value}; ${expires}${cpath}`;
    }
    private getCookie(name: string) {
        let ca: Array<string> = document.cookie.split(';');
        let caLen: number = ca.length;
        let cookieName = `${name}=`;
        let c: string;

        for (let i: number = 0; i < caLen; i += 1) {
            c = ca[i].replace(/^\s+/g, '');
            if (c.indexOf(cookieName) == 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return '';
    }

    logout(){
        this.deleteCookie('logined');
    }
    checkin(cookie){
        if(cookie.login){
            console.log('cookie done', cookie.login);
            this.setCookie('logined',JSON.stringify(cookie), 3600);
        }
    }
    async login(username, password){
        let result =  await this.data.remote.postSync(EDataPath.RPC, [null,"staff","passwordLogin",[username,password,3600]]);
        if(result && result.result && result.result.length > 0){
            this.setCookie('logined',JSON.stringify(result.result[0]), 3600);
            return this.getCookie('logined');
        }
        return null;
    }

    async download(url){
        let result =  await this.data.remote.getSync(url, {responseType: 'text', headers:new HttpHeaders()});
        return result;
    }
    async configGet(name){
        const my = this.myId();
        if(my && my.id){
            let result =  await this.data.remote.postSync(EDataPath.RPC, [this.myId(),"config","get",[name]]);
            if(result && result.result && result.result.length > 0){
                return result.result[0];
            }
        }       
        return null;
    }
    async registeVisitor(){
        const my = this.myId();
        if(my && my.id){
            let result =  await this.data.remote.postSync(EDataPath.RPC, [this.myId(),"visit","add",["come",my.id]]);
            if(result && result.result && result.result.length > 0){
                return result.result[0];
            }
        }       
        return null;
    }
    async addFromVisitor(visitorId, username, gender, userid, mobile, province, city, district, address){
        const my = this.myId();
        const user = {
            "name":username,
            "gender":gender,
            "idnum":userid,
            "address":`${province}${city}${district}${address}`,
            "mobile":mobile,
            "birthday":null,
            "serviceMobile":null,
            "keywords":"",
            "track":"",
            "memo":""
        }
        if(my && my.id){
            let result =  await this.data.remote.postSync(EDataPath.RPC, [this.myId(),"user","addFromVisit",[user,visitorId, my.id]]);
            if(result && result.result && result.result.length > 0){
                return result.result[0];
            }
        }       
        return null;
    }
    async setSource(visitorId, source){
        const my = this.myId();
        if(my && my.id){
            let result =  await this.data.remote.postSync(EDataPath.RPC, [this.myId(),"visit","setSource",["come", visitorId, source, my.id]]);
            if(result && result.result && result.result.length > 0){
                return result.result[0];
            }
        }       
        return null;
    }
    async addReservation(userId, scheduleId, scheduleHour, visitorId){
        const my = this.myId();
        if(my && my.id){
            let result =  await this.data.remote.postSync(EDataPath.RPC, [this.myId(),"reservation","addFromVisit",[userId, scheduleId, scheduleHour, 'new', visitorId, my.id]]);
            if(result && result.result && result.result.length > 0){
                return result.result[0];
            }
        }       
        return null;
    }
    async getScheduleId(doctorId){
        const day = new Date().toLocaleDateString();
        const my = this.myId();
        if(my && my.id){
            let result =  await this.data.remote.postSync(EDataPath.RPC, [this.myId(),"schedule","getNATScheduleByDate",[doctorId, day ]]);
            if(result && result.result && result.result.length > 0){
                return result.result[0];
            }
        }       
        return null;
    }
    async confirmPayment(userId, reservationId, type: 'meiTuan' | 'aliPay' | 'wxPay' | 'jianKangyun'){
        const my = this.myId();
        if(my && my.id){
            let result =  await this.data.remote.postSync(EDataPath.RPC, [this.myId(),"reservation","addNATPayType",[my.id, userId, reservationId, type ]]);
            if(result && result.result && result.result.length > 0){
                return result.result[0];
            }
        }       
        return null;
    }
    async getRealResId(userid, gender, birth, name, address, tel, resId, source){
        const my = this.myId();
        if(my && my.id){
            let result =  await this.data.remote.postSync2(ENetConf.REST2, EDataPath.AGENTHS, [my.id,"agent","requestIntoHis",[userid, gender, birth, name, address, tel, resId, source]]);
            if(result && result.result && result.result.length > 0){
                return result.result[0];
            }
        }       
        return null;
    }
    async saveResId(resId, realResId){
        const my = this.myId();
        if(my && my.id){
            let result =  await this.data.remote.postSync(EDataPath.RPC, [this.myId(),"reservation","addNATPayType",[resId, realResId]]);
            if(result && result.result && result.result.length > 0){
                return result.result[0];
            }
        }       
        return null;
    }
    async searchBy(keyword){
        const my = this.myId();
        if(my && my.id){
            let result =  await this.data.remote.postSync(EDataPath.RPC, [this.myId(),"reservation","searchByNAT",[keyword]]);
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