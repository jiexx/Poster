import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/common/data/user';
import { trigger, transition, style, animate } from '@angular/animations';
import { IResult, PaymentMap, SourceMap, DoctorId, getBirthdayFromIdCard, Constants } from 'app/common/config';
import { Router, ActivatedRoute } from '@angular/router';
import { enterTransition } from '../router.animation';
import { IColumn } from 'app/common/table/CPNT.table';
import { HttpClient } from '@angular/common/http';
import { CInfo } from 'app/common/dialog/CPNT.info';
import { IDialogMessage } from 'app/common/dialog/ITF.dialog';
import { BusService, Bus } from 'app/common/bus/bus';


const mobileValidator = (control: FormControl):{[key:string]: boolean | string} =>{
    if(!control.value) {
        return {invalid: true, msg: '不能为空'};
    }
    /* else if(!/^((13[0-9])|(15[^4])|(18[0-9])|(17[0-1|3|5-8])|(14[5|7|9]))\d{8}$/g.test(control.value)){
        return {invalid: true, msg: '手机号不正确'};
    } */
}

const idNumberValidator = (control: FormControl):{[key:string]: boolean | string} =>{
    if(!control.value) {
        return {invalid: true, msg: '不能为空'};
    }
    else if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(control.value)){
        return {invalid: true, msg: '身份证号不正确'};
    }
}



@Component({
    templateUrl: './CPNT.input.html',
    styleUrls: ['./CPNT.input.css'],
})
export class CInput extends Bus  implements OnInit {
    name(): string {
        return 'CInput';
    }
    ngOnInit(): void {

    }
    constructor(private user : UserService, private router: Router, protected bus: BusService, private route: ActivatedRoute){
        super(bus);
    }
    today(){
        return new Date().toLocaleDateString()
    }
    birthDay = '';
    username = new FormControl('', [
        mobileValidator
    ]);
    userid = new FormControl('', [
        idNumberValidator
    ]);
    mobile = new FormControl('', [
        mobileValidator
    ]);
    province = new FormControl('', [
        mobileValidator
    ]);
    city = new FormControl('', [
        mobileValidator
    ]);
    district = new FormControl('', [
        mobileValidator
    ]);
    address = new FormControl('', [
        mobileValidator
    ]);
    mode;
    ngAfterViewInit(){
        this.mode = this.route.snapshot.queryParamMap.get('mode');
        this.gender = 'male';
        this.userid.valueChanges.subscribe(value=>{
            const day = getBirthdayFromIdCard(value);
            const time = new Date(day);
            if(day && time && time.getDay() ){
                this.birthDay = day;
            }else {
                this.birthDay = '';
            }
        })
    }
    getList(sort: string, order: string, page: number){
    }
    payment = '';
    source = '';
    paymentMap = Constants.PaymentMap || PaymentMap;
    sourceMap = Constants.SourceMap || SourceMap;
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
    gender = '';
    async finish(){
        if(!this.username.valid ||
            !this.userid  ||
            !this.mobile  ||
            !this.address.valid) {
                this.username.markAllAsTouched();
                this.userid.markAllAsTouched();
                this.mobile.markAllAsTouched();
                this.address.markAllAsTouched();
                return;
        }
        try {
            const visitor = await this.user.registeVisitor();
            const userid = await this.user.addFromVisitor(
                visitor, 
                this.username.value, 
                this.gender,
                this.userid.value,
                this.mobile.value,
                this.province.value,
                this.city.value,
                this.district.value,
                this.address.value);
            const _ = await this.user.setSource(visitor, this.source);
            const result = await this.user.getScheduleId(Constants.DoctorId || DoctorId);
            if(result && result.length > 0){
                const resId = await this.user.addReservation(userid, result[0].id, null, visitor);
                const done = await this.user.confirmPayment(userid, resId, this.payment as any);
                const realResId = await this.user.getRealResId(userid, this.gender, getBirthdayFromIdCard(this.userid.value), this.username.value, this.address.value, this.mobile.value, resId, this.source);
                const saved = await this.user.saveResId(resId, realResId);
                this.bus.send('CDialog', <IDialogMessage>{command: 'open', data: {CPNT: CInfo, button: '', returnto: this, title: '提示', info: JSON.stringify('新建预约完成:'+realResId)} })
            }
        }catch(err) {
            console.log('input finish', err);
        }
    }

}