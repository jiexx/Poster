import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BusService } from './bus';


@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        BusService
    ],
    
    
})
export class BusModule { 
    // constructor(@Optional() @SkipSelf() parentModule?: BusModule) {
    //     if (parentModule) {
    //       throw new Error(
    //         'BusModule is already loaded. Import it in the AppModule only');
    //     }
    // }
    // static forRoot(): ModuleWithProviders<BusModule> {
    //     return {
    //         ngModule: BusModule,
    //         providers: [
    //             { provide: BusService/* , useValue: {}  */}
    //         ]
    //     };
    // }
}