import { Component, ChangeDetectorRef, AfterContentChecked, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from './common/data/user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterContentChecked {
    title = 'roger';
    constructor(public user: UserService, private cdr: ChangeDetectorRef,private router: Router, private route: ActivatedRoute) {
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('username');
        const password = urlParams.get('password');
        if(username && password && username.length> 0 && password.length>0){
            this.user.login(username, password).then(res =>{
                if(res){
                    this.router.navigate(['/user/list'],{queryParams: {mode: 'readonly'}})
                }
            });
        }
        const cookie = urlParams.get('cookie');
        if(cookie) {
            const decode = decodeURIComponent(decodeURIComponent(cookie));
            try {
                const result = JSON.parse(decode);
                console.log('cookie parse', result);
                this.user.checkin(result);
            }catch(err){
                console.log('cookie decode', err);
            }
        }
    }
    ngAfterContentChecked() {
        this.cdr.detectChanges();
    }
}
