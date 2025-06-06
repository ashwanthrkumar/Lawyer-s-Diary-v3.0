import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard.component';
import { AuthComponent } from './auth/auth.component';
import { EnterDetails } from './enter-details/enter-details.component';
import { AddCaseClientComponent } from './add-case-client/add-case-client.component';
import { NextHearingDate } from './next-hearing-date/next-hearing-date.component';
import { View } from './view/view.component';
import { CalenderComponent } from './calender/calender.component';

export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' }, // ✅ should redirect to login
    { path: 'auth', component: AuthComponent },
 //   {path:'',component:AuthComponent},
    {path:'dashboard',component:Dashboard},
    { path: 'enter-details/:uid', component: EnterDetails },
  //  { path: '**', redirectTo: 'auth' } ,
    {path:'addNew/:form',component:AddCaseClientComponent},
    {path:'nextHearing',component:NextHearingDate},
    {path:'view/:type',component:View},
    {path:'calender',component:CalenderComponent}

];
