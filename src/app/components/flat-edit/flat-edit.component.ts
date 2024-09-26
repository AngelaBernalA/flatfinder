import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flat-edit',
  templateUrl: './flat-edit.component.html',
  styleUrl: './flat-edit.component.css'
})
export class FlatEditComponent implements OnInit {
  flatForm!: FormGroup;
  currentUser: any;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.currentUser = user;

        this.flatForm = this.fb.group({
          city: [user.city,[Validators.required]],
          streetName: [user.streetName, [Validators.required]],
          streetNumber: [user.streetNumber, [Validators.required, Validators.pattern('^[0-9]+$')]],
          areaSize: [user.areaSize, [Validators.required, Validators.pattern('^[0-9]+$')]],
          yearBuilt: [user.yearBuilt, [Validators.required, Validators.pattern('^[0-9]+$')]],
          rentPrice: [user.rentPrice, [Validators.required, Validators.pattern('^[0-9]+$')]],
          dateAvailable: [user.dateAvailable, Validators.required],
        })
      }
    })
  }

  async updateFlat () {
    if (this.flatForm.valid) {
      const flatData = this.flatForm.value;

      try {
        await this.firestore.collection('flats').doc(this.currentUser.uid).update({
          city: flatData.city,
          streetName: flatData.streetName,
          streetNumber: flatData.streetNumber,
          areaSize: flatData.areaSize,
          yearBuilt: flatData.yearBuilt,
          rentPrice: flatData.rentPrice,
          dateAvailable: flatData.dateAvailable
        });
        alert ('Flat updated successfully');
        this.router.navigate(['/']);
      } catch (error: any) {
        console.error('Error updating flat', error.message);
        alert ('Error updating profile: ' + error.message);
      }
    }
  }
}
