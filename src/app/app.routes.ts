import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { SignupComponent } from './signup/signup';
import { LoginComponent } from './login/login';

export const routes: Routes = [
    {path:'dashboard',component:Dashboard},
    {path:'signup',component:SignupComponent},
    {path:'login',component:LoginComponent}

];
