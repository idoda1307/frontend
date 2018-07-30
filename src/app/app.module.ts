import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';


import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './angular-material.module';
// import {} from 'hammerjs';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import {HeaderComponent} from './header/header.component';
import {SignupComponent} from './auth/signup/signup.component';
import {AuthInterceptor} from './auth/auth-interceptor';
import { MapComponent } from './event/map/map.component';
import { CreateEventComponent } from './event/create-event/create-event.component';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NotificationsService } from './event/services/notifications.service';
import { UserEventsComponent } from './event/user-events/user-events.component';
import { RadiusComponent } from './event/radius/radius.component';
// client id
// 636615776063-7275viak82iq941g4nh523a49hhqqpbt.apps.googleusercontent.com
// client secret
// hdjy4tQCtNDBIe44wRVHO7Kd

// "publicKey":"BFsjeYO7F2jfDBJYF8fhGGWK1knggiFN8uxEpslVLgBw5i5VNQlPan7s-jNw-NAR4L-DQo0_YWZfov1EkCxbyHI"
// "privateKey":"wfmWi4EhI3WX62lhKdnQK36JlO0djCsAa9d88Mcds60"
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    HeaderComponent,
    SignupComponent,
    MapComponent,
    CreateEventComponent,
    UserEventsComponent,
    RadiusComponent,
    ErrorComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    BrowserModule,
    environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : [],
    AgmCoreModule.forRoot({
apiKey: 'AIzaSyCtYIoCMJs7fvKYh0PXLKmeUS1a_MwkHHY',
libraries: ['places', 'geometry']
    }),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    NotificationsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent, CreateEventComponent]
})
export class AppModule { }
