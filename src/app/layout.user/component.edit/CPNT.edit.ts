import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'app/common/data/user';
import { Router, ActivatedRoute } from '@angular/router';
import { BusService, Bus } from 'app/common/bus/bus';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CCanvas } from 'app/common/canvas/CPNT.canvas';

const codeValidator = (control: FormControl): { [key: string]: boolean | string } => {
    if (!control.value) {
        return { invalid: true, msg: '密码不能为空' };
    }
}

@Component({
    templateUrl: './CPNT.edit.html',
    styleUrls: ['./CPNT.edit.css'],
})
export class CEdit extends Bus implements OnInit, AfterViewInit {
    name(): string {
        return 'CEdit';
    }
    
    mobile = new FormControl('xx', [
        codeValidator
    ]);
    code = new FormControl('', [
        codeValidator
    ]);
    isModInc = new FormControl(true, [
    ]);

    config = null;
    formConfig: FormGroup = new FormGroup({
        mobile: this.mobile,
        code: this.code,
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
        this.config = true;
    }
    configBackgroundImage() {
        this.backgroundImage = {};
    }
    configText() {
        this.text = {};
        this.editor.createText()
    }
    configTextChange(){
        this.text = {};
    }

    configInspectin() {
        this.inspect = true;
    }
    configInspectout() {

    }
    inspectAppend() {
        this.formInspect.addControl(Math.ceil(Math.random() * 10000) + '', new FormControl('', [
            codeValidator
        ]))
    }
    inspectRemove(key) {
        this.formInspect.removeControl(key);
    }
    backgroundImageRemove() {
        this.editor.removeText();
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