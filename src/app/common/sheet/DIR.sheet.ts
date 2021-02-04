import { Directive, ElementRef } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Directive({
    selector: '[sheet-item]'
})
export class DSheet {
    _this = null;
    constructor(private bottomsheet: MatBottomSheetRef<any>, public hostElement: ElementRef) {
        this._this = this;
    }
    close(){
        this.bottomsheet.dismiss();
    }

}