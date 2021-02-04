import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBottomSheetModule, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { CSheet } from './CPNT.sheet';
import { DSheet } from './DIR.sheet';

@NgModule({
    imports: [
        CommonModule,
        MatBottomSheetModule
    ],
    declarations: [
        DSheet,
        CSheet,
    ],
    exports: [
        DSheet, 
        CSheet,
    ],
    providers:[
        { provide: MatBottomSheetRef, useValue: {} },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} }
    ],
    
})
export class SheetModule { }