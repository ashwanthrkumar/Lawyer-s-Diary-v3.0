import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore'; // adjust path
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  users$!: Observable<any[]>;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    // Subscribe to users collection
    this.users$ = this.firestoreService.getUsers();
  }
}
