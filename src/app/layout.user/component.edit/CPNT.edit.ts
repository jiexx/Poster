import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { nullValidator, UserService } from 'app/common/data/user';
import { BusService, Bus } from 'app/common/bus/bus';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CCanvas } from 'app/common/canvas/CPNT.canvas';



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
    price = new FormControl('', [
        nullValidator
    ]);
    amount = new FormControl('', [
        nullValidator
    ]);
    checkid = new FormControl('', [
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
    constructor(private location: Location, protected bus: BusService) {
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
        })
    }
    ngAfterViewInit(){
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
        let layout = this.editor.mgr.save();
        if(this.formConfig.valid){
            this.formConfig.getRawValue();
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
        this.location.back();
    }
}