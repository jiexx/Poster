import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/common/data/user';
import { trigger, transition, style, animate } from '@angular/animations';
import { IResult } from 'app/common/config';
import { Router, ActivatedRoute } from '@angular/router';
import { enterTransition } from '../router.animation';


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
}

@Component({
    templateUrl: './CPNT.login.html',
    styleUrls: ['./CPNT.login.css'],
    animations: [trigger(
        'enterAnimation', [
            transition(':enter', [
                style({transform: 'scale(0)', opacity: 0 }),
                animate('300ms', style({ transform:'scale(1.0)', opacity: 1 }))
            ]),
            transition(':leave', [
                style({transform: 'scale(1.0)', opacity: 1 }),
                animate('300ms', style({transform: 'scale(0)', opacity: 0 }))
            ])
        ]
    )],
})
export class CLogin implements AfterViewInit {
    constructor(private user : UserService, private router: Router, private route: ActivatedRoute){
        // this.user.download('https://peapix.com/bing/feed?country=us').then((res: string)=>{
        //     let a = res.match(/<url>(.+?)<\/url>/g)
        // })
    }
    bg: string = './assets/img/bg.jpg';
    ngAfterViewInit(){
        
        if(this.user.myId()){
            this.router.navigate(['/user/list'], {queryParams: {mode: 'readonly'}})
        }
    }
    mobile = new FormControl('', [
        mobileValidator
    ]);
    code = new FormControl('', [
        codeValidator
    ]);
    form: FormGroup = new FormGroup({
        mobile: this.mobile,
        code: this.code
    });
    submit(){
        if(this.form.valid) {
            this.user.login(this.mobile.value, this.code.value).then(res =>{
                if(res){
                    this.router.navigate(['/user/list'],{queryParams: {mode: 'readonly'}})
                }
            });
        }else {
            this.form.markAllAsTouched();
        }
    }
}