import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc,getDocs, Timestamp } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-case-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-case-client.component.html',
  styleUrls: ['./add-case-client.component.css']
})
export class AddCaseClientComponent {
  // Client form fields
  clientName = '';
  clientEmail = '';
  clientPhone = '';
  clients: any[] = [];         // All clients from Firestore
  selectedClientId: string = ''; 
  // Case form fields
  caseTitle = '';
  caseCourt = '';
  caseJudge = '';
  caseType = '';
  caseNumber = '';
  caseStatus = 'Active';
  initialForm: 'client' | 'case' = 'client';
  // Track if client is added and store new clientId
  clientAdded = false;
  newClientId: string | null = null;

  loading = false;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      const form = params.get('form');
      if (form === 'case' || form === 'client') {
        this.initialForm = form as 'case' | 'client';
      }
      this.clientAdded = this.initialForm === 'case' ? true : false;
      if (this.initialForm === 'client') {
        this.newClientId = null;
      }
    });
  }
  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const form = params.get('form');
      if (form === 'case' || form === 'client') {
        this.initialForm = form as 'case' | 'client';
      }
  
      if (this.initialForm === 'case') {
        this.clientAdded = true;
        await this.fetchClients(); // Fetch existing clients for dropdown
      } else {
        this.clientAdded = false;
      }
    });
  }
  
async fetchClients() {
  try {
    const snapshot = await getDocs(collection(this.firestore, 'clients'));
    this.clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching clients:', error);
    alert('Failed to load clients.');
  }
}

async addClient() {
  if (!this.clientName || !this.clientEmail) {
    alert('Client name and email are required');
    return;
  }

  this.loading = true;
  try {
    const clientsRef = collection(this.firestore, 'clients');
    const docRef = await addDoc(clientsRef, {
      name: this.clientName,
      email: this.clientEmail,
      phone: this.clientPhone,
      createdAt: Timestamp.now()
    });
    this.newClientId = docRef.id;
    alert('Client added successfully');
    this.router.navigate(['/dashboard']);
    // Do not set clientAdded to true automatically
  } catch (error) {
    console.error('Error adding client:', error);
    alert('Failed to add client.');
  } finally {
    this.loading = false;
  }
}


  async addCase() {
    if (!this.caseTitle || !this.caseCourt || !this.caseJudge || !this.caseType) {
      alert('Please fill all case details');
      return;
    }

    const clientId = this.newClientId || this.selectedClientId;
    if (!clientId) {
      alert('Please select a client');
      return;
    }
    

    this.loading = true;
    try {
      const casesRef = collection(this.firestore, 'cases');
      const userId = this.authService.currentUser?.uid;
      if (!userId) {
        alert('User not authenticated');
        this.loading = false;
        return;
      }
      await addDoc(casesRef, {
        lawyerId: userId,
        clientId: clientId,
        title: this.caseTitle,
        court: this.caseCourt,
        judge: this.caseJudge,
        caseType: this.caseType,
        caseNumber: this.caseNumber,
        status: this.caseStatus,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      alert('Case added successfully!');
      // Reset form if you want or redirect
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error adding case:', error);
      alert('Failed to add case.');
    } finally {
      this.loading = false;
    }
  }
}
