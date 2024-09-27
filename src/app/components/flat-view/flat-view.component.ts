import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-flat-view',
  templateUrl: './flat-view.component.html',
  styleUrl: './flat-view.component.css'
})
export class FlatViewComponent implements OnInit{
  flats: any[] = [];

  constructor(private firestore: AngularFirestore) {}

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
}
