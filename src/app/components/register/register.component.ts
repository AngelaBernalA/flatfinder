import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/) // Letters, numbers, special char
      ]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', [Validators.required, this.ageValidator]]
    });
  }

  // Age validation to ensure age between 18-120
  ageValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const birthDate = new Date(control.value);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 18 || age > 120) {
      return { ageInvalid: true };
    }
    return null;
  }

  // Register the user if form is valid
  register() {
    if (this.registerForm.valid) {
      const { email, password, firstName, lastName, birthDate } = this.registerForm.value;
      this.authService.register(email, password, firstName, lastName, birthDate);
    } else {
      alert('Please ensure all fields are valid');
    }
  }
}
