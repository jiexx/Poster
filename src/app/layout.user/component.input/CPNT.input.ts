import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/common/data/user';
import { trigger, transition, style, animate } from '@angular/animations';
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

    }
    gender = '';
    async finish(){

    }

}