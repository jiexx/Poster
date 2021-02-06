import { NgModule } from '@angular/core';
import { MatCardModule  } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from "@angular/flex-layout";
import { LayoutRoutingModule } from './layout.user-routings.module';
import { CommonModule } from '@angular/common';
import { CLogin } from './component.login/CPNT.login';
import { LayoutUser } from './layout.user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogModule } from 'app/common/dialog/dialog.module';
import { SheetModule } from 'app/common/sheet/sheet.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { CList } from './component.list/CPNT.list';
import { CDetail } from './component.detail/CPNT.detail';
import { CInput } from './component.input/CPNT.input';
import { CanvasModule } from 'app/common/canvas/canvas.module';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatTabsModule,
        MatCardModule,
        MatToolbarModule,
        MatSelectModule,
        MatDividerModule,
        MatSlideToggleModule,
        DialogModule,
        SheetModule,
        CanvasModule
    ],
    declarations: [
        LayoutUser,
        CLogin,
        CList,
        CDetail,
        CInput
    ],
    
    
})
export class LayoutUserModule { }