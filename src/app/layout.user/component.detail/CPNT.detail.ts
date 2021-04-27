import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { UserService } from 'app/common/data/user';
import { Router, ActivatedRoute } from '@angular/router';
import { BusService, Bus } from 'app/common/bus/bus';

@Component({
    templateUrl: './CPNT.detail.html',
    styleUrls: ['./CPNT.detail.css'],
})
export class CDetail  extends Bus implements AfterViewInit {
    name(): string {
        return 'CDetail';
    }
    constructor(private user : UserService, private router: Router, protected bus: BusService, private route: ActivatedRoute){
        super(bus);
    }
    img = null;
    ngAfterViewInit(): void {
        if(this.route.snapshot.queryParamMap.has('id')){
            let id = this.route.snapshot.queryParamMap.get('id');
            let d = this.user.post(null, id);
            if(d && d.length == 1) {
                this.img = d[0].base64;
            }
        }
    }
    shares = null;

    share(){
       this.shares = {}
    }

    back() {
        //this.location.back();
        this.router.navigate(['/user/list'])
    }

}