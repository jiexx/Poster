import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CLogin } from './component.login/CPNT.login';
import { CList } from './component.list/CPNT.list';
import { CDetail } from './component.detail/CPNT.detail';
import { CInput } from './component.input/CPNT.input';

const routes: Routes = [
    {
        path: 'list',
        component: CList
    },
    {
        path: 'detail',
        component: CDetail
    },
    {
        path: 'input',
        component: CInput
    },
    {
        path: 'login',
        component: CLogin
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
})
export class LayoutRoutingModule { }