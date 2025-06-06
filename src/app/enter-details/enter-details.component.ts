import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service'; // Adjust path

@Component({
  selector: 'app-enter-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enter-details.component.html',
  styleUrls: ['./enter-details.component.css']
})
export class EnterDetails implements OnInit {
  name = '';
  email = '';
  phone = '';
  role = 'lawyer'; // fixed as requested
  private uid: string | null = null;
  isSaving: boolean | undefined;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.email = user.email ?? '';
      } else {
        // Not logged in, redirect to auth page
        this.router.navigate(['/auth']);
      }
    });
  }

  async onSubmit() {
    if (!this.uid) {
      alert('User not logged in!');
      return;
    }
    if (!this.name || !this.email || !this.phone) {
      alert('Please fill all required fields.');
      return;
    }
    this.isSaving = true;
    const userDocRef = doc(this.firestore, 'users', this.uid);
    const userData = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      role: this.role,
      createdAt: new Date()
    };

    try {
      await setDoc(userDocRef, userData);

      // Now fetch the saved data to confirm
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        // Store user details in sessionStorage as JSON string
        sessionStorage.setItem('userDetails', JSON.stringify(docSnap.data()));
        this.router.navigate(['/dashboard']);
      } else {
        alert('Failed to retrieve saved user details.');
      }
    } catch (error: any) {
      alert('Error saving user details: ' + error.message);
    }
    finally{
      this.isSaving = false;
    }
  }
}
