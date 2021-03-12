import { Component, ContentChildren, Input, QueryList, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, AfterViewInit } from '@angular/core';


@Component({
    selector: 'color-picker',
    templateUrl: './CPNT.picker.html',
    styles: []
})
export class ColorPicker {
    @Input() num = 1;
    
    colors = [];
    constructor() {
        for(let i = 0 ; i < 10 ; i ++) {
            for(let j = 0 ; j < 10 ; j ++) {
                this.colors.push(this.hslToHex(i*36, 0, j*15))
            }
        }
    }
    hslToHex(h, s, l) {
        let a=s*Math.min(l,1-l);
        let f= (n,k=(n+h/30)%12) => l - a*Math.max(Math.min(k-3,9-k,1),-1);                 
        return `rgb(${f(0)}, ${f(8)}, ${f(4)})`;
    }

}