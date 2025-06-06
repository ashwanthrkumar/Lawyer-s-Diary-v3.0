import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dashboard } from './dashboard/dashboard.component';
import { Header } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, Dashboard, Header],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected title = 'myapp';
}
