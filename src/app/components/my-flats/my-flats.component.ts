import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FlatData } from '../../models/flat-data.model';

@Component({
  selector: 'app-my-flats',
  templateUrl: './my-flats.component.html',
  styleUrls: ['./my-flats.component.css']
})
export class MyFlatsComponent implements OnInit {
  userFlats: any[] = [];

  constructor(private firestore: AngularFirestore, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getCurrentAuthUser().then(user => {
      if (user) {
        // Fetch flats published by the user
        this.firestore.collection('flats', ref => ref.where('user', '==', user.uid))
          .snapshotChanges()
          .subscribe(snapshot => {
            this.userFlats = snapshot.map(doc => {
              const flatData = doc.payload.doc.data() as object;
              const flatId = doc.payload.doc.id;
              return { id: flatId, ...flatData }; // Combine ID with flat data
            });
          });
      } else {
        // Redirect to login if user is not logged in
        this.router.navigate(['/login']);
      }
    });
  }

  // Delete a flat
  deleteFlat(flatId: string): void {
    if (confirm('Are you sure you want to delete this flat?')) {
      this.firestore.collection('flats').doc(flatId).delete().then(() => {
        // Remove the flat from the local array
        this.userFlats = this.userFlats.filter(flat => flat.id !== flatId);
        alert('Flat deleted successfully.');
      }).catch(error => {
        console.error('Error deleting flat: ', error);
      });
    }
  }
}
