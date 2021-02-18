import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { sample, timestamp } from "rxjs/operators";
import { Rect2d } from "../projection";

export class ExCanvasRenderingContext2D {
    PIXEL_RATIO = 1.0;
    pixelRatio() {
        let dpr = window['devicePixelRatio'] ||
            window['webkitDevicePixelRatio'] ||
            window['mozDevicePixelRatio'] || 1;
        let bsr = this.context['webkitBackingStorePixelRatio'] ||
            this.context['mozBackingStorePixelRatio'] ||
            this.context['msBackingStorePixelRatio'] ||
            this.context['oBackingStorePixelRatio'] ||
            this.context['backingStorePixelRatio'] || 1;
        this.PIXEL_RATIO = dpr / bsr;
    }
    createCanvas(container: HTMLElement, adjust = true){
        if(!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');
        }
        if(adjust) {
            this.pixelRatio();
        }
        let w = this.container.clientWidth, h = this.container.clientHeight;
        container.style.height = h + 'px'; 
        this.canvas.width = w * this.PIXEL_RATIO;
        this.canvas.height = h * this.PIXEL_RATIO;
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.context.imageSmoothingEnabled = true;
        //this.context.translate(0.5, 0.5);
        //this.context.setTransform(this.PIXEL_RATIO, 0, 0, this.PIXEL_RATIO, 0, 0)
        container.append(this.canvas);
        
        return this.canvas;
    }
    context: CanvasRenderingContext2D = null;
    canvas: HTMLCanvasElement = null;
    constructor(public container: HTMLElement, adjust = true) {
        this.createCanvas(container, adjust);
        this.methods.forEach(m => {
            this[m] = (...args) => {
                args = args.map( (a) => {
                    return a * this.PIXEL_RATIO;
                });
                this.context[m].apply(this.context, args);
            }
        })
    }
    methods = [
        'fillRect' ,
        'clearRect' ,
        'strokeRect' ,
        'moveTo' ,
        'lineTo' ,
        'arcTo' ,
        'bezierCurveTo' ,
        'isPointinPath' ,
        'isPointinStroke' ,
        'quadraticCurveTo' ,
        'rect' ,
        'translate' ,
        'createRadialGradient',
        'createLinearGradient'
    ]
    fillRect = (...args)=>{};
    clearRect = (...args)=>{};
    strokeRect = (...args)=>{};
    moveTo = (...args)=>{};
    lineTo = (...args)=>{};
    arcTo = (...args)=>{};
    bezierCurveTo = (...args)=>{};
    isPointinPath = (...args)=>{};
    isPointinStroke = (...args)=>{};
    quadraticCurveTo = (...args)=>{};
    rect = (...args)=>{};
    translate = (...args)=>{};
    createRadialGradient = (...args)=>{};
    createLinearGradient = (...args)=>{};
    stroke(){
        const lineWidth = this.context.lineWidth;
        this.context.lineWidth *= this.PIXEL_RATIO;
        this.context.stroke();
        this.context.lineWidth = lineWidth;
    }
    fillText(text: string, x: number, y: number, maxWidth?: number){
        const font = this.context.font;
        this.context.font = this.context.font.replace(
            /(\d+)(px|em|rem|pt)/g,
            (w, m, u) => {
                return (m * this.PIXEL_RATIO) + u;
            }
        );
        this.context.fillText(text, x * this.PIXEL_RATIO, y * this.PIXEL_RATIO, maxWidth);
        this.context.font = font;
    }
    strokeText(text: string, x: number, y: number, maxWidth?: number){
        const font = this.context.font;
        this.context.font = this.context.font.replace(
            /(\d+)(px|em|rem|pt)/g,
            (w, m, u) => {
                return (m * this.PIXEL_RATIO) + u;
            }
        );
        this.context.strokeText(text, x * this.PIXEL_RATIO, y * this.PIXEL_RATIO, maxWidth);
        this.context.font = font;
    }
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean){
        this.context.arc(x * this.PIXEL_RATIO, y * this.PIXEL_RATIO, radius * this.PIXEL_RATIO, startAngle, endAngle, anticlockwise)
    }
}
interface Renderable {
    render(ex: ExCanvasRenderingContext2D);
}
abstract class Rect extends Rect2d implements Renderable{
    children: Rect[] = [];
    constructor(_x = 0, _y = 0, _w = 0, _h = 0, _angle = 0, protected parent: Rect = null) {
        super(_x, _y, _w, _h);
    }
    abstract render(ex: ExCanvasRenderingContext2D);
    update(ex: ExCanvasRenderingContext2D) {
        ex.context.save();
        ex.context.translate(this.offset.x, this.offset.y);
        if(this.angle < -0.00001 || this.angle > 0.00001 ) {
            ex.context.rotate(this.angle);
        }
        this.render(ex);
        this.children.forEach(child => {
            child.update(ex);
        })
        ex.context.restore();
    }
    absoluteUpdate(){
        this.children.forEach(child => {
            child.x = this.absolute('x') + child.offset.x;
            child.y = this.absolute('y') + child.offset.y;
            child.absoluteUpdate();
        })
    }
    absolute(prop:string = 'x') {
        let a = this[prop];
        let parent = this.parent;
        while(parent) {
            a += parent[prop];
            parent = parent.parent;
        }
        return a;
    }
    attach(child: Rect){
        this.children.push(child);
        this.children.forEach(c => c.parent = this);
    }
}
class Circle extends Rect implements Renderable {
    color = '#87ceeb';
    render(ex: ExCanvasRenderingContext2D) {
        const radius = Math.min(this.w, this.h)/2.0;
        ex.context.beginPath();
        ex.arc(radius, 0, radius, 0, 2 * Math.PI, false);
        ex.context.fillStyle = this.color;
        ex.context.fill();
        ex.context.lineWidth = 1;
        ex.context.strokeStyle = this.color;
        ex.stroke();
    }
}
class Solid extends Rect implements Renderable {
    color = '#87ceeb';
    render(ex: ExCanvasRenderingContext2D) {
        ex.context.fillStyle = this.color;
        ex.fillRect(0, 0, this.w, this.h);
    }
}
class Border extends Rect implements Renderable {
    width = 1;
    color = '#87ceeb';
    render(ex: ExCanvasRenderingContext2D){
        ex.context.lineWidth = this.width;
        ex.context.strokeStyle = this.color;
        ex.context.beginPath();
        ex.rect(0.5, 0.5, this.w, this.h);
        ex.stroke();
    }
}
class Group extends Rect implements Renderable {
    pointRadius = 4;
    scalePoint: Solid = null;
    rotatePoint: Circle = null;
    startPoint: {x: number, y: number} = null;
    endPoint = {x: -1, y: -1};
    border: Border = null;
    padding = 5;
    isFocus = false;
    isScale = false;
    isRotate = false;
    
