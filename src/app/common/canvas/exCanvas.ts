import { Matrix, Rect2d, Vector2d } from "../projection";

export class ExCanvasRenderingContext2D {
    dummyfont = null;
    measureText(str: string) {
        let metrics = this.context.measureText(str);
        let h = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        let w = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
        return {width: w, height: h};
    }
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
        this.dummyfont = this.measureText('|');
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
class Renderable extends Rect2d {
    children: Renderable[] = [];
    boundingbox = new Matrix();
    printable: boolean = true;
    visible: boolean = true;
    constructor(_x = 0, _y = 0, _w = 0, _h = 0, _angle = 0) {
        super(_w, _h);
        this.position.x = _x;
        this.position.y = _y;
        this.angle = _angle;
    }
    before(ex: ExCanvasRenderingContext2D) {
        ex.context.save();
        ex.context.translate(this.position.x, this.position.y);
        if(this.angle < -0.00001 || this.angle > 0.00001 ) {
            ex.context.rotate(this.angle);
        }
    }
    render(ex: ExCanvasRenderingContext2D, print: boolean = false) {
        this.before(ex);
        if(print) {
            if(this.printable) this.draw(ex);
        }else {
            if(this.visible) this.draw(ex)
        }
        this.children.forEach(child => {
            child.render(ex, print);
        })
        this.after(ex);
    }
    after(ex: ExCanvasRenderingContext2D) {
        ex.context.restore();
    }
    draw(ex: ExCanvasRenderingContext2D) {

    }
    initBoundingbox(parent: Matrix){
        if(parent){
            this.boundingbox.transform(-this.position.x, -this.position.y, this.angle).rightMultiply(parent)
        }else{
            this.boundingbox.transform(-this.position.x, -this.position.y, this.angle);
        }
    }
    updateBoundingbox() {
        this.children.forEach(child => {
            child.initBoundingbox(this.boundingbox);
            child.updateBoundingbox();
        })
    }
    includes(point: Vector2d) {
        let x = point.x*this.boundingbox.a00+point.y*this.boundingbox.a10+this.boundingbox.a20;
        let y = point.x*this.boundingbox.a01+point.y*this.boundingbox.a11+this.boundingbox.a21;
        return x > 0 && y > 0 && x < this.w && y < this.h;
    }
    attach(child: Renderable, index = -1) {
        if(index >= 0)  {
            this.children.splice(index, 0, child);
        }else { 
            this.children.push(child);
        }
    }
    remove(child: Renderable, index = -1) {
        if(index >= 0)  {
            this.children.splice(index, 1);
        }else { 
            this.children.splice(this.children.findIndex(c => c==child),1);
        }
    }
    toJson(){
        let caption = this.children.find(e=>e['str'] && e['str'].length > 0);
        return {
            name: 'Renderable', 
            caption: caption ? caption['str'] : null,
            position: this.position, w: this.w, h: this.h, angle: this.angle, 
            children: this.children.map(e=>e.toJson())
        };
    }
    fromJson(json){
        if(json && json.name == 'Renderable') {
            this.position.copy(json.position);
            this.w = json.w;
            this.h = json.h;
            this.angle = json.angle;
            this.children = json.children.map(e=>
                (new classes[e.name](e.position.x, e.position.y, e.w, e.h, e.angle)).fromJson(e)
            );
        }
        return this;
    }
}
interface TouchHandler{
    down(touch: Vector2d); 
    move(offset: Vector2d);
    up();
}
interface KeyHandler{
    key(data: {key: string, str: string});
}
class Dispatcher {
    dispatch(root: Renderable, command:string, data: any) {
        root.children.forEach(child => {
            let invalid = false;
            if(child[command]) {
                invalid = child[command].call(child, data)
            }
            if(!invalid) {
                this.dispatch(child, command, data);
            }
        });
    }
}
class Touch extends Dispatcher{
    start = new Vector2d();
    point = new Vector2d();
    offset = new Vector2d();
    X(event) {
        return (event.x || event.changedTouches[0].clientX) - event.target.getBoundingClientRect().left
    }
    Y(event) {
        return (event.y || event.changedTouches[0].clientY) - event.target.getBoundingClientRect().top;
    }
    A(offsetX, offsetY){
        return Math.atan(offsetY/offsetX);
    }
    onDown(root: Renderable, event) {
        this.point.x = this.offset.x = this.X(event);
        this.point.y = this.offset.y = this.Y(event);
        if(event['onResult']){
            this.point['onResult'] = event['onResult'];
        }
        this.dispatch(root, 'down', this.point);
    }
    onMove(root: Renderable, event) {
        let X = this.X(event), Y = this.Y(event);
        this.offset.x = X - this.offset.x;
        this.offset.y = Y - this.offset.y;
        this.dispatch(root, 'move', this.offset);
        this.offset.x = X;
        this.offset.y = Y;
    }
    onUp(root: Renderable) {
        this.dispatch(root, 'up', 0);
    }
    onKey(root: Renderable, event: KeyboardEvent, str) {
        this.dispatch(root, 'key', {key:event.key, str:str});
    }
}

class Circle extends Renderable {
    color = '#87ceeb';
    draw(ex: ExCanvasRenderingContext2D) {
        const radius = Math.min(this.w, this.h)/2.0;
        ex.context.beginPath();
        ex.arc(radius, radius, radius, 0, 2 * Math.PI, false);
        ex.context.fillStyle = this.color;
        ex.context.fill();
        ex.context.lineWidth = 1;
        ex.context.strokeStyle = this.color;
        ex.stroke();
    }
    toJson() {
        return {
            ...super.toJson(),
            name: 'Circle',
            color: this.color,
        }
    }
    fromJson(json) {
        if(json.name == 'Circle') {
            super.fromJson(json);
            this.color = json.color;
            return this;
        }
    }
}
class Solid extends Renderable {
    color = '#87ceeb';
    draw(ex: ExCanvasRenderingContext2D) {
        ex.context.fillStyle = this.color;
        ex.fillRect(0, 0, this.w, this.h);
    }
    toJson() {
        return {
            ...super.toJson(),
            name: 'Solid',
            color: this.color,
        }
    }
    fromJson(json) {
        if(json.name == 'Solid') {
            super.fromJson(json);
            this.color = json.color;
            return this;
        }
    }
}
class Border extends Renderable {
    width = 1;
    borderColor = '#87ceeb';
    draw(ex: ExCanvasRenderingContext2D){
        ex.context.lineWidth = this.width;
        ex.context.strokeStyle = this.borderColor;
        ex.context.beginPath();
        ex.rect(0.5, 0.5, this.w, this.h);
        ex.stroke();
    }
    toJson() {
        return {
            ...super.toJson(),
            name: 'Border',
            width: this.width,
            borderColor: this.borderColor,
        }
    }
    fromJson(json) {
        if(json.name == 'Border') {
            super.fromJson(json)
            this.width = json.width;
            this.borderColor = json.borderColor;
            return this;
        }
    }
}
class IconImage extends Renderable {
    image = new Image();
    color;
    load(src, onload = null){
        this.image.src = src;
        this.src = src;
        this.image.onload = () => {
            if(onload){
                onload();
            }
        };
    }
    constructor(public src){
        super();
        this.image.src = src;
        this.src = src;
    }
    draw(ex: ExCanvasRenderingContext2D){
        if(this.src) {
            ex.context.drawImage(this.image, 0,0,this.image.width,this.image.height,0,0,this.w,this.h);
        }
    }
    toJson() {
        return {
            ...super.toJson(),
            name: 'IconImage',
            src: this.src,
        }
    }
    fromJson(json) {
        if(json.name == 'IconImage') {
            super.fromJson(json);
            this.src = json.src;
            return this;
        }
    }
}

class BackgroundImage extends Renderable {
    image = new Image();
    src = null;
    load(src, onload = null){
        this.image.src = src;
        this.src = src;
        this.image.onload = () => {
            if(onload){
                onload();
            }
        };
    }
    draw(ex: ExCanvasRenderingContext2D){
        if(this.src) {
            // 
            ex.context.drawImage(this.image, 0, 0);
        }
    }
    toJson() {
        return {
            ...super.toJson(),
            name: 'BackgroundImage',
            src: this.src,
        }
    }
    fromJson(json) {
        if(json.name == 'BackgroundImage') {
            super.fromJson(json);
            this.src = json.src;
            return this;
        }
    }
}
class StickBorder extends Border implements TouchHandler{
    stick = {
        padding : 6,
        config : new IconImage('./assets/img/gear.svg'),
        scale : new IconImage('./assets/img/resize.svg'),
        rotate : new IconImage('./assets/img/rotate.svg'),
        activeColor: '#87ceeb',
        inactiveColor: '#cacaca'
    }
    isConfig = false;
    isFocus = false;
    isScale = false;
    isRotate = false;

