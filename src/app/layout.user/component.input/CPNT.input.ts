import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/common/data/user';
import { Router, ActivatedRoute } from '@angular/router';
import { BusService, Bus } from 'app/common/bus/bus';
import { Location } from '@angular/common';


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
    at;
    constructor(private location: Location, protected bus: BusService){
        super(bus);
    }
    today(){
        return new Date().toLocaleDateString()
    }
    back(){
        this.location.back();
    }
}