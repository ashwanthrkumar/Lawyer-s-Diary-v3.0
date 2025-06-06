import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { AuthComponent } from './auth/auth';

export const routes: Routes = [
    {path:'',component:AuthComponent},
    {path:'dashboard',component:Dashboard}

];
