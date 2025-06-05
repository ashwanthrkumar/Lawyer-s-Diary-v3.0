import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SignupComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    this.authService.signup(this.email, this.password)
      .then(() => this.router.navigate(['/dashboard']))
      .catch(err => this.error = err.message);
  }
}
