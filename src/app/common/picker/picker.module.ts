import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPicker } from './CPNT.picker';

@NgModule({
    imports: [
        CommonModule,
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