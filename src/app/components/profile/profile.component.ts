import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user$!: Observable<any>; // Current user observable

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Get the current user data from the AuthService
    this.user$ = this.authService.getUser();
  }

  // Redirect to the profile update page
  editProfile() {
    this.router.navigate(['/profile-update']); // Assuming you have a route for profile update
  }
}
