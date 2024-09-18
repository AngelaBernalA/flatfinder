import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserData } from '../models/user-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Observable to track the authentication state and additional user info
  user$: Observable<any | UserData>;
  isAdmin: boolean = false;

  isUserAdmin(): boolean {
    return this.isAdmin;
  }

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    // Automatically retrieve user info from Firestore whenever the auth state changes
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<UserData>(`users/${user.uid}`).valueChanges().pipe(
            switchMap(userData => {
              if (userData && userData.isAdmin) {
                this.isAdmin = true;
              } else {
                this.isAdmin = false;
              }
              return of(userData);
            })
          );
        } else {
          // If no user is logged in, return null
          this.isAdmin = false;
          return of(null);
        }
      })
    );
  }


  getCurrentAuthUser() {
    return this.afAuth.currentUser;
  }

  // Returns the current user observable
  getUser(): Observable<any> {
    return this.user$;
  }

  // Register a new user with email, password, and additional data
  async register(email: string, password: string, firstName: string, lastName: string, birthDate: Date) {
    try {
      // Register the user in Firebase Authentication
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Save additional user data to Firestore under the user's UID
        await this.firestore.collection('users').doc(user.uid).set({
          uid: user.uid, // Store the UID for easy reference later
          email: email,
          firstName: firstName,
          lastName: lastName,
          birthDate: birthDate,
          createdAt: new Date(), // Store the account creation date
        });

        // Inform the user that the registration was successful
        alert('Registration was successful!');
        this.router.navigate(['/login']); // Redirect to login page
      }
    } catch (error: any) {
      // Handle and display the registration error
      console.error('Registration error: ', error.message);
      alert('Registration failed: ' + error.message);
    }
  }

  // Login with email and password
  async login(email: string, password: string) {
    try {
      // Sign in the user with email and password
      await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/']); // Redirect to the homepage after login
    } catch (error: any) {
      // Handle and display login errors
      console.error('Login error: ', error.message);
      alert('Login failed: ' + error.message);
    }
  }

  // Logout the current user
  async logout() {
    await this.afAuth.signOut();
    this.router.navigate(['/login']); // Redirect to login page after logout
  }


}
