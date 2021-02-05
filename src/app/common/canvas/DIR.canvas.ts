import { Directive, ElementRef } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Directive({
    selector: '[sheet-item]'
})
export class DSheet {
    ref = null;
    constructor(private bottomsheet: MatBottomSheetRef<any>, public hostElement: ElementRef) {
        this.ref = hostElement;
    }
    close(){
        this.bottomsheet.dismiss();
    }

}