import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { sample, timestamp } from "rxjs/operators";

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
        if (this.PIXEL_RATIO > 1) {
            let w = this.container.clientWidth, h = this.container.clientHeight;
            this.canvas.width = w * this.PIXEL_RATIO;
            this.canvas.height = h * this.PIXEL_RATIO;
            this.canvas.style.width = w + 'px';
            this.canvas.style.height = h + 'px';
        }
        this.context.imageSmoothingEnabled = true;
        this.context.translate(0.5, 0.5);
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
class Rect {
    move(ex: ExCanvasRenderingContext2D, renderable: Renderable) {
        ex.context.save();
        ex.context.translate(this.x, this.y);
        if(this.angle < -0.00001 || this.angle > 0.00001 ) {
            ex.context.rotate(this.angle);
        }
        if(renderable) {
            renderable.render(ex);
        }
        this.fixedGroup.forEach(a => {
            a.render(ex);
        })
        ex.context.restore();
    }
    constructor(private _x = 0, private _y = 0, private _w = 0, private _h = 0, private _angle = 0) {
    }
    translate(x, y){
        this._x = x;
        this._y = y;
    }
    scale(x, y){
        this._w = x - this._x;
        this._h = y - this._y;
    }
    rotate(x, y, angle = 0){
        if(!angle){
            let offsetX = x - this.x;
            let offsetY = y - this.y;
            this._angle = Math.atan(offsetY/offsetX);
        }else {
            this._angle = angle;
        }
        
    }
    detect(x: number, y: number){
        return x - this.x < this.w && y - this.y < this.h;
    }
    get angle() {
        return this._angle;
    }
    get x(){
        return this._x;
    }
    get y(){
        return this._y;
    }
    get w(){
        return this._w;
    }
    get h(){
        return this._y;
    }
    fixedGroup: Renderable[] = [];
    attach(attachment: Renderable){
        this.fixedGroup.push(attachment);
    }
}
class Circle extends Rect implements Renderable {
    color = '#87ceeb';
    render(ex: ExCanvasRenderingContext2D) {
        ex.arc(this.w/2.0, this.h/2.0, Math.min(this.w, this.h)/2.0, 0, 2 * Math.PI, false);
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
        ex.rect(0, 0, this.w, this.h);
        ex.stroke();
    }
}
class Movable extends Border {
    pointRadius = 3;
    scalePoint: Solid = null;
    rotatePoint: Circle = null;
    isFocus = false;
    isScale = false;
    isRotate = false;
    mouseDown = false;
    constructor(protected ex: ExCanvasRenderingContext2D, x = 0, y = 0, w = 0, h = 0, ) {
        super(x, y, w, h);
        
        this.scalePoint = new Solid(x + w - this.pointRadius, -this.pointRadius, this.pointRadius*2, this.pointRadius*2);
        this.attach(this.scalePoint);

        this.rotatePoint = new Circle(x + w - this.pointRadius, y + h - this.pointRadius, this.pointRadius*2, this.pointRadius*2);
        this.attach(this.scalePoint);
    }
    
    onMousedown(event: MouseEvent) {
        this.isFocus = this.detect(event.x, event.y);
        this.isScale = this.scalePoint.detect(event.x, event.y);
        this.isRotate = this.rotatePoint.detect(event.x, event.y);
    }
    onMousemove(event: MouseEvent) {
        if(this.isFocus && !this.isScale && !this.isRotate){
            this.translate(event.x, event.y);
        }else if(this.isScale) {
            this.scale(event.x, event.y);
            this.scalePoint.translate(event.x, event.y);
            this.rotatePoint.translate(event.x, this.scalePoint.y);
        }else if(this.isRotate) {
            this.rotate(event.x, event.y);
        }
        this.move(this.ex, this);
    }
    onMouseup() {
        this.isFocus = false;
        this.isScale = false;
        this.isRotate = false;
    }
} 

export class Text extends Movable {
    font = '16px Arial';
    color = '#000';
    padding = 5;
    focusIndex = 0;
    constructor(ex: ExCanvasRenderingContext2D, public str = '') {
        super(ex, 0, 0, 64, 32);
    }
    measureText(ex: ExCanvasRenderingContext2D, str: string) {
        let metrics = ex.context.measureText(str);
        let h = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        let w = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
        return {width: w, height: h};
    }
    renderWrappingText(ex: ExCanvasRenderingContext2D, str: string){
        let start = 0, end = 1, W = 0, H = 0, x = 0, y = 0;
        let offset = this.measureText(ex, ' ').height;
        for(let i = 0; i < str.length; i ++) {
            let {width, height} = this.measureText(ex, str.substring(start, end));
            if(x + width >= this.w ||str[i] == '\n') {
                W = x + width > W ? x + width : W;
                x = 0;
                y += height || offset;
                start = i;
                end = i + 1;
            }else{
                x += width;
                end = i + 1;
            }
            H = height;
            ex.fillText(str[i], this.x + this.padding + x, this.y + this.padding + y);
        }
        this.scale(W + (this.padding*2), y + H +(this.padding*2));
    }
    render(ex: ExCanvasRenderingContext2D) {
        ex.context.font = this.font;
        ex.context.fillStyle = this.color;
        this.renderWrappingText(ex, this.str)
    }
    onMousedown(e: MouseEvent) {
        super.onMousedown(e);
        if (this.isFocus) {
            
        }
    }
    onKeyUp(e: KeyboardEvent, str: string) {
        if (this.isFocus) {
            e.preventDefault();
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
        if(this.str != str) {
            this.str = str;
            this.render(this.ex);
        }
    }
}
