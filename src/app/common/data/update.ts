import { Injectable, NgModule } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Injectable()
export class UpdateService {

    constructor(public updates: SwUpdate) {
        if (updates.isEnabled) {
            interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate()
                .then(() => console.log('checking for updates')));
        }
    }

    public checkForUpdates(): void {
        this.updates.available.subscribe(event => this.promptUser());
        this.updates.unrecoverable.subscribe(event => {
            alert(
                `An error occurred that we cannot recover from:\n${event.reason}\n\n` +
                'Please reload the page.');
        });
    }

    private promptUser(): void {
        console.log('updating to new version');
        this.updates.activateUpdate().then(() => document.location.reload());
    }

}


@NgModule({
    imports: [
    ],
    providers: [
        UpdateService
    ],


})
export class UpdateModule { }