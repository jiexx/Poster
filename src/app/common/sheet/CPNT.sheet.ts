import { Component, Input, ViewChild, ElementRef, ContentChild, OnChanges } from '@angular/core';
import { DSheet } from './DIR.sheet';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CContainer } from './CPNT.container';


@Component({
    selector: 'sheet',
    template: ``,
})
export class CSheet implements OnChanges {
    @Input() show: boolean = false;
    
    constructor(private bottomsheet: MatBottomSheet) {
        
    }
    ngOnChanges() {
        if(this.show) {
            this.open();
        }
    }
    open(): void {
        const bottomSheetRef = this.bottomsheet.open(CContainer);
        bottomSheetRef.afterDismissed().subscribe((dataFromChild) => {
            console.log('dataFromChild');
            this.show = false;
        });
    }
}