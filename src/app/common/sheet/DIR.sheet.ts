import { Directive } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Directive({
    selector: '[sheet-item]'
})
export class DSheet {
    constructor(private bottomsheet: MatBottomSheetRef<any>) {
    }
    close(){
        this.bottomsheet.dismiss();
    }

}