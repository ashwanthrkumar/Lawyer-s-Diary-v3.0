import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';  // Adjust path as needed
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent {
  isLoginMode = true;
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode(event: Event) {
    event.preventDefault();
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (!this.email || !this.password) {
      alert('Email and password are required');
      return;
    }

    if (this.isLoginMode) {
      this.authService.login(this.email, this.password)
      .then(userCredential => {
        const uid = userCredential.user?.uid;  // <-- define uid here
        if (uid) {
          sessionStorage.setItem('uid', uid);
          console.log('Login successful:', uid);
  
          this.authService.checkUserProfile(uid).then(exists => {
            if (exists) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/enter-details', uid]);
            }
          });
        } else {
          alert('UID not found. Login failed.');
        }
      })
        .catch(error => {
          console.error('Login error:', error.message);
          alert(error.message);
        });
    } else {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      this.authService.signup(this.email, this.password)
        .then(userCredential => {
          console.log('Signup successful:', userCredential.user)
          this.router.navigate(['/enter-details', userCredential.user.uid]);
        })
        .catch(error => {
          console.error('Signup error:', error.message);
          alert(error.message);
        });
    }
  }
}
