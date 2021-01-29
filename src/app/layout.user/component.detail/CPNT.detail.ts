import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/common/data/user';
import { trigger, transition, style, animate } from '@angular/animations';
import { SourceMap, PaymentMap, Constants } from 'app/common/config';
import { Router, ActivatedRoute } from '@angular/router';
import { enterTransition } from '../router.animation';
import { IColumn } from 'app/common/table/CPNT.table';
import { HttpClient } from '@angular/common/http';
import { BusService, Bus } from 'app/common/bus/bus';
import { IDialogMessage } from 'app/common/dialog/ITF.dialog';
import { CInfo } from 'app/common/dialog/CPNT.info';


const mobileValidator = (control: FormControl):{[key:string]: boolean | string} =>{
    if(!control.value) {
        return {invalid: true, msg: '不能为空'};
    }
    /* else if(!/^((13[0-9])|(15[^4])|(18[0-9])|(17[0-1|3|5-8])|(14[5|7|9]))\d{8}$/g.test(control.value)){
        return {invalid: true, msg: '手机号不正确'};
    } */
}
const codeValidator = (control: FormControl):{[key:string]: boolean | string} =>{
    if(!control.value) {
        return {invalid: true, msg: '密码不能为空'};
    }
    else if(control.value.length !== 4){
        return {invalid: true, msg: '密码4位'};
    }
}

@Component({
    templateUrl: './CPNT.detail.html',
    styleUrls: ['./CPNT.detail.css'],
})
export class CDetail  extends Bus implements OnInit {
    name(): string {
        return 'CDetail';
    }
    ngOnInit(): void {

    }
    constructor(private user : UserService, private router: Router, protected bus: BusService, private route: ActivatedRoute){
        super(bus);
    }
    record = {
        name: '', 
        tel: '',  
        address: '', 
        source: '', 
        datatime: '',
        resId: '',
        uid: ''
    };
    userid = null;

    ngAfterViewInit(){
        
        this.userid = this.route.snapshot.queryParamMap.get('userid');
        this.record.name = this.route.snapshot.queryParamMap.get('name');
        this.record.tel = this.route.snapshot.queryParamMap.get('tel');
        this.record.address = this.route.snapshot.queryParamMap.get('address');
        this.record.source = this.route.snapshot.queryParamMap.get('source');
        this.source = this.record.source.replace('come-','')
        this.record.datatime = this.route.snapshot.queryParamMap.get('datatime');
        this.record.resId = this.route.snapshot.queryParamMap.get('resId');
        this.record.uid = this.route.snapshot.queryParamMap.get('uid');
        this.payment = this.route.snapshot.queryParamMap.get('payment');
    }
    today(){
        return new Date().toLocaleDateString()
    }
    paymentMapKeys(){
        return Object.keys(this.paymentMap);
    }
    sourceMapKeys(){
        return Object.keys(this.sourceMap);
    }
    paymentChecked(key){
        return this.payment == key;
    }
    sourceChecked(key){
        return this.source == key;
    }
    payment = '';
    source = '';
    paymentMap = Constants.PaymentMap || PaymentMap;
    sourceMap = Constants.SourceMap || SourceMap;
    async finish(){
        try {
            const done = await this.user.confirmPayment(this.record.uid, this.record.resId, this.payment as any);
            this.bus.send('CDialog', <IDialogMessage>{command: 'open', data: {CPNT: CInfo, button: '', returnto: this, title: '提示', info: JSON.stringify('付款方式修改完成！')} })
        }catch(err){
            console.log('detail finish', err);
        }
    }
}