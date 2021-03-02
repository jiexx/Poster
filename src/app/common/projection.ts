export interface IVector2d {
    x: number;
    y: number;
};
interface IMatrix2d {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};
interface IMultiply2d {
    (v1: IVector2d, v2: IMatrix2d): IVector2d;
};
interface IAdd2d {
    (v1: IVector2d, v2: IVector2d): IVector2d;
};
interface ISub2d {
    (v1: IVector2d, v2: IVector2d): IVector2d;
};
interface IScale2d {
    (v: IVector2d, scale: IVector2d): IVector2d;
};
interface ITranslate2d {
    (v: IVector2d, distance: IVector2d): IVector2d;
};
interface IRotate2d {
    (v: IVector2d, delta: number): IVector2d;
};
/*
translate(x,y) =[x,y];
scale(sx,sy) = [(sx,0),(0,sy)];
shear_x(s) = [(1,s),(0,1)];
shear_y(s) = [(1,0),(s,1)];
rotate(d) = [(cos(d), -sin(d)), (sin(d), cos(d))]
X = Rotate*Scale*x + Translate
*/
const multiply2d: IMultiply2d = (v: IVector2d, m: IMatrix2d): IVector2d => {
    return { x : v.x * m.x1 + v.y * m.y1, y : v.x * m.x2 + v.y * m.y2 };
}
const add2d: IAdd2d = (v1: IVector2d, v2: IVector2d): IVector2d => {
    return { x : v1.x + v2.x, y : v1.y + v2.y };
}
const sub2d: IAdd2d = (v1: IVector2d, v2: IVector2d): IVector2d => {
    return { x : v1.x - v2.x, y : v1.y - v2.y };
}
const scale2d: IScale2d = (v: IVector2d, scale: IVector2d): IVector2d => {
    return multiply2d(v, { 
        x1 : scale.x, y1 : 0, 
        x2 : 0,       y2 : scale.y
    });
}
const translate2d: ITranslate2d = (v: IVector2d, distance: IVector2d): IVector2d => {
    return add2d(v, distance);
}
const rotate2d: IRotate2d = (v: IVector2d, delta: number): IVector2d => {
    let sin = Math.sin(delta), cos = Math.cos(delta);
    return multiply2d(v, {
        x1 : cos, y1 : -sin,
        x2 : sin, y2 : cos,
    });
}
export class Vector2d implements IVector2d{
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0){
        this.x = x;
        this.y = y;
    }
    zero(){
        this.x = 0;
        this.y = 0;
        return this;
    }
    atan(){
        return Math.atan(this.y/this.x);
    }
    radius(v: Vector2d) {
        return Math.acos( this.dot(v) / ( this.length() * v.length() ) )
    }
    radius2(v: Vector2d) {
        let a = this.atan();
        return this.add(v).atan() - a;
    }
    length(){
        return Math.sqrt(this.x*this.x + this.y*this.y) 
    }
    dot(v: Vector2d){
        return this.x * v.x + this.y * v.y;
    }
    add(v: IVector2d) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v: IVector2d) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    rotate(angle: number) {
        let sin = Math.sin(angle), cos = Math.cos(angle);
        this.x =   this.x * cos + this.y * sin;
        this.y = - this.x * sin + this.y * cos;
        return this;
    }
    le(x: number, y: number) {
        return this.x < x && this.y < y;
    }
    gt(x: number, y: number) {
        return this.x > x && this.y > y;
    }
    negative(){
        this.x = - this.x;
        this.y = - this.y;
        return this;
    }
}
export class Rect2d {
    angle = 0;
    position = new Vector2d();
    constructor(public w: number = 0, public h: number = 0){
    }
    reset(x: number, y: number, w: number, h: number, angle: number = 0) {
        this.position.x = x;
        this.position.y = y;
        this.w = w;
        this.h = h;
        this.angle = angle;
    }
    scaleTo(w: number, h: number){
        this.w = w;
        this.h = h;
    }
    scale(w: number, h: number){
        this.w += w;
        this.h += h;
    }
    translateTo(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
    }
    translate(x: number, y: number) {
        this.position.add({x, y});
    }
    rotate(angle: number) {
        this.angle += angle;
    }
    rotateTo(angle: number) {
        this.angle += angle;
    }
    includes(point: Vector2d) {
        return point.gt(0, 0) && point.le(this.w, this.h);
    }
}
export class Matrix{
    constructor(
        public a00 = 1, public a01 = 0, public a02 = 0, 
        public a10 = 0, public a11 = 1, public a12 = 0, 
        public a20 = 0, public a21 = 0, public a22 = 1, 
    ){}
    normalize(){
        this.a00 = 1, this.a11 = 1, this.a22 = 1;
        return this;
    }
    transform(x: number, y: number, angle: number) {
        let sin = Math.sin(angle), cos = Math.cos(angle);
        this.a00 = cos; this.a01 =-sin; this.a02 = 0;
        this.a10 = sin; this.a11 = cos; this.a12 = 0;
        this.a20 = x*cos+y*sin; this.a21 = -x*sin+y*cos; this.a22 = 1;
        return this;
    }
    clear(){
        this.a00 = 1, this.a01 = 0, this.a02 = 0;
        this.a10 = 0, this.a11 = 1, this.a12 = 0;
        this.a20 = 0, this.a21 = 0, this.a22 = 1;
    }
    multiply(m: Matrix){
        let a00 = this.a00*m.a00+this.a01*m.a10+this.a02*m.a20, a01 = this.a00*m.a01+this.a01*m.a11+this.a02*m.a21, a02 = this.a00*m.a02+this.a01*m.a12+this.a02*m.a22;
        let a10 = this.a10*m.a00+this.a11*m.a10+this.a12*m.a20, a11 = this.a10*m.a01+this.a11*m.a11+this.a12*m.a21, a12 = this.a10*m.a02+this.a11*m.a12+this.a12*m.a22;
        let a20 = this.a20*m.a00+this.a21*m.a10+this.a22*m.a20, a21 = this.a20*m.a01+this.a21*m.a11+this.a22*m.a21, a22 = this.a20*m.a02+this.a21*m.a12+this.a22*m.a22;
        this.a00 = a00, this.a01 = a01, this.a02 = a02;
        this.a10 = a10, this.a11 = a11, this.a12 = a12;
        this.a20 = a20, this.a21 = a21, this.a22 = a22;
        return this;
    }
    rightMultiply(m: Matrix){
        let a00 = m.a00*this.a00+m.a01*this.a10+m.a02*this.a20, a01 = m.a00*this.a01+m.a01*this.a11+m.a02*this.a21, a02 = m.a00*this.a02+m.a01*this.a12+m.a02*this.a22;
        let a10 = m.a10*this.a00+m.a11*this.a10+m.a12*this.a20, a11 = m.a10*this.a01+m.a11*this.a11+m.a12*this.a21, a12 = m.a10*this.a02+m.a11*this.a12+m.a12*this.a22;
        let a20 = m.a20*this.a00+m.a21*this.a10+m.a22*this.a20, a21 = m.a20*this.a01+m.a21*this.a11+m.a22*this.a21, a22 = m.a20*this.a02+m.a21*this.a12+m.a22*this.a22;
        this.a00 = a00, this.a01 = a01, this.a02 = a02;
        this.a10 = a10, this.a11 = a11, this.a12 = a12;
        this.a20 = a20, this.a21 = a21, this.a22 = a22;
        return this;
    }
}

