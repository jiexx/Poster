import { Component, ChangeDetectorRef, AfterContentChecked, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { UserService } from './common/data/user';
import { ActivatedRoute, Router } from '@angular/router';
import { Bus, BusService } from './common/bus/bus';
import { IDialogMessage } from './common/dialog/ITF.dialog';
import { CInfo } from './common/dialog/CPNT.info';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends Bus implements AfterContentChecked {
    name(): string {
        return 'AppComponent';
    }
    constructor(public user: UserService, private cdr: ChangeDetectorRef, private router: Router, private route: ActivatedRoute, protected bus: BusService) {
        super(bus);
        
    }
    ngAfterContentChecked() {
        this.cdr.detectChanges();
    }
    deferredPrompt: any;
    @HostListener('window:beforeinstallprompt', ['$event'])
    onbeforeinstallprompt(e) {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        this.deferredPrompt = e;
        if(!this.user.hasA2h()){
            this.bus.send('CDialog', <IDialogMessage>{command: 'open', data: {CPNT: CInfo, button: '', returnto: this, title: '提示', info: '保存到桌面'} })
        }
    }
    onDlgClose() {
        // hide our user interface that shows our A2HS button
        // Show the prompt
        console.log('onbeforeinstallprompt',this);
        this.deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        this.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                this.user.a2h();
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            this.deferredPrompt = null;
        });
    }

}
