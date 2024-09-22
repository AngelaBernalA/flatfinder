import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-flat-view',
  templateUrl: './flat-view.component.html',
  styleUrl: './flat-view.component.css'
})
export class FlatViewComponent implements OnInit{
  flat: any;

  constructor(private authService: AuthService, private firestore: AngularFirestore) {}

  ngOnInit(): void {
    // Fetch all flats from Firestore
    this.firestore.collection('flats').valueChanges().subscribe((flat: any[]) => {
      this.flat = flat;
    });
  }

}
