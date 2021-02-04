import { Component, Input, ViewChild, ElementRef, ContentChild, OnChanges } from '@angular/core';
import { DSheet } from './DIR.sheet';
import { MatBottomSheet } from '@angular/material/bottom-sheet';


@Component({
    template:
        `<div #container>
            <ng-content select="[sheet-item]" ></ng-content>   
        </div>`,
    styles: [
        ``
    ]
})
export class CContainer{
    @Input() show: boolean = false;
    @ViewChild('container') slidesContainer: ElementRef<HTMLDivElement>;
    @ContentChild(DSheet) item : DSheet;
    
    constructor() {
        
    }
}