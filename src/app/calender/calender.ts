import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { FullCalendarModule } from '@fullcalendar/angular'; 
@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calender.html',
  styleUrl: './calender.css',
})
export class Calendar implements OnInit {
  calendarOptions: any;

  ngOnInit(): void {
    // Example events - replace with your hearings data
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay'
      },
      events: [
        { title: 'Case: Saledeed', date: '2025-06-10' },
        { title: 'Case: Property Hearing', date: '2025-06-15' }
      ],
      dateClick: this.handleDateClick.bind(this),
    };
  }

  handleDateClick(arg: any) {
    alert('Clicked date: ' + arg.dateStr);
  }
}
