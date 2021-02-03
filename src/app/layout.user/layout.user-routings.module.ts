import { Routes, RouterModule, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable, NgModule } from '@angular/core';
import { CLogin } from './component.login/CPNT.login';
import { CList } from './component.list/CPNT.list';
import { CDetail } from './component.detail/CPNT.detail';
import { CInput } from './component.input/CPNT.input';
import { UserService } from 'app/common/data/user';

@Injectable()
export class AuthGuard implements CanActivate  {
    
    constructor(public user: UserService, private router: Router) { 
    }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if(!this.user.myId()) {
            this.router.navigate(['/user/login'], {queryParams: {returnUrl: state.url}});
            return false;
        }
        return true;
    }

}
export const routeConfig = [
    {
        path: 'list',
        component: CList,
        mode: 'seller'
    },
    {
        path: 'detail',
        component: CDetail
    },
    {
        path: 'input',
        component: CInput,
        canActivate: [AuthGuard],
        mode: 'editor'
    },
    {
        path: 'login',
        component: CLogin
    },
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
    }
];
const routes: Routes = [
    {
        path: 'list',
        component: CList,
    },
    {
        path: 'detail',
        component: CDetail
    },
    {
        path: 'input',
        component: CInput,
        canActivate: [AuthGuard],
    },
    {
        path: 'login',
        component: CLogin
    },
    {
        path: '',
        redirectTo: 'list',
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