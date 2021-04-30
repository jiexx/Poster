import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { nullValidator, UserService } from 'app/common/data/user';
import { BusService, Bus } from 'app/common/bus/bus';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CCanvas } from 'app/common/canvas/CPNT.canvas';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, startWith } from 'rxjs/operators';



@Component({
    templateUrl: './CPNT.edit.html',
    styleUrls: ['./CPNT.edit.css'],
})
export class CEdit extends Bus implements OnInit, AfterViewInit {
    name(): string {
        return 'CEdit';
    }
    
    title = new FormControl('xx', [
        nullValidator
    ]);
    price = new FormControl('1', [
        nullValidator
    ]);
    amount = new FormControl('1', [
        nullValidator
    ]);
    checkid = new FormControl('1', [
        nullValidator
    ]);
    isModInc = new FormControl(true, [
    ]);

    config = null;
    formConfig: FormGroup = new FormGroup({
        title: this.title,
        price: this.price,
        amount: this.amount,
        checkid: this.checkid,
        isModInc: this.isModInc
    });
    inspect = null;
    formInspect: FormGroup = new FormGroup({
    });

    font = new FormControl('xx', [
        Validators.required
    ]);
    str = new FormControl('', [
        Validators.required
    ]);
    size = new FormControl('', [
        Validators.required
    ]);
    text = null;
    formText: FormGroup = new FormGroup({
        font: this.font,
        str: this.str,
        size: this.size
    });
    backgroundImage = null;
    bgImages = [];

    @ViewChild(CCanvas) editor: CCanvas;
    constructor(private location: Location, protected bus: BusService, protected user: UserService, public router : Router, private route: ActivatedRoute) {
        super(bus);
        this.fonts = this.listFonts().map(font =>({family:font.family,style:font.style,weight:font.weight,variant:font.variant}))
        this.fonts = this.fonts.filter((font,i)=>this.fonts.findIndex(f=>f.family==font.family&&f.style==font.style&&f.weight==font.weight&&f.variant==font.variant)==i);
        this.font.setValue(this.fonts[0] || {family:'Arial',style:'normal',weight:'300',variant:'normal'});
    }
    ngOnInit(): void {
        this.config = null;
        this.inspect = null;
        this.text = null;
        this.formText.valueChanges.subscribe(()=>{
            this.editor.changeFont(`${this.font.value.style} ${this.font.value.variant} ${this.font.value.style} ${this.size.value}px arial`)
            this.editor.changeStr(this.str.value)
        });
    }
    ngAfterViewInit(){
        if(this.route.snapshot.queryParamMap.has('id')){
            let id = this.route.snapshot.queryParamMap.get('id');
            let d = this.user.post(null, id);
            if(d && d.length == 1) {
                this.editor.load(d[0].layout);
            }
        }
        this.editor.setEditMode('outside');
    }
    fonts = null;
    listFonts() {
        let fonts = document['fonts'];
        const it = fonts.entries();

        let arr = [];
        let done = false;

        while (!done) {
            const font = it.next();
            if (!font.done) {
                arr.push(font.value[0]);
            } else {
                done = font.done;
            }
        }

        return arr;
    }
    configDone() {
        this.config = {};
    }
    save() {
        if(this.formConfig.valid){
            let base64 = this.editor.print();
            let layout = this.editor.save();
            let props = this.formConfig.getRawValue();
            this.user.post({props: props, layout: layout, base64: base64});
            this.config = null;
            /* this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload'; */
            this.router.navigate(['/user/list'])
        }
    }
    configBackgroundImage() {
        this.backgroundImage = {};
        this.bgImages = [
            './assets/img/Homepage-1.jpg',
            './assets/img/Homepage-2.jpg',
            './assets/img/Homepage-3.jpg',
            './assets/img/Homepage-4.jpg',
        ]
    }
    configText() {
        this.text = {};
        this.editor.createText()
    }
    configTextChange(color){
        this.text = {};
    }
    configTextColor(color){
        this.editor.changeColor(color)
    }

    configInspectin() {
        this.inspect = {};
    }
    configInspectout() {

    }
    inspectAppend() {
        this.formInspect.addControl(Math.ceil(Math.random() * 10000) + '', new FormControl('', [
            nullValidator
        ]))
    }
    inspectRemove(key) {
        this.formInspect.removeControl(key);
    }
    backgroundImageCreate(src) {
        this.editor.createBackgroundImage(src);
    }
    backgroundImageRemove() {
        this.editor.removeBackgroundImage();
    }
    textRemove() {
        this.editor.removeText();
    }

    today() {
        return new Date().toLocaleDateString()
    }
    back() {
        //this.location.back();
        this.router.navigate(['/user/list'])
    }
}