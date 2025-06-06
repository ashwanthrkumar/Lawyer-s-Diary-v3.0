import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore'; // adjust path
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';
@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  users$!: Observable<any[]>;
  storedEmail: string | null = null;
  userName: any;
  constructor(private firestoreService: FirestoreService, private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to users collection
    this.users$ = this.firestoreService.getUsers();
    this.authService.user$.subscribe(user => {
      if (user) {
        console.log('Logged in as:', user.email);
        this.storedEmail = user.uid;  // update the class property here
      } else {
        this.storedEmail = null;
      }
    });
    const storedDetails = sessionStorage.getItem('userDetails');
    if (storedDetails) {
      const userDetails = JSON.parse(storedDetails);
      this.userName = userDetails.name || null;
      console.log('Dashboard loaded for:', this.userName);
    }
  }
}
