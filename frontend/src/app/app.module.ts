import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { WineriesModule } from './wineries/wineries.module';

import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthGuard } from './_services/auth.guard';
import { LoginModule } from './login/login.module';
import { SignupModule } from './signup/signup.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeModule } from './home/home.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { WineModule } from './wines/wines.module';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    AdminModule,
    WineriesModule,

    MatSidenavModule,
    AdminModule,

    LoginModule,
    SignupModule,
    HttpClientModule,
    HomeModule,
    WineModule,

    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    WineModule,
    MatIconModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {

 }
