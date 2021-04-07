import { Component, Input, ContentChild, OnChanges, Inject, Injector, ReflectiveInjector, Injectable, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { DSheet } from './DIR.sheet';
import { MatBottomSheet, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

export class DData {
}

@Component({
    template: '',
})
class CContainer {
    inj: Injector;
    constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: {ref: any, appendix: DData }, private hostElement: ElementRef, private renderer:Renderer2) {
        this.renderer.appendChild(hostElement.nativeElement, data.ref.nativeElement);
    }
}

@Component({
    selector: 'sheet',
    template:
        `<div [style.display]="'none'">
            <ng-content select="[sheet-item]"></ng-content>   
        </div>`,
})
export class CSheet implements OnChanges, OnDestroy {
    @Input() data: DData = null;
    @ContentChild(DSheet) item : DSheet;
    constructor(private bottomsheet: MatBottomSheet, public router : Router) {
        router.events.subscribe((val) => {
            this.bottomsheet.dismiss();
        });
    }
    ngOnDestroy(): void {
        this.bottomsheet.dismiss();
    }
    ngOnChanges() {
        if(this.data) {
            this.open(this.data);
        }else {
            this.bottomsheet.dismiss();
        }
    }
    open(data: DData): void {
        const bottomSheetRef = this.bottomsheet.open(CContainer, {data: {ref: this.item.ref, appendix: data}});
        bottomSheetRef.afterDismissed().subscribe(() => {
            this.data = null;
        });
    }
}