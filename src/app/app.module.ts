import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BusService } from './common/bus/bus';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { ServiceWorkerModule, SwRegistrationOptions } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { DialogModule } from './common/dialog/dialog.module';
import { AuthGuard } from './layout.user/layout.user-routings.module';
import { DataModule } from './common/data/data.module';
import { BusModule } from './common/bus/bus.module';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomReuseStrategy extends RouteReuseStrategy {
    handlers: { [key: string]: DetachedRouteHandle } = {}
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return true;
    }
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        //console.log('store', this.getUrl(route), route.data.reuse, handle)
        if(handle) this.handlers[this.getUrl(route)] = handle;
    }
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        //console.log('shouldAttach', this.getUrl(route), route.data.reuse)
        return !!this.handlers[this.getUrl(route)] && route.data.reuse == true;
    }
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (!route.routeConfig) return null;
        return this.handlers[this.getUrl(route)];
    }
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return  (future.routeConfig === curr.routeConfig);
    }

    private getUrl(route: ActivatedRouteSnapshot) {
        return route['_routerState'].url.replace(/\//g, '_')
    }
}

export class HammerConfig extends HammerGestureConfig {
    overrides = <any> {
        'pinch': { enable: false },
        'rotate': { enable: false }
    }
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        DataModule,
        BusModule,
        MatMenuModule,
        HammerModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' }),
        // LayoutMainModule
        DialogModule
    ],
    providers: [
        AuthGuard,
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: HammerConfig
        },
        {
            provide: RouteReuseStrategy, 
            useClass: CustomReuseStrategy
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
