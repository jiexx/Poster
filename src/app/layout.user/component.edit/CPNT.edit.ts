import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'app/common/data/user';
import { Router, ActivatedRoute } from '@angular/router';
import { BusService, Bus } from 'app/common/bus/bus';
import { Location } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { CCanvas } from 'app/common/canvas/CPNT.canvas';

const codeValidator = (control: FormControl):{[key:string]: boolean | string} =>{
    if(!control.value) {
        return {invalid: true, msg: '密码不能为空'};
    }
}

@Component({
    templateUrl: './CPNT.edit.html',
    styleUrls: ['./CPNT.edit.css'],
})
export class CEdit extends Bus  implements OnInit {
    name(): string {
        return 'CInput';
    }
    ngOnInit(): void {
        this.config = null;
        this.inspect = null;
    }
    mobile = new FormControl('xx', [
        codeValidator
    ]);
    code = new FormControl('', [
        codeValidator
    ]);
    isModInc = new FormControl(true, [
    ]);

    config = null;
    formConfig: FormGroup = new FormGroup({
        mobile: this.mobile,
        code: this.code,
        isModInc: this.isModInc
    });
    inspect = null;
    formInspect: FormGroup = new FormGroup({
    });
    
    
    @ViewChild(CCanvas) editor: CCanvas;
    constructor(private location: Location, protected bus: BusService){
        super(bus);
    }
    
    configDone(){
        this.config = {};
    }
    configBackgroundImage(){

    }
    configText(){

    }

    configInspectin(){
        this.inspect = {};
    }
    configInspectout(){
        
    }
    inspectAppend() {
        this.formInspect.addControl(Math.ceil(Math.random()*10000)+'', new FormControl('', [
            codeValidator
        ]))
    }
    inspectRemove(key){
        this.formInspect.removeControl(key);
    }
    
    today(){
        return new Date().toLocaleDateString()
    }
    back(){
        this.location.back();
    }
}