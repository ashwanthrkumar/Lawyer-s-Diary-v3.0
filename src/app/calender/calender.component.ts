import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FirestoreService } from '../services/firestore.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CaseDetailsDialogComponent } from '../dialogs/case-details-dialog/case-details-dialog.component'; // Adjust path if needed

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, CommonModule, MatDialogModule],
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventColor: '#3788d8'
  };

  constructor(private fs: FirestoreService, private dialog: MatDialog) {}

  ngOnInit() {
    const lawyerId = sessionStorage.getItem('loggedInUserUID') || '';

    this.fs.getCasesWithClientNames(lawyerId).subscribe(cases => {
      const formattedEvents = cases.map(c => ({
        title: `${c.caseNumber} : ${c.clientName}`,
        date: c.hearingDate,
        extendedProps: {
          ...c
        }
      }));

      this.calendarOptions.events = formattedEvents;
    });
  }

  handleEventClick(arg: any) {
    const data = {
      caseNumber: arg.event.title.split(':')[0].trim(),
      hearingDate: arg.event.startStr,
      ...arg.event.extendedProps
    };

    this.dialog.open(CaseDetailsDialogComponent, {
      data,
      width: '400px'
    });
  }
}
