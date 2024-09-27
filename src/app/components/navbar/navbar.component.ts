import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] 
})
export class NavbarComponent implements OnInit {
  user$: Observable<any | null>;
  isCurrentUser: boolean = false;

  constructor(public authService: AuthService) {
    this.user$ = this.authService.getUser();
  }

  async ngOnInit() {
    const currentUser = await this.authService.getCurrentAuthUser();

    this.user$.subscribe(user => {
      if (user) {
        // If the user is logged in, check if they are the current user
        this.isCurrentUser = currentUser ? user.uid === currentUser.uid : false;
      } else {
        // Handle the case when no user is logged in
        this.isCurrentUser = false;
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
