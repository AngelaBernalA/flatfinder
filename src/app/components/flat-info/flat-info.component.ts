import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-flat-info',
  templateUrl: './flat-info.component.html',
  styleUrl: './flat-info.component.css'
})
export class FlatInfoComponent implements OnInit {
  flat: any;

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore) {}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.firestore.collection('flats').doc(id).valueChanges().subscribe({
        next: (data) => {
          this.flat = data;
        },
        error: (error) => {
          console.error('Error fetching flat:', error);
        },
      });
    }
  }
}
