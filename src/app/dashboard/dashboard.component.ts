import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { collection, getDocs } from '@angular/fire/firestore';
import { CaseDetailsDialogComponent } from '../dialogs/case-details-dialog/case-details-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

interface Case {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  court?: string;
  status: string;
  hearingDate?: string;
  hearingTime?: string;
  caseNumber: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class Dashboard implements OnInit {
  users$!: Observable<any[]>;
  caseStats: any = null;
  upcomingHearings: Case[] = [];
  storedEmail: string | null = null;
  userName: any;

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.users$ = this.firestoreService.getUsers();

    this.authService.user$.subscribe((user) => {
      this.storedEmail = user ? user.uid : null;
    });

    const storedDetails = sessionStorage.getItem('userDetails');
    if (storedDetails) {
      const userDetails = JSON.parse(storedDetails);
      this.userName = userDetails.name || null;
      console.log('Dashboard loaded for:', this.userName);
    }

    this.fetchCaseStats();
  }

  async fetchCaseStats() {
    const firestore = this.firestoreService.getFirestore();
    const caseSnap = await getDocs(collection(firestore, 'cases'));
    const clientSnap = await getDocs(collection(firestore, 'clients'));

    const clientsMap = new Map<string, string>(
      clientSnap.docs.map((doc) => [doc.id, doc.data()['name'] || 'Unknown'])
    );

    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    const allCases: Case[] = caseSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data['title'] || '',
        caseNumber: data['caseNumber'] || '',
        clientId: data['clientId'] || '',
        clientName: clientsMap.get(data['clientId']) || 'Unknown',
        court: data['court'] || '',
        status: data['status'] || '',
        hearingDate: data['hearingDate'] || '',
        hearingTime: data['hearingTime'] || '',
      };
    });

    const upcoming = allCases.filter((c) => {
      if (!c.hearingDate) return false;
      const date = new Date(c.hearingDate);
      return date >= today && date <= sevenDaysLater;
    });

    this.upcomingHearings = upcoming;

    this.caseStats = {
      total: allCases.length,
      closed: allCases.filter((c) => c.status.toLowerCase() === 'closed').length,
      pending: allCases.filter((c) => c.status.toLowerCase() === 'pending').length,
      upcoming: upcoming.length,
    };
  }
    openCaseDetails(caseItem: Case) {
    this.dialog.open(CaseDetailsDialogComponent, {
      width: '400px',
      data: caseItem,
    });
  }
}
