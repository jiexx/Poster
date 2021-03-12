import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ColorPicker } from './CPNT.picker';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule
    ],
    declarations: [
        ColorPicker,
    ],
    exports: [
        ColorPicker,
    ],
    providers:[
        //AuthGuard,
    ],
    
})
export class ColorPickerModule { }