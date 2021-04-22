import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { IBus, BusService, IBusMessage, Bus } from 'app/common/bus/bus';
import { enterTransition } from './router.animation';
import { UserService } from 'app/common/data/user';
import { FormControl } from '@angular/forms';
import { routeConfig } from './layout.user-routings.module';
import { widthTransition } from 'app/common/animation/width';
import { filter, map, startWith } from 'rxjs/operators';

const kwValidator = (control: FormControl):{[key:string]: boolean | string} =>{
    if(!control.value) {
        return {invalid: true, msg: '不能为空'};
    }
}

@Component({
    templateUrl: './layout.user.html',
    styleUrls: ['./layout.user.css'],
    animations: [widthTransition],
})
export class LayoutUser implements OnDestroy, OnInit  {
    at = 0;
    constructor(private user : UserService, private location: Location, private router: Router, protected bus: BusService, private route: ActivatedRoute) {
        /* this.router.navigate(['/user/list'], {queryParams: {mode: this.mode}})
        this.route.queryParams.subscribe(params => {
            this.mode = params['mode'];
            
        }); */
        console.log('LayoutUser')
        
    }
    ngOnInit(): void {
        
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd), startWith(this.router)).subscribe((e) => {
            const path = this.route.snapshot['_urlSegment'].segments.reduce((p,e)=>p+'/'+e.path, '');
            const cfg = routeConfig.find(rc => path.indexOf('/user/'+rc.path) == 0)
            this.mode = cfg.mode as any || 'seller';
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
