import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBottomSheetModule, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { CCanvas } from './CPNT.canvas';

@NgModule({
    imports: [
        CommonModule,
        MatBottomSheetModule
    ],
    declarations: [
        CCanvas,
    ],
    exports: [
        CCanvas,
    ],
    providers:[
        { provide: MatBottomSheetRef, useValue: {} },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} }
    ],
    
})
export class SheetModule { }