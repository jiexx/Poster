import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CDialog } from './CPNT.dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { CCategory } from './CPNT.category';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { CInfo } from './CPNT.info';
import { CDDlg } from './CPNT.ddlg';

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatBottomSheetModule
    ],
    declarations: [
        CDialog,
        CCategory,
        CInfo,
        CDDlg
    ],
    exports: [
        CDialog,
        CCategory,
        CInfo,
        CDDlg,
    ],
    providers:[
        //AuthGuard,
    ],
    entryComponents: [
        CDialog
    ]
})
export class DialogModule { }