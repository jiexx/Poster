import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutUser } from './layout.user/layout.user';

const routes: Routes = [
    {
        path: 'user',
        component: LayoutUser,
        loadChildren: () => import('./layout.user/layout.user.module').then(mod => mod.LayoutUserModule)
    },
    {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full',
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes,/*  {
        paramsInheritanceStrategy: 'always'
    } */)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
