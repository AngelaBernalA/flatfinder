import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flat-view',
  templateUrl: './flat-view.component.html',
  styleUrl: './flat-view.component.css'
})
export class FlatViewComponent implements OnInit{
  flats: any[] = [];

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService, // AuthService for checking user login status
    private router: Router // Router for redirecting to login
  ) {}

  ngOnInit(): void {
    // Fetch all flats from Firestore and include their document ID
    this.firestore.collection('flats').snapshotChanges().subscribe(snapshot => {
      this.flats = snapshot.map(doc => {
        const flatData = doc.payload.doc.data() as object;
        const flatId = doc.payload.doc.id; // Extract the document ID (flat ID)
        return { id: flatId, ...flatData }; // Combine the ID with the flat data
      });
  
      // Fetch user names for each flat
      this.flats.forEach(flat => {
        this.firestore.collection('users').doc(flat.user).valueChanges().subscribe((user: any) => {
          if (user) {
            flat.userName = `${user.firstName} ${user.lastName}`;
          } else {
            flat.userName = "Unknown User";
          }
        });
      });
    });
  }

  // Mark as favorite
  markAsFavorite(flatId: string): void {
    this.authService.getCurrentAuthUser().then(user => {
      if (user) {
        // User is logged in, mark the flat as favorite
        this.firestore.collection('favorites', ref => ref.where('userId', '==', user.uid).where('flatId', '==', flatId))
          .get().subscribe(querySnapshot => {
            if (querySnapshot.empty) {
              // Add the flat to the user's favorites
              this.firestore.collection('favorites').add({
                userId: user.uid,
                flatId: flatId
              }).then(() => {
                alert('Flat added to favorites!');
              }).catch(error => {
                console.error('Error adding to favorites: ', error);
              });
            } else {
              alert('Flat is already in your favorites!');
            }
          });
      } else {
        // User is not logged in, redirect to login
        this.router.navigate(['/login']);
      }
    });
  }
}
