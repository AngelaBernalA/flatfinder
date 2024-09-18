import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent implements OnInit {
  userForm!: FormGroup; // Form to update user profile
  currentUser: any;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch current user data from the AuthService
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.currentUser = user;

        // Initialize form with current user data
        this.userForm = this.fb.group({
          firstName: [user.firstName, [Validators.required, Validators.minLength(2)]],
          lastName: [user.lastName, [Validators.required, Validators.minLength(2)]],
          email: [user.email, [Validators.required, Validators.email]],
          birthDate: [user.birthDate, Validators.required],
          password: ['', [Validators.minLength(6)]], // Optional password update
          confirmPassword: ['']
        });
      }
    });
  }

  // Update user profile
  async updateProfile() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;

      if (formData.password && formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      try {
        // Update user data in Firestore
        await this.firestore.collection('users').doc(this.currentUser.uid).update({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          birthDate: formData.birthDate
        });

        // If the user wants to update their email or password
        const userAuth = await this.authService.getCurrentAuthUser();
        if (userAuth) {
          if (formData.email !== this.currentUser.email) {
            await userAuth.updateEmail(formData.email);  // Update email in Firebase Auth
          }
          if (formData.password) {
            await userAuth.updatePassword(formData.password);  // Update password in Firebase Auth
          }
        }

        // Redirect to home page after a successful update
        alert('Profile updated successfully!');
        this.router.navigate(['/']);
      } catch (error: any) {
        console.error('Error updating profile:', error.message);
        alert('Error updating profile: ' + error.message);
      }
    }
  }
}
