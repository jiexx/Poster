import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './user';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        UserService
    ],
})
export class DataModule {
    // constructor(@Optional() @SkipSelf() parentModule?: DataModule) {
    //     if (parentModule) {
    //         throw new Error(
    //             'DataModule is already loaded. Import it in the AppModule only');
    //     }
    // }
    // static forRoot(): ModuleWithProviders<DataModule> {
    //     return {
    //         ngModule: DataModule,
    //         providers: [
    //             { provide: UserService/* , useValue: {} */ }
    //         ]
    //     };
    // }
}