type Options = 'auto' | 'cover' | 'contain' | string /* "100% 100%" */;

export class Projection {
    constructor(protected image: IVector2d, protected container: IVector2d, protected opt: Options = 'auto', protected center: IVector2d = { x : 0, y : 0 }){
    }
    get ratio(){
        return this[this.opt](
            this.container.x / this.image.x,
            this.container.y / this.image.y
        )
    }
    transform() : { o1 : IVector2d, o2: IVector2d } {
        return {
            o1 : scale2d(translate2d({ x : 0, y : 0 }, this.center), this.ratio), 
            o2 : scale2d(translate2d(this.image, this.center), this.ratio) 
        };
    }
    auto = () : IVector2d => {
        return { x : 1, y : 1};
    };
    cover = (wRatio : string, hRatio : string) : IVector2d => {
        return { x : Math.max(parseFloat(wRatio), parseFloat(hRatio)), y : Math.max(parseFloat(wRatio), parseFloat(hRatio))};
    }
    contain = (wRatio : string, hRatio : string) : IVector2d  => {
        return { x : Math.min(parseFloat(wRatio), parseFloat(hRatio)), y : Math.min(parseFloat(wRatio), parseFloat(hRatio))};
    }
    percentage = (wRatio : string, hRatio : string) : IVector2d  => {
        return { x : parseFloat(wRatio.replace('%',''))/100, y : parseFloat(hRatio.replace('%',''))/100  };
    }
}