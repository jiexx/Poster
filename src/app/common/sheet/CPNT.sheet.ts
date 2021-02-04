import { Component, Input, ContentChild, OnChanges, Inject, Injector, ReflectiveInjector, Injectable } from '@angular/core';
import { DSheet } from './DIR.sheet';
import { MatBottomSheet, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Injectable()
export class DData {
}

@Component({
    selector: 'container',
    template:
        `<ng-container *ngComponentOutlet="data.component; injector: inj"></ng-container>`,
})
class CContainer {
    inj: Injector;
    constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: {component: any, appendix: DData }, public injector: Injector) {
        this.inj = ReflectiveInjector.resolveAndCreate([{ provide: DData, useValue: data.appendix }], this.injector);
    }
}

@Component({
    selector: 'sheet',
    template:
        `<div >
            <ng-content select="[sheet-item]" ></ng-content>   
        </div>`,
})
export class CSheet implements OnChanges {
    @Input() data: DData = null;
    @ContentChild(DSheet) item : DSheet;
    constructor(private bottomsheet: MatBottomSheet) {
        
    }
    ngOnChanges() {
        if(this.data) {
            this.open(this.data);
        }
    }
    open(data: DData): void {
        const bottomSheetRef = this.bottomsheet.open(CContainer, {data: {component: this.item._this, appendix: data}});
        bottomSheetRef.afterDismissed().subscribe(() => {
            console.log('dataFromChild');
            this.data = null;
        });
    }
}