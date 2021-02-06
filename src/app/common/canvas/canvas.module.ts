import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CCanvas } from './CPNT.canvas';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        CCanvas,
    ],
    exports: [
        CCanvas,
    ],
    providers:[
    ],
    
})
export class CanvasModule { }