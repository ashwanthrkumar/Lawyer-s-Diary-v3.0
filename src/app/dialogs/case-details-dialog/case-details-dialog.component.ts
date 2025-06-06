import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-case-details-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Case Details</h2>
    <mat-dialog-content>
      <p><strong>Case Number:</strong> {{ data.caseNumber }}</p>
      <p><strong>Hearing Date:</strong> {{ data.hearingDate }}</p>
      <p><strong>Court:</strong> {{ data.court }}</p>
      <p><strong>Judge:</strong> {{ data.judge }}</p>
      <p><strong>Case Type:</strong> {{ data.caseType }}</p>
      <p><strong>Status:</strong> {{ data.status }}</p>
      <p><strong>Client Name:</strong> {{ data.clientName }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class CaseDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
