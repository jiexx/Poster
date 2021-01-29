import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutLogin } from './layout.user/layout.user';

const routes: Routes = [
    {
        path: 'user',
        component: LayoutLogin,
        loadChildren: () => import('./layout.user/layout.user.module').then(mod => mod.LayoutLoginModule)
    },
    {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full',
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