    constructor() {
        super();
        this.attach(this.stick.config);
        this.attach(this.stick.scale);
        this.attach(this.stick.rotate);
    }
    down(touch: Vector2d) {
        this.isConfig = this.stick.config.includes(touch)
        this.isFocus = this.includes(touch);
        this.isScale = this.stick.scale.includes(touch);
        this.isRotate = this.stick.rotate.includes(touch);

        if(this.isFocus || this.isScale || this.isRotate || this.isConfig){
            RenderManger.selected = this;
            this.borderColor = this.stick.activeColor;
            this.stick.config.visible = true;
            this.stick.scale.visible = true;
            this.stick.rotate.visible = true;
        }else {
            this.borderColor = this.stick.inactiveColor;
            this.stick.config.visible = false;
            this.stick.scale.visible = false;
            this.stick.rotate.visible = false;
        }

        if(this.isConfig && touch['onResult']) {
            touch['onResult']();
        }
    }
    move(offset: Vector2d) {
        if(this.isFocus && !this.isScale && !this.isRotate){
            this.translate(offset.x, offset.y);
        }else if(this.isScale) {
            this.scale(offset.x, offset.y)
        }else if(this.isRotate) {
            this.rotate(this.stick.rotate.position.radius2(offset));
            //console.log('rotate', offset, this.angle)
        }
        if(this.position.x > 10){
            let i = 1;
        }
    }
    up() {
        this.isScale = false;
        this.isRotate = false;
    }
    scale(w, h){
        super.scale(w, h);
        this.stick.config.reset(- this.stick.padding, - this.stick.padding, this.stick.padding*2,  this.stick.padding*2);
        this.stick.rotate.reset(this.w - this.stick.padding, - this.stick.padding, this.stick.padding*2,  this.stick.padding*2);
        this.stick.scale.reset(this.w - this.stick.padding, this.h - this.stick.padding, this.stick.padding*2, this.stick.padding*2);
    }
    scaleTo(w, h){
        super.scaleTo(w, h);
        this.stick.config.reset(- this.stick.padding, - this.stick.padding, this.stick.padding*2,  this.stick.padding*2);
        this.stick.rotate.reset(this.w - this.stick.padding, - this.stick.padding, this.stick.padding*2,  this.stick.padding*2);
        this.stick.scale.reset(this.w - this.stick.padding, this.h - this.stick.padding, this.stick.padding*2, this.stick.padding*2);
    }
    toJson() {
        return {
            ...super.toJson(),
            name: 'StickBorder',
            stick: {
                padding: this.stick.padding,
                activeColor: this.stick.activeColor,
                inactiveColor: this.stick.inactiveColor
            },
        }
    }
    fromJson(json) {
        if(json.name == 'StickBorder') {
            super.fromJson(json);
            this.stick.padding = json.stick.padding;
            this.stick.activeColor = json.stick.activeColor;
            this.stick.inactiveColor = json.stick.inactiveColor;
            return this;
        }
    }
} 

export class StickText extends StickBorder implements KeyHandler {
    padding = 5;
    font = '16px Arial';
    color = '#000';
    focusIndex = 0;
    str = '';

