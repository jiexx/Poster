import { AfterViewInit } from '@angular/core';
import { Component, OnChanges, ElementRef, HostListener, ViewChild } from '@angular/core';

class Text {
    constructor(public ctx: CanvasRenderingContext2D, public text = "", public options: any = {}) {
        this.options = Object.assign({ width: 250, height: 40, font: "17px Arial", borderWidth: 1, borderColor: "#ccc", padding: 5 }, options);
    }
    position = { x: 10, y: 10 };
    isFocus = true;
    focusIndex = this.text.length;
    isCommandKey = false;
    selected = false;
    render() {
        //this.ctx.translate(0.5, 0.5);
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
        //this.ctx.translate(-0.5, -0.5);
    }

    handleOnClick(e) {
        let clientX = e.offsetX;
        let clientY = e.offsetY;
        console.log(clientX, clientY)
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

    handleOnKeyUp() {
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
    styles: [
        `canvas {
            width: 100%;
            height: 100%;
        }`
    ]
})
export class CCanvas implements OnChanges, AfterViewInit  {
    @ViewChild('my') canvas: ElementRef<HTMLCanvasElement>;
    public context: CanvasRenderingContext2D;
    public text: Text;
    constructor() {

    }
    ngOnChanges() {
    }
    PIXEL_RATIO 
    ngAfterViewInit() {
        let ctx = this.canvas.nativeElement.getContext("2d");
        let dpr = window.devicePixelRatio || 1;
        let bsr = ctx['webkitBackingStorePixelRatio'] ||
        ctx['mozBackingStorePixelRatio'] ||
        ctx['msBackingStorePixelRatio'] ||
        ctx['oBackingStorePixelRatio'] ||
        ctx['backingStorePixelRatio'] || 1;

        this.PIXEL_RATIO = dpr / bsr;
        
        this.context = this.createHiDPICanvas(this.canvas.nativeElement.offsetWidth, this.canvas.nativeElement.offsetHeight).getContext("2d");
        this.text = new Text(this.context);
    }
    createHiDPICanvas(w, h, ratio = 0) {
        if (!ratio) { ratio = this.PIXEL_RATIO; }
        var can = this.canvas.nativeElement;
        can.width = w * ratio;
        can.height = h * ratio;
        can.style.width = w + "px";
        can.style.height = h + "px";
        can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
        return can;
    }
    private mouseDown: boolean = false;
    @HostListener('mouseup')
    onMouseup() {
        this.mouseDown = false;
    }
    @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
        if (this.mouseDown) {
        }
    }
    @HostListener('mousedown', ['$event'])
    onMousedown(event) {
        this.mouseDown = true;
    }
    @HostListener('window:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        // Your row selection code
        console.log(event, event.keyCode, event.charCode );
        this.text.handleOnKeyUp();
    }
    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        // Your row selection code
        
        this.text.handleOnKeyDown(event);
    }
    @HostListener('click', ['$event']) 
    onClick(event) {
        if (event.target) {
            event.target.focus();
            event.target.click();
        }
        this.text.handleOnClick(event);
        // if (this.hasInput) return;
        // this.addInput(event.clientX, event.clientY);
    }
    @HostListener('compositionupdate', ['$event']) 
    onCompositionupdate(event) {
        console.log(event.data);
    }
    
    
    open(): void {

    }
    hasInput;
    addInput(x, y) {

        var input = document.createElement('input');
    
        input.type = 'text';
        input.style.position = 'fixed';
        input.style.left = (x - 4) + 'px';
        input.style.top = (y - 4) + 'px';
    
        input.onkeydown = (e)=>{
            this.handleEnter(e, input)
        };
    
        document.body.appendChild(input);
    
        input.focus();
    
        this.hasInput = true;
    }
    handleEnter(e, input) {
        var keyCode = e.keyCode;
        if (keyCode === 13) {
            document.body.removeChild(input);
            this.hasInput = false;
        }
    }
}