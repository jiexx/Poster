import { AfterViewInit } from '@angular/core';
import { Component, Input, ContentChild, OnChanges, Inject, Injector, ReflectiveInjector, Injectable, ElementRef, Renderer2, HostListener, ViewChild } from '@angular/core';
import { DSheet } from './DIR.canvas';

class Text {
    constructor(public ctx: CanvasRenderingContext2D, public text = "", public options: any = {}) {
        this.options = Object.assign({ width: 250, height: 40, font: "17px Arial", borderWidth: 1, borderColor: "#ccc", padding: 5 }, options);
    }
    position = { x: 10, y: 10 };
    isFocus = false;
    focusIndex = this.text.length;
    isCommandKey = false;
    selected = false;
    render() {
        this.ctx.clearRect(this.position.x, this.position.y, this.options.width, this.options.height);
        this.ctx.font = this.options.font;
        this.ctx.lineWidth = this.options.borderWidth;
        this.ctx.strokeStyle = this.options.borderColor;
        if (this.isFocus) {
            this.ctx.strokeStyle = "#000";
        }
        this.ctx.rect(this.position.x, this.position.y, this.options.width, this.options.height);
        this.ctx.stroke();

        // write text
        var str = "";
        for (var i = 0; i < this.text.length; i++) {
            if (!this.selected && this.isFocus && this.focusIndex === i) {
                str += "|";
            }
            str += this.text[i];
        }
        if (!this.selected && this.isFocus && this.focusIndex === this.text.length) {
            str += "|";
        }

        if (this.selected) {
            var _width = this.ctx.measureText(this.text).width;
            this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
            this.ctx.fillRect(this.position.x + this.options.padding, this.position.y + this.options.padding, _width, parseInt(this.options.font, 17));

        }

        this.ctx.fillStyle = "#000";
        this.ctx.fillText(str, this.position.x + this.options.padding, this.position.y + (this.options.height / 2) + this.options.padding);

    }

    handleOnClick(e) {
        let clientX = e.clientX;
        let clientY = e.clientY;
        if (clientX <= this.position.x + this.options.width && clientX >= this.position.x && clientY <= this.position.y + this.options.height && clientY >= this.position.y) {
            if (!this.isFocus) {
                this.isFocus = true;
                this.focusIndex = this.text.length;
                this.render();
            }
        } else {
            if (this.isFocus) {
                this.selected = false;
                this.isFocus = false;
                this.render();
            }

        }
    }

    handleOnKeyUp(e) {
        this.isCommandKey = false;
        this.render();
    }

    handleOnKeyDown(e) {
        if (e.key === "Meta" || e.key === "Control") {
            this.isCommandKey = true;
        }
        if (this.isFocus) {
            e.preventDefault();
        }
        if (this.isCommandKey && e.key === "a") {
            this.selected = true;
            this.render();
            return
        }
        if (this.isFocus && e.key === "Backspace") {
            if (this.selected) {
                this.focusIndex = 0;
                this.text = "";
                this.selected = false;
                this.render();
            }
            var str = "";
            for (var i = 0; i < this.text.length; i++) {
                if (i !== this.focusIndex - 1) {
                    str += this.text[i];
                }
            }

            this.text = str;

            this.focusIndex--;
            if (this.focusIndex < 0) {
                this.focusIndex = 0;
            }
            this.render();
        }
        if (this.isFocus && e.key === "ArrowLeft") {
            this.focusIndex--;
            if (this.focusIndex < 0) {
                this.focusIndex = 0;
            }
            this.render();
        }
        if (this.isFocus && e.key === "ArrowRight") {
            this.focusIndex++;
            if (this.focusIndex > this.text.length) {
                this.focusIndex = this.text.length;
            }
            this.render();
        }
        if (!this.isCommandKey && this.isFocus && (e.keyCode == 32 || (e.keyCode >= 65))) {
            this.text += e.key;
            this.focusIndex = this.text.length;
            this.render();
        }
    }
}

@Component({
    selector: 'canvasr',
    template:
        `<canvas #my></canvas>`,
})
export class CCanvas implements OnChanges, AfterViewInit  {
    @ViewChild('my') canvas: ElementRef<HTMLCanvasElement>;
    public context: CanvasRenderingContext2D;
    public text: Text;
    constructor() {

    }
    ngOnChanges() {
    }
    ngAfterViewInit() {
        this.context = this.canvas.nativeElement.getContext('2d');
        this.text = new Text(this.context);
    }
    private last: MouseEvent;
    private mouseDown: boolean = false;
    @HostListener('mouseup')
    onMouseup() {
        this.mouseDown = false;
    }
    @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
        if (this.mouseDown) {
            this.last = event;
        }
    }
    @HostListener('mousedown', ['$event'])
    onMousedown(event) {
        this.mouseDown = true;
        this.last = event;
    }
    @HostListener('window:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        // Your row selection code
        this.text.handleOnKeyUp(event);
    }
    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        // Your row selection code
        console.log(event, event.keyCode);
        this.text.handleOnKeyDown(event);
    }
    @HostListener('click', ['$event.target']) 
    onClick(event) {
        this.text.handleOnClick(event);
    }
    
    open(data: any): void {

    }
}