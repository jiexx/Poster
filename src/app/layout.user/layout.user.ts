import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { IBus, BusService, IBusMessage, Bus } from 'app/common/bus/bus';
import { enterTransition } from './router.animation';
import { UserService } from 'app/common/data/user';


@Component({
    templateUrl: './layout.user.html',
    styleUrls: ['./layout.user.css'],
    animations: [
        trigger(
            'enterAnimation', [
                transition(':enter', [
                    style({transform: 'translateX(100%)',/*  opacity: 0 */ }),
                    animate('200ms', style({ transform:'translateX(0)', /* opacity: 1  */}))
                ]),
                transition(':leave', [
                    style({transform: 'translateX(0)', /* opacity: 1 */ }),
                    animate('200ms', style({transform: 'translateX(100%)', /* opacity: 0  */}))
                ])
            ]
        )
    ],
})
export class LayoutLogin implements OnDestroy  {
    at = 0;
    constructor(private user : UserService, private location: Location, private router: Router, protected bus: BusService, private route: ActivatedRoute) {
        // this.router.navigate(['/user/list'], {queryParams: {mode: this.mode}})
        this.route.queryParams.subscribe(params => {
            this.mode = params['mode'];
            if(this.mode == 'readonly') {
                this.title = '搜索';
            }else if(this.mode == 'editable') {
                this.title = '录入';
            }else if(this.mode == 'confirm') {
                this.title = '确认信息';
            }else if(this.mode == 'input') {
                this.title = '确认信息';
            }
        });
    }
    ngOnDestroy(): void {
    }
    mode = 'readonly';
    title = '';
    changeMode(mode){
        this.mode = mode;
        this.router.navigate(['/user/list'], {queryParams: {mode: this.mode}})
    }
    input(){
        this.mode = 'confirm';
        this.router.navigate(['/user/input'], {queryParams: {mode: this.mode}})
    }
    logout() {
        this.user.logout();
        window.location.href = 'https://z3.shneuro.cn:36021/z3html/index.html?app_conf_url=js/z3/conf-dist.json,js/z3/conf-customerService.json#';
    }
    back(){
        this.location.back();
    }
}
