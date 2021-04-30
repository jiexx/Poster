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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider'
import { CList } from './component.list/CPNT.list';
import { CDetail } from './component.detail/CPNT.detail';
import { CEdit } from './component.edit/CPNT.edit';
import { CanvasModule } from 'app/common/canvas/canvas.module';
import { CarouselModule } from 'app/common/carousel/carousel.module';
import { ColorPickerModule } from 'app/common/picker/picker.module';
import { AutofocusModule } from 'app/common/autofocus/autofocus.module';

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
        MatSliderModule,
        MatDividerModule,
        MatSlideToggleModule,
        CarouselModule,
        ColorPickerModule,
        DialogModule,
        SheetModule,
        CanvasModule,
        AutofocusModule,
    ],
    declarations: [
        LayoutUser,
        CLogin,
        CList,
        CDetail,
        CEdit
    ],
    
    
})
export class LayoutUserModule { }