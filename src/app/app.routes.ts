import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { authguradGuard } from './Service/authgurad-guard';


export const routes: Routes = [
  {path:"", redirectTo: "/login", pathMatch: "full"},

  {path: 'login', component: Login,canActivate:[authguradGuard]},
  {path: 'admin', component: Home,
    children:[{path:'',loadChildren: () => import('./home/home-module').then(m => m.HomeModule),canActivate:[authguradGuard]}] },
  {path:'**', component:Login}
];
