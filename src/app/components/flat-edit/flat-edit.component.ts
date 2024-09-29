import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-flat-edit',
  templateUrl: './flat-edit.component.html',
  styleUrl: './flat-edit.component.css'
})
export class FlatEditComponent implements OnInit {
  flatForm: FormGroup;
  flatId: string = ''; // Flat ID to fetch the flat from Firestore

  constructor(
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialize the form with validators
    this.flatForm = this.fb.group({
      city: ['', [Validators.required]],
      streetName: ['', [Validators.required]],
      streetNumber: ['', [Validators.required]],
      areaSize: ['', [Validators.required]],
      yearBuilt: ['', [Validators.required]],
      rentPrice: ['', [Validators.required]],
      dateAvailable: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.flatId = this.route.snapshot.paramMap.get('id') ?? '';
  
    if (this.flatId) {
      this.firestore.collection('flats').doc(this.flatId).valueChanges().subscribe((flat: any) => {
        if (flat) {
          this.flatForm.patchValue({
            city: flat.city || '',
            streetName: flat.streetName || '',
            streetNumber: flat.streetNumber || '',
            areaSize: flat.areaSize || '',
            yearBuilt: flat.yearBuilt || '',
            rentPrice: flat.rentPrice || '',
            dateAvailable: flat.dateAvailable || ''
          });
        } else {
          console.error('Flat data not found');
        }
      }, error => {
        console.error('Error fetching flat data: ', error);
      });
    } else {
      console.error('Flat ID is undefined or empty');
    }
  }
  

  // Handle form submission
  onSubmit(): void {
    if (this.flatForm.valid) {
      // Update the flat data in Firestore
      this.firestore.collection('flats').doc(this.flatId).update(this.flatForm.value).then(() => {
        alert('Flat updated successfully.');
        this.router.navigate(['/my-flats']); // Redirect to my-flats after update
      }).catch(error => {
        console.error('Error updating flat: ', error);
        alert('Failed to update flat.');
      });
    }
  }
}
