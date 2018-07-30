import {NgModule} from '@angular/core';
import {RouterModule , Routes} from '@angular/router';

import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { MapComponent } from './event/map/map.component';
import { CreateEventComponent } from './event/create-event/create-event.component';
import { UserEventsComponent } from './event/user-events/user-events.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'map', component: MapComponent
  , canActivate: [AuthGuard]
},
{path: 'createevent', component: CreateEventComponent
 , canActivate: [AuthGuard]
},
{path: 'userevents', component: UserEventsComponent, canActivate: [AuthGuard]},
{ path: 'edit/:eventId', component: CreateEventComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {}
