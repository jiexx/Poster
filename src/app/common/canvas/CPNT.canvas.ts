import { AfterViewInit } from '@angular/core';
import { Component, OnChanges, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Bus, BusService, IBusMessage } from '../bus/bus';
import { ExCanvasRenderingContext2D, RenderManger } from './exCanvas';



class Texts {
    private textarea: HTMLTextAreaElement = null;
    constructor(public ex: ExCanvasRenderingContext2D, public text = "", public options: any = {}) {
        this.options = Object.assign({ width: 250, height: 40, font: "16px Arial", borderWidth: 1, borderColor: "#ccc", padding: 5 }, options);
        this.textarea = this.initHiddenTextarea();
    }
    destroy(){
        if(this.textarea) {
            document.body.removeChild(this.textarea);
            this.textarea = null;
        }
    }
    position = { x: 10, y: 10 };
    isFocus = true;
    focusIndex = this.text.length;
    isCommandKey = false;
    selected = false;
    render() {
        //this.ctx.translate(0.5, 0.5);
        this.ex.clearRect(this.position.x, this.position.y, this.options.width, this.options.height);
        this.ex.context.font = this.options.font;
        this.ex.context.lineWidth = this.options.borderWidth;
        this.ex.context.strokeStyle = this.options.borderColor;
        if (this.isFocus) {
            this.ex.context.strokeStyle = "#87ceeb";
        }
        this.ex.rect(this.position.x, this.position.y, this.options.width, this.options.height);
        this.ex.stroke();

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
            var _width = this.ex.context.measureText(this.text).width;
            this.ex.context.fillStyle = 'rgba(0,0,0,0.5)';
            this.ex.fillRect(this.position.x + this.options.padding, this.position.y + this.options.padding, _width, parseInt(this.options.font, 17));

        }

        this.ex.context.fillStyle = "#000";
        this.ex.fillText(str, this.position.x + this.options.padding, this.position.y + (this.options.height / 2) + this.options.padding);
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

    private _handleOnKeyDown(e, text) {
        console.log(e, e.keyCode, e.charCode );
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
            //this.text += e.key;
            this.text = text;
            this.focusIndex = this.text.length;
            this.render();
        }
    }
    handleOnKeyDown(e) {
        this.textarea.focus();
    }
    initHiddenTextarea() {
        let textarea = document.createElement('textarea');
        textarea.autocapitalize = 'off';
        textarea.autocomplete = 'off';
        textarea.spellcheck = false;
        textarea.wrap = 'off';
        textarea.style.position = 'absoluted';
        textarea.style.left = '0px';
        textarea.style.top = '0px';
        textarea.style.zIndex = '-999';
        textarea.style.opacity = '0';
        textarea.style.width = '1px';
        textarea.style.height = '1px';
        textarea.style.fontSize = '1px';
        textarea.onkeyup = (e)=>{
            console.log(textarea.value)
            this._handleOnKeyDown(e, textarea.value);
            this.textarea.focus();
        };
        document.body.appendChild(textarea);
        textarea.focus();
        return textarea;
    }
}

@Component({
    selector: 'canvas-editor',
    template:
        `<div #container></div>`,
    styles: [
        `div {
            width: 100%;
            height: 100%;
            max-height: 100%;
        }`
    ]
})
export class CCanvas extends Bus implements OnChanges, AfterViewInit  {
    name(): string {
        return 'CCanvas';
    }
    @ViewChild('container') container: ElementRef<HTMLElement>;
    public mgr: RenderManger;
    constructor(protected bus: BusService) {
        super(bus);
    }
    save() {
        return this.mgr.save();
    }
    load(json) {
        this.mgr.load(json);
    }
    print() {
        return this.mgr.print();
    }
    createText(){
        this.mgr.createText();
    }
    removeText(){
        this.mgr.removeText();
    }
    createBackgroundImage(src){
        this.mgr.createBackgroundImage(src);
    }
    removeBackgroundImage(){
        this.mgr.removeBackgroundImage();
    }
    changeFont(font: string){
        this.mgr.changeFont(font);
    }
    changeColor(color: string){
        this.mgr.changeColor(color);
    }
    changeStr(str: string){
        this.mgr.changeStr(str);
    }
    mode = 'inside'
    setEditMode(mode:'inside'|'outside'){
        this.mode = mode;
    }
    ngOnChanges() {
    } 
    ngAfterViewInit() {
        //this.text = new Text(new ExCanvasRenderingContext2D(this.container.nativeElement, false));
        this.mgr = new RenderManger(new ExCanvasRenderingContext2D(this.container.nativeElement, false));
        this.mgr.root.translate(0,0);
        if(this.mode == 'inside') {
            this.initHiddenTextarea();
        }
    }
    callback(){
        this.bus.send('CEdit', <IBusMessage>{command: 'configTextChange', data: true });
    }
    @HostListener('touchend')
    @HostListener('mouseup')
    onMouseup() {
        this.mgr.onUp();
    }
    @HostListener('touchmove', ['$event'])
    onMousemove(event) {
        this.mgr.onMove(event);
    }
    @HostListener('touchstart', ['$event'])
    @HostListener('mousedown', ['$event'])
    onMousedown(event) {
        event['onResult'] = this.callback.bind(this);
        this.mgr.onDown(event);
        if(this.mode == 'inside') {
            this.textarea.focus();
        }
        event.preventDefault();
    }
    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if(this.mode == 'inside') {
            this.textarea.focus();
        }
        //event.preventDefault();
    }
    @HostListener('click', ['$event']) 
    onClick(event) {
        if (event.target) {
            event.target.focus();
            event.target.click();
            //event.preventDefault();
        }
    }
    private textarea: HTMLTextAreaElement = null;
    initHiddenTextarea() {
        let textarea = document.createElement('textarea');
        textarea.autocapitalize = 'off';
        textarea.autocomplete = 'off';
        textarea.spellcheck = false;
        textarea.wrap = 'off';
        textarea.style.position = 'fixed';
        textarea.style.left = '0px';
        textarea.style.top = '0px';
        textarea.style.zIndex = '-999';
        textarea.style.opacity = '0';
        textarea.style.width = '1px';
        textarea.style.height = '1px';
        textarea.style.fontSize = '1px';
        textarea.onkeyup = (e)=>{
            console.log(textarea.value)
            this.mgr.onKeyborad(e, textarea.value);
            this.textarea.focus();
        };
        document.body.appendChild(textarea);
        this.textarea = textarea;
    }
}