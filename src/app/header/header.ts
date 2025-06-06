import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
})
export class Header {
  constructor(private authService: AuthService, private router: Router) {}
  onLogout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/']); // Redirect to login after logout
    });
  }
}
