import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutofocusDirective } from './autofocus';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        AutofocusDirective,
    ],
    exports: [
        AutofocusDirective,
    ],
    providers:[
        //AuthGuard,
    ],
    
})
export class AutofocusModule { }