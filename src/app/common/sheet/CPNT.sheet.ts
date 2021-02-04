import { Component, Input, ViewChild, ElementRef, ContentChild, OnChanges, ViewContainerRef } from '@angular/core';
import { DSheet } from './DIR.sheet';
import { MatBottomSheet } from '@angular/material/bottom-sheet';


@Component({
    selector: 'sheet',
    template:
        `<div >
            <ng-content select="[sheet-item]" #container ></ng-content>   
        </div>`,
})
export class CSheet implements OnChanges {
    @Input() show: boolean = false;
    @ViewChild('container') container: ViewContainerRef;
    @ContentChild(DSheet) item : DSheet;
    constructor(private bottomsheet: MatBottomSheet) {
        
    }
    ngOnChanges() {
        if(this.show) {
            this.open();
        }
    }
    open(): void {
        const bottomSheetRef = this.bottomsheet.open(null, {viewContainerRef: this.container});
        bottomSheetRef.afterDismissed().subscribe((dataFromChild) => {
            console.log('dataFromChild');
            this.show = false;
        });
    }
}