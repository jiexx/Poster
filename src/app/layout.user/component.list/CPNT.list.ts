import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from 'app/common/data/user';
import { Router, ActivatedRoute } from '@angular/router';


const mobileValidator = (control: FormControl):{[key:string]: boolean | string} =>{
    if(!control.value) {
        return {invalid: true, msg: '不能为空'};
    }
    else if(control.value.length != 4) {
        return {invalid: true, msg: '身份证号后4位'};
    }
    /* else if(!/^((13[0-9])|(15[^4])|(18[0-9])|(17[0-1|3|5-8])|(14[5|7|9]))\d{8}$/g.test(control.value)){
        return {invalid: true, msg: '手机号不正确'};
    } */
}

@Component({
    templateUrl: './CPNT.list.html',
    styleUrls: ['./CPNT.list.css'],
})
export class CList implements OnInit {
    ngOnInit(): void {
        
    }
    constructor(private user : UserService, private router: Router, private route: ActivatedRoute){
        
    }
    list = [
    ];
    keyword = new FormControl('', [
        mobileValidator
    ]);
    ngAfterViewInit(){
        
    }
    getList(){
    }
    search(){
        // this.router.navigate(['/main/search'], {queryParams: {kw: $src.value}});
        if(this.keyword.valid) {
            this.user.searchBy(this.keyword.value).then(result =>{
                this.list = result.map(rec=>({
                    name: rec.userName, 
                    tel:rec.userMobile, 
                    id:rec.userIdnum, 
                    address: rec.userAddress, 
                    source: rec.source, 
                    datatime: rec.clinicDT + ' '+ rec.amOrPm,
                    uid: rec.userId,
                    resId: rec.id,
                    payment: rec.NATPayType}))
            });
        }else {
            this.keyword.markAllAsTouched();
        }
    }
    detail(item){
        const mode = this.route.snapshot.queryParamMap.get('mode');
        if(mode == 'editable'){
            this.router.navigate(['/user/edit'], {queryParams: {userid: item.id, mode: 'input'}})
        }else if(mode == 'readonly'){
            this.router.navigate(['/user/detail'], {queryParams: {
                userid: item.id, mode: 'confirm', 
                name: item.name, 
                tel: item.tel, 
                address: item.address, 
                resId: item.resId,
                datatime: item.datatime, 
                source: item.source,
                uid: item.uid,
                payment: item.payment }})
        }
    }
}