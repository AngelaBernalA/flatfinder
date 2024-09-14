import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc(`users/${user.uid}`).valueChanges();
        } else {
          return new Observable<null>();
        }
      })
    );
  }

  getUser(): Observable<any> {
    return this.user$;
  }

  async register(email: string, password: string, firstName: string, lastName: string, birthDate: Date) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Save additional user info to Firestore
        await this.firestore.collection('users').doc(user.uid).set({
          email: email,
          firstName: firstName,
          lastName: lastName,
          birthDate: birthDate
        });
        // Alert the user about successful registration
        alert('Registration was successful!');
        this.router.navigate(['/login']); // Navigate to login after successful registration
      }
    } catch (error: any) {
      console.error('Registration error: ', error.message);
      alert('Registration failed: ' + error.message);
    }
  }

  async login(email: string, password: string) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/']); // Navigate to homepage after login
    } catch (error: any) {
      console.error('Login error: ', error.message);
      alert('Login failed: ' + error.message);
    }
  }

  async logout() {
    await this.afAuth.signOut();
    this.router.navigate(['/login']);
  }
}
