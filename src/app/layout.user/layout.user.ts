import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Location } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { IBus, BusService, IBusMessage, Bus } from 'app/common/bus/bus';
import { enterTransition } from './router.animation';
import { UserService } from 'app/common/data/user';
import { FormControl } from '@angular/forms';
import { routeConfig } from './layout.user-routings.module';

const kwValidator = (control: FormControl):{[key:string]: boolean | string} =>{
    if(!control.value) {
        return {invalid: true, msg: '不能为空'};
    }
}

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
export class LayoutUser implements OnDestroy  {
    at = 0;
    constructor(private user : UserService, private location: Location, private router: Router, protected bus: BusService, private route: ActivatedRoute) {
        /* this.router.navigate(['/user/list'], {queryParams: {mode: this.mode}})
        this.route.queryParams.subscribe(params => {
            this.mode = params['mode'];
            
        }); */
        this.route.url.subscribe((e) => {
            const cfg = routeConfig.find(rc => '/user/'+rc.path == this.route.snapshot['_routerState'].url)
            this.mode = cfg.mode as any || 'seller';
            console.log('this.route', cfg.mode)
        });
    }
    ngOnDestroy(): void {
    }
    keyword = new FormControl('', [
        kwValidator
    ]);
    search(){

    }
    mode : 'seller' | 'editor' | 'customer' = 'seller';
    back(){
        this.location.back();
    }
}
