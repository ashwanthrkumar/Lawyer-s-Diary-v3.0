import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { AuthComponent } from './auth/auth';
import { EnterDetails } from './enter-details/enter-details';

export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' }, // ✅ should redirect to login
    { path: 'auth', component: AuthComponent },
 //   {path:'',component:AuthComponent},
    {path:'dashboard',component:Dashboard},
    { path: 'enter-details/:uid', component: EnterDetails },
    { path: '**', redirectTo: 'auth' } 

];
