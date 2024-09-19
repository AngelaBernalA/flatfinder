import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getUser().pipe(
      map(user => {
        if (user && user.isAdmin) {
          return true; // User is an admin
        } else {
          this.router.navigate(['/']); // Redirect to home if not admin
          return false; // Block access if not admin
        }
      })
    );
  }
}
