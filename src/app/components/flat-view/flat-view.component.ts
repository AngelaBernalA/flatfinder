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
    // Fetch all flats from Firestore
    this.firestore.collection('flats').valueChanges().subscribe((flats: any[]) => {
      this.flats = flats;

      this.flats.forEach(flat =>{
        this.firestore.collection('users').doc(flat.user).valueChanges().subscribe((user: any) => {
          if (user){
            flat.userName = `${user.firstName} ${user.lastName}`;
          }else{
            flat.userName = "Unknown User";
          }
        })
      })
    });
  }
}
