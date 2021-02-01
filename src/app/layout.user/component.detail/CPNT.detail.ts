import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/common/data/user';
import { trigger, transition, style, animate } from '@angular/animations';
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
       
    }
    today(){
        return new Date().toLocaleDateString()
    }

}