    limitWidth = 5;
    layoutStr(ex: ExCanvasRenderingContext2D) {
        ex.dummyfont = ex.measureText('|');
        let x = this.padding, y = this.padding + ex.dummyfont.height, fontSize = null, maxw = x;
        if(this.isScale && this.limitWidth > 0) {
            this.limitWidth = -1;
        }
        for(let i = 0 ; i < this.str.length ; i ++) {
            fontSize = ex.measureText(this.str[i]);
            if ((this.limitWidth > 0 && i > 0 && i % this.limitWidth == 0) || this.str[i] == '\n' || (this.limitWidth < 0 && (x + fontSize.width + this.padding > this.w))) {
                x = this.padding;
                y += (fontSize.height || ex.dummyfont.height) + this.padding;
            }
            ex.fillText(this.str[i], x, y);
            //console.log(x, y, this.str[i], fontSize.width)
            x += fontSize.width;
            if(x > maxw){
                maxw = x;
            }
        }
        if(this.limitWidth < 0){
            this.scaleTo(
                Math.max(maxw + this.padding, this.w),
                Math.max(y + this.padding, this.h), 
            );
        }else {
            this.scaleTo(
                maxw + this.padding,
                y + this.padding, 
            );
        }
    }
    draw(ex: ExCanvasRenderingContext2D) {
        ex.context.font = this.font;
        ex.context.fillStyle = this.color;
        this.layoutStr(ex);
        super.draw(ex);
    }
    key(data: { key: string; str: string; }) {
        if(this.isFocus) 
            this.str = data.str;
    }
    toJson() {
        return {
            ...super.toJson(),
            name: 'StickText',
            padding: this.padding,
            font: this.font,
            color: this.color,
            str: this.str
        }
    }
    fromJson(json) {
        if(json.name == 'StickText') {
            super.fromJson(json);
            this.padding = json.padding;
            this.font = json.font;
            this.color = json.color;
            this.str = json.str;
            return this;
        }
    }
}
const classes = { Circle, Solid, Border, BackgroundImage, StickBorder, StickText };
export class RenderManger extends Touch {
    static selected: Renderable = null;
    root = new Renderable();
    constructor(private ex: ExCanvasRenderingContext2D){
        super();
    }
    clear() {
        this.ex.context.clearRect(0, 0, this.ex.canvas.width, this.ex.canvas.height);
        this.root.initBoundingbox(null)
        this.root.updateBoundingbox();
    }
    render() {
        this.root.render(this.ex);
    }
    onDown(event) {
        this.clear();
        super.onDown(this.root, event);
        this.render();
    }
    onMove(event) {
        this.clear();
        super.onMove(this.root, event);
        this.render();
    }
    onUp() {
        this.clear();
        super.onUp(this.root);
        this.render()
    }
    onKeyborad(event: KeyboardEvent, str) {
        this.clear();
        super.onKey(this.root, event, str);
        this.render();
    }
    save() {
        return this.root.toJson();
    }
    load(json) {
        this.root = new Renderable();
        this.root.fromJson(json);
        this.render();
    }
    print() {
        this.root.render(this.ex, true);
        return this.ex.canvas.toDataURL("image/jpeg");
    }
    createText(){
        this.clear();
        let st = new StickText();
        this.root.attach(st);
        st.isFocus = true;
        RenderManger.selected = st;
        this.render();
    }
    removeText(){
        this.clear();
        if(RenderManger.selected) {
            this.root.remove(RenderManger.selected);
            RenderManger.selected = null;
            this.render();
        }
    }
    changeColor(color: string){
        this.clear();
        if(RenderManger.selected && RenderManger.selected.hasOwnProperty('color')) {
            RenderManger.selected['color'] = color;
            this.render();
        }
    }
    changeFont(font: string){
        this.clear();
        if(RenderManger.selected && RenderManger.selected.hasOwnProperty('font')) {
            RenderManger.selected['font'] = font;
            // this.ex.context.font = font;
            // this.ex.dummyfont = this.ex.measureText('|');
            this.render();
        }
    }
    changeStr(str: string){
        this.clear();
        if(RenderManger.selected && RenderManger.selected.hasOwnProperty('str')) {
            RenderManger.selected['str'] = str;
            this.render();
        }
    }
    createBackgroundImage(src){
        this.clear();
        if(this.root.children[0] && this.root.children[0]['image']) {
            let bg = this.root.children[0] as BackgroundImage;
            bg.load(src, ()=>{
                this.render();
            });
        }else {
            let bg = new BackgroundImage();
            this.root.attach(bg, 0);
            bg.load(src, ()=>{
                this.render();
            });
        }
    }
    removeBackgroundImage(){
        this.clear();
        if(this.root.children[0]['image']) {
            this.root.remove(null, 0);
            this.render();
        }
    }
}