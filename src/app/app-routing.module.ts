import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileUpdateComponent } from './components/profile-update/profile-update.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { AdminGuard } from './guards/admin.guard';
import { NewFlatComponent } from './components/new-flat/new-flat.component';
import { FlatViewComponent } from './components/flat-view/flat-view.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile-update', component: ProfileUpdateComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile-update', component: ProfileUpdateComponent },
  { path: 'all-users', component: AllUsersComponent, canActivate: [AdminGuard] },
  { path: 'new-flat', component: NewFlatComponent},
  { path: 'flat-view', component: FlatViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
