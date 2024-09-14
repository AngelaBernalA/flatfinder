import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] 
})
export class NavbarComponent {
  user$: Observable<any>;

  constructor(private authService: AuthService) {
    // Subscribes to the current authentication state and updates user status
    this.user$ = this.authService.getUser();
  }

  logout() {
    this.authService.logout();
  }
}
