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
        let w = this.container.clientWidth, h = this.container.clientHeight;
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
class Rect {
    update(ex: ExCanvasRenderingContext2D) {
        ex.context.save();
        ex.context.translate(this.x, this.y);
        if(this.angle < -0.00001 || this.angle > 0.00001 ) {
            ex.context.rotate(this.angle);
        }
        if(this['render']) {
            this['render'](ex);
        }
        this.children.forEach(a => {
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
        return this._h;
    }
    children: Renderable[] = [];
    attach(child: Renderable){
        this.children.push(child);
    }
}
class Circle extends Rect implements Renderable {
    color = '#87ceeb';
    render(ex: ExCanvasRenderingContext2D) {
        const radius = Math.min(this.w, this.h)/2.0;
        ex.context.beginPath();
        ex.arc(this.x + radius, this.y + radius/2.0, radius, 0, 2 * Math.PI, false);
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
        ex.fillRect(this.x, this.y, this.w, this.h);
    }
}
class Border extends Rect implements Renderable {
    width = 1;
    color = '#87ceeb';
    render(ex: ExCanvasRenderingContext2D){
        ex.context.lineWidth = this.width;
        ex.context.strokeStyle = this.color;
        ex.context.beginPath();
        ex.rect(this.x + 0.5, this.y + 0.5, this.w, this.h);
        ex.stroke();
    }
}
class Group extends Rect implements Renderable {
    pointRadius = 3;
    scalePoint: Solid = null;
    rotatePoint: Circle = null;
    border: Border = null;
    padding = 5;
    isFocus = false;
    isScale = false;
    isRotate = false;
    mouseDown = false;
    constructor(protected ex: ExCanvasRenderingContext2D, x = 0, y = 0, w = 0, h = 0, ) {
        super(x, y, w, h);
        
        this.scalePoint = new Solid(0, 0, this.pointRadius*2, this.pointRadius*2);
        this.scalePoint.translate(w - this.pointRadius, h - this.pointRadius);
        this.attach(this.scalePoint);

        this.rotatePoint = new Circle(0, 0, this.pointRadius*2, this.pointRadius*2);
        this.rotatePoint.translate(w - this.pointRadius,  - this.pointRadius);
        this.attach(this.rotatePoint);

        this.border = new Border(0, 0, w, h);
        this.border.translate(- this.padding, - this.padding);
        this.border.scale(x + w, y + h);
        this.attach(this.border);
    }
    render(ex: ExCanvasRenderingContext2D) {
    }
    onMousedown(x: number, y: number) {
        this.isFocus = this.detect(x, y);
        this.isScale = this.scalePoint.detect(x, y);
        this.isRotate = this.rotatePoint.detect(x, y);
    }
    onMousemove(x: number, y: number) {
        console.log('isFocus', this.isFocus, 'isScale', this.isScale, 'isRotate', this.isRotate, x, y)
        if(this.isFocus && !this.isScale && !this.isRotate){
            this.translate(x, y);
        }else if(this.isScale) {
            this.scale(x, y);
            this.border.scale(x, y)
            this.scalePoint.translate(x, y);
            this.rotatePoint.translate(x, this.scalePoint.y);
        }else if(this.isRotate) {
            this.rotate(x, y);
        }
    }
    onMouseup() {
        this.isScale = false;
        this.isRotate = false;
    }
} 

export class Text extends Group {
    font = '16px Arial';
    color = '#000';
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
        this.border.translate(- this.padding, - offset.height - this.padding);
        this.border.scale(W + offset.height + this.padding , H + this.padding);
        this.scalePoint.translate(W + offset.height + this.padding - this.pointRadius, H + this.padding - this.pointRadius );
        this.rotatePoint.translate(W + offset.height + this.padding - this.pointRadius, - offset.height - this.padding);
        console.log('border', W, H);
    }
    render(ex: ExCanvasRenderingContext2D) {
        super.render(ex);
        ex.context.font = this.font;
        ex.context.fillStyle = this.color;
        this.renderWrappingText(ex, this.str);
    }
    onMousedown(x: number, y: number) {
        super.onMousedown(x, y);
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
        this.children.forEach((child: Text) => {
            child.update(this.ex);
        })
    }
    debug = 1;
    createText(){
        if(this.debug == 1) {
            let text = new Text(this.ex);
            text.translate(this.x, this.y);
            this.attach(text);
            this.debug = 2;
        }
    }
    onMousedown(event: MouseEvent) {
        this.children.forEach((child: Text) => {
            child.onMousedown(event.x - this.x, event.y - this.y);
        })
        this.render();
    }
    onMousemove(event: MouseEvent) {
        this.children.forEach((child: Text) => {
            child.onMousemove(event.x - this.x, event.y - this.y);
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