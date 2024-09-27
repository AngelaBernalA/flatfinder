import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { FlatData } from '../../models/flat-data.model';


@Component({
  selector: 'app-my-flats',
  templateUrl: './my-flats.component.html',
  styleUrl: './my-flats.component.css'
})
export class MyFlatsComponent implements OnInit{
  flats: any[] = [];
  userId!: string;

  constructor(private authService: AuthService, private firestore: AngularFirestore) {}
 
  ngOnInit() {
    // Fetch all flats from Firestore
    this.authService.getCurrentAuthUser().then(user => {
      if (user) {
        this.userId = user.uid; // Ensure you have the user ID
        this.authService.getFlats(this.userId).subscribe(data => {
          this.flats = data;
        });
      } else {
        console.error("User not logged in");
        // Handle the case where the user is not logged in
      }
    }).catch(error => {
      console.error("Error fetching user: ", error);
    });
  }


    removeFlat(flat: any) {
      if (confirm(`Are you sure you want to remove ${flat.city} flat?`)) {
        this.firestore.collection('flats').doc(flat.id).delete()
       //this.authService.removeFlat(flat.id)
       .then(() => {
        console.log (`${flat.city} flat removed from Firestore`);
       })
       .catch(error => {
        console.error("Error removing flat: ", error);
       });



        // this.firestore.collection('flats').doc(flat.id).delete()
        //   .then(() => {
        //     console.log(`${flat.City} flat removed from Firestore`);
        //   })
        //   .catch(error => {
        //     console.error("Error removing flat: ", error);
        //   });
      }
    }






  }
