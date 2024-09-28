import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-favorite-flats',
  templateUrl: './favorite-flats.component.html',
  styleUrls: ['./favorite-flats.component.css']
})
export class FavoriteFlatsComponent implements OnInit {
  favoriteFlats: any[] = [];

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentAuthUser().then(user => {
      if (user) {
        // Clear favoriteFlats array to prevent duplicates on reload
        this.favoriteFlats = [];
  
        // Fetch favorite flats based on user ID
        this.firestore.collection('favorites', ref => ref.where('userId', '==', user.uid))
          .valueChanges()
          .subscribe((favorites: any[]) => {
            favorites.forEach(favorite => {
              this.firestore.collection('flats').doc(favorite.flatId).valueChanges().subscribe(flat => {
                if (flat) {
                  // Ensure the flat isn't already in the array
                  if (!this.favoriteFlats.some(existingFlat => existingFlat.id === favorite.flatId)) {
                    this.favoriteFlats.push({ id: favorite.flatId, ...flat }); // Add flat details with ID to array
                    console.log('Favorite flat added:', { id: favorite.flatId, ...flat });
                  }
                }
              });
            });
          });
      }
    });
  }

  // Remove the flat from user's favorites
  removeFavorite(flatId: string): void {
    if (!flatId) {
      console.error('Flat ID is undefined.');
      return;
    }
  
    this.authService.getCurrentAuthUser().then(user => {
      if (!user || !user.uid) {
        console.error('User is not logged in or User ID is undefined.');
        return;
      }
  
      // Find the favorite document by userId and flatId
      this.firestore.collection('favorites', ref => ref
        .where('userId', '==', user.uid)
        .where('flatId', '==', flatId))
        .get().subscribe(querySnapshot => {
          if (querySnapshot.empty) {
            alert('Favorite flat not found.');
            return;
          }
  
          // Delete all matching documents (in case of duplicates)
          querySnapshot.forEach(doc => {
            this.firestore.collection('favorites').doc(doc.id).delete().then(() => {
              // Remove the flat from the local array
              this.favoriteFlats = this.favoriteFlats.filter(flat => flat.id !== flatId);
              alert('Flat removed from favorites.');
            }).catch(error => {
              console.error('Error removing favorite: ', error);
            });
          });
        });
    });
  }
  
  
}
