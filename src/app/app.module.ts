import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlatViewComponent } from './components/flat-view/flat-view.component';
import { NewFlatComponent } from './components/new-flat/new-flat.component';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { environment } from './environments/environment';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileUpdateComponent } from './components/profile-update/profile-update.component';


@NgModule({
  declarations: [
    AppComponent,
    FlatViewComponent,
    NewFlatComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    ProfileComponent,
    ProfileUpdateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
