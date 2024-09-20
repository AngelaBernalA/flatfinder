import { Component,} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-new-flat',
  templateUrl: './new-flat.component.html',
  styleUrl: './new-flat.component.css'
})
export class NewFlatComponent {
  newFlat: FormGroup;

  constructor (private authService: AuthService, private fb: FormBuilder){
    this.newFlat = this.fb.group({
      city: ['', Validators.required],
      streetName: ['', Validators.required],
      streetNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      areaSize: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      yearBuilt: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      rentPrice: ['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      dateAvailable: ['', Validators.required],
    });
  }

  addFlat() {
    if (this.newFlat.valid) {
      const {city, streetName, streetNumber, areaSize, yearBuilt, rentPrice, dateAvailable } = this.newFlat.value;
      this.authService.addFlat(city, streetName, streetNumber, areaSize, yearBuilt, rentPrice, dateAvailable).then(() => {
        console.log('Flat added successfully');
        this.newFlat.reset();
      })
      .catch(error => {
        console.error('Error adding apartment', error);
      });
    }
  }
  
}