    mouseDown = false;
    constructor(protected ex: ExCanvasRenderingContext2D, x = 0, y = 0, w = 0, h = 0, ) {
        super();
        
        this.scalePoint = new Solid();
        this.attach(this.scalePoint);

        this.rotatePoint = new Circle();
        this.attach(this.rotatePoint);

        this.border = new Border();
        this.attach(this.border);

        this.reset(x, y, w, h); 
    }
    reset(x, y, w, h){
        this.reset(this.x, this.y, w, h);
        this.border.reset(- this.padding, - this.padding, this.w + (this.padding*2),  this.h + (this.padding*2));
        this.rotatePoint.reset(this.w + this.padding - this.pointRadius, - this.pointRadius, this.pointRadius*2,  this.pointRadius*2);
        this.scalePoint.reset(this.w + this.padding - this.pointRadius, this.h + this.padding - this.pointRadius, this.pointRadius*2, this.pointRadius*2);
    }
    getAngle(offsetX, offsetY){
        return Math.atan(offsetY/offsetX);
    }
    render(ex: ExCanvasRenderingContext2D) {
    }
    onMousedown(x: number, y: number) {
        this.isFocus = this.includes(x, y);
        this.isScale = this.scalePoint.includes(x, y);
        this.isRotate = this.rotatePoint.includes(x, y);
        /* if(!this.startPoint) {
            this.startPoint = {x : super.absolute('x'), y : super.absolute('y')}
        } */
        if(this.isFocus){
            /* this.endPoint.x = x - super.absolute('x');
            this.endPoint.y = y - super.absolute('y'); */
            this.startPoint.x = x;
            this.startPoint.y = y;
        }
        console.log('onMousedown isRotate', this.isRotate);
    }
    onMousemove(x: number, y: number) {
        if(this.isFocus && !this.isScale && !this.isRotate){
            //super.translate(x - this.startPoint.x - this.endPoint.x, y - this.startPoint.y - this.endPoint.y);       
            this.translateTo(x - this.startPoint.x, y - this.startPoint.y);
        }else if(this.isScale) {
            this.reset(x, y, x - this.startPoint.x, y - this.startPoint.y)
        }else if(this.isRotate) {
            this.rotate(this.getAngle(x - this.startPoint.x, y - this.startPoint.y));
        }
        console.log('onMousemove isRotate', this.isRotate, x, y, this.startPoint, x - this.startPoint.x, y - this.startPoint.y, this.absolute('_x'), this.absolute('_y'), super.angle);
    }
    onMouseup() {
        this.isFocus = false;
        this.isScale = false;
        this.isRotate = false;
        console.log('onMouseup',   this.x, this.y, this.w, this.h)
    }
} 

