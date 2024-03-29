import { Routes, RouterModule, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable, NgModule } from '@angular/core';
import { CLogin } from './component.login/CPNT.login';
import { CList } from './component.list/CPNT.list';
import { CDetail } from './component.detail/CPNT.detail';
import { CEdit } from './component.edit/CPNT.edit';
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
        mode: 'seller',
        data: { reuse: true },
    },
    {
        path: 'detail',
        component: CDetail,
        mode: 'editor'
    },
    {
        path: 'edit',
        component: CEdit,
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
const routes: Routes = routeConfig.map(rc => rc.mode ? {path:rc.path, component: rc.component, canActivate: rc.canActivate, data: rc.data} : rc);

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
})
export class LayoutRoutingModule { }