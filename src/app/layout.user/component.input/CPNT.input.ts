import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/common/data/user';
import { Router, ActivatedRoute } from '@angular/router';
import { BusService, Bus } from 'app/common/bus/bus';
import { Location } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';

const codeValidator = (control: FormControl):{[key:string]: boolean | string} =>{
    if(!control.value) {
        return {invalid: true, msg: '密码不能为空'};
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
    mobile = new FormControl('xx', [
        codeValidator
    ]);
    code = new FormControl('', [
        codeValidator
    ]);
    isModInc = new FormControl(true, [
    ]);
    formPopup: FormGroup = new FormGroup({
        mobile: this.mobile,
        code: this.code,
        isModInc: this.isModInc
    });
    
    constructor(private location: Location, protected bus: BusService){
        super(bus);
    }
    popup = null;
    save(){
        this.popup = {};
    }
    open(){

    }
    edit(){

    }
    formCheck: FormGroup = new FormGroup({
    });
    check = null;
    checkin(){
        this.check = {};
    }
    checkout(){
        
    }
    append() {
        this.formCheck.addControl(Math.ceil(Math.random()*10000)+'', new FormControl('', [
            codeValidator
        ]))
    }
    remove(key){
        this.formCheck.removeControl(key);
    }
    rePopup(){
        this.popup = {};
    }
    today(){
        return new Date().toLocaleDateString()
    }
    back(){
        this.location.back();
    }
}