export class Text extends Group {
    font = '16px Arial';
    color = '#000';
    focusIndex = 0;
    constructor(ex: ExCanvasRenderingContext2D, public str = '') {
        super(ex);
    }
    measureText(ex: ExCanvasRenderingContext2D, str: string) {
        let metrics = ex.context.measureText(str);
        let h = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        let w = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
        return {width: w, height: h};
    }
    renderWrappingText(ex: ExCanvasRenderingContext2D, str: string){
        console.log('wrap', str);
        let W = 0, H = 0, x = 0, y = 0;
        let offset = this.measureText(ex, '|');
        for(let i = 0; i < str.length; i ++) {
            ex.fillText(str[i], x, y);
            //console.log(x, y, str[i]);
            let {width, height} = this.measureText(ex, str[i]);
            if(x + width > this.w + offset.height || str[i] == '\n') {
                x = 0;
                y += (height || offset.height) + this.padding;
            }else{
                x += width;
            }
            W = x > W ? x : W;
            H = y;
        }
        this.reset(- this.padding, - offset.height - this.padding, Math.max(this.w, W + offset.height + this.padding) , Math.max(this.h, H + offset.height + this.padding) );
    }
    render(ex: ExCanvasRenderingContext2D) {
        super.render(ex);
        ex.context.font = this.font;
        ex.context.fillStyle = this.color;
        this.renderWrappingText(ex, this.str);
    }
    onMousedown(x: number, y: number) {
        super.onMousedown(x, y);
    }
    onKeyUp(e: KeyboardEvent, str: string) {
        if (this.isFocus) {
            //e.preventDefault();
        }
        if (this.isFocus && e.key === "Backspace") {
            let txt = "";
            for (let i = 0; i < str.length; i++) {
                if (i !== this.focusIndex - 1) {
                    txt += str[i];
                }
            }
            str = txt;
            this.focusIndex--;
            if (this.focusIndex < 0) {
                this.focusIndex = 0;
            }
        }
        if(this.isFocus && this.str != str) {
            this.str = str;
        }
    }
}

export class RenderManger extends Rect {
    constructor(private ex: ExCanvasRenderingContext2D){
        super(0, 0, ex.canvas.width, ex.canvas.height);
    }
    render() {
        this.ex.context.clearRect(0, 0, this.ex.canvas.width, this.ex.canvas.height);
        this.ex.context.save();
        this.ex.context.translate(this.x, this.y);
        if(this.angle < -0.00001 || this.angle > 0.00001 ) {
            this.ex.context.rotate(this.angle);
        }
        this.children.forEach((child: Text) => {
            child.update(this.ex);
        })
        this.ex.context.restore();
    }
    debug = 1;
    createText(){
        if(this.debug == 1) {
            let text = new Text(this.ex);
            text.translate(0, 0);
            this.attach(text);
            this.debug = 2;
        }
    }
    onMousedown(event) {
        this.children.forEach((child: Text) => {
            console.log('onMousedown', event, this.x, this.y);
            child.onMousedown(
                (event.x || event.changedTouches[0].clientX) - event.target.getBoundingClientRect().left, 
                (event.y || event.changedTouches[0].clientY) - event.target.getBoundingClientRect().top);
        })
        this.render();
    }
    onMousemove(event) {
        this.children.forEach((child: Text) => {
            child.onMousemove(
                (event.x || event.changedTouches[0].clientX) - event.target.getBoundingClientRect().left, 
                (event.y || event.changedTouches[0].clientY) - event.target.getBoundingClientRect().top);
        })
        this.render();
    }
    onMouseup(){
        this.children.forEach((child: Text) => {
            child.onMouseup();
        })
        this.render();
    }
    onKeyUp(e: KeyboardEvent, str: string) {
        this.children.forEach((child: Text) => {
            child.onKeyUp(e, str);
        })
        this.render();
    }
}