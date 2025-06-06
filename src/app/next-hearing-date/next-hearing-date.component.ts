import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDocs, updateDoc, doc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-update-hearing-date',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './next-hearing-date.component.html',
})
export class NextHearingDate implements OnInit {
  allCases: any[] = [];
  filteredCases: any[] = [];

  selectedCaseId = '';
  newHearingDate = '';
  caseSearchTerm = '';

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    await this.loadCases();
  }

  async loadCases() {
    const caseSnap = await getDocs(collection(this.firestore, 'cases'));
    this.allCases = [];

    for (const caseDoc of caseSnap.docs) {
      const caseData = caseDoc.data();
      const clientId = caseData['clientId'];
      const clientSnap = await getDocs(collection(this.firestore, 'clients'));
      const client = clientSnap.docs.find(doc => doc.id === clientId)?.data();

      this.allCases.push({
        id: caseDoc.id,
        title: caseData['title'],
        caseNumber: caseData['caseNumber'] || '',
        clientName: client?.['name'] || 'Unknown',
      });
    }

    this.filteredCases = [...this.allCases];
  }

  filterCases() {
    const term = this.caseSearchTerm.toLowerCase();
    this.filteredCases = this.allCases.filter(c =>
      c.title.toLowerCase().includes(term) ||
      c.caseNumber.toLowerCase().includes(term) ||
      c.clientName.toLowerCase().includes(term)
    );
  }

  async updateHearingDate() {
    if (!this.selectedCaseId || !this.newHearingDate) {
      alert('Please select a case and date.');
      return;
    }
  
    try {
      const caseRef = doc(this.firestore, 'cases', this.selectedCaseId);
      await updateDoc(caseRef, {
        hearingDate: this.newHearingDate, // <-- save as "2025-06-17"
        updatedAt: Timestamp.now() // still storing this as Timestamp for tracking
      });
      alert('Hearing date updated successfully.');
    } catch (error) {
      console.error('Error updating hearing date:', error);
      alert('Failed to update hearing date.');
    }
  }
  
}
