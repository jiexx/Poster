import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from 'app/common/data/user';
import { Router, ActivatedRoute } from '@angular/router';


const mobileValidator = (control: FormControl):{[key:string]: boolean | string} =>{
    if(!control.value) {
        return {invalid: true, msg: '不能为空'};
    }
    else if(control.value.length != 4) {
        return {invalid: true, msg: '身份证号后4位'};
    }
    /* else if(!/^((13[0-9])|(15[^4])|(18[0-9])|(17[0-1|3|5-8])|(14[5|7|9]))\d{8}$/g.test(control.value)){
        return {invalid: true, msg: '手机号不正确'};
    } */
}

@Component({
    templateUrl: './CPNT.list.html',
    styleUrls: ['./CPNT.list.css'],
})
export class CList implements OnInit {
    ngOnInit(): void {
        
    }
    constructor(private user : UserService, private router: Router, private route: ActivatedRoute){
        console.log('clist')
    }
    keyword = new FormControl('', [
        mobileValidator
    ]);
    ngAfterViewInit(){
        
    }
    getList(){
        return this.user.post();
    }
    search(){
    }
    detail(item){
    }
}