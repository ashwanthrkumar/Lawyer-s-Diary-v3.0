import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  
})
export class Header {
  bootstrap: any;
  userName: string | null = null;
  isLoggedIn = false;
  constructor(private authService: AuthService, private router: Router, private firestoreService: FirestoreService) {}
  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
    const storedDetails = sessionStorage.getItem('userDetails');
    if (storedDetails) {
      const userDetails = JSON.parse(storedDetails);
      this.userName = userDetails.name || null;
    }
  }
  onLogout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/auth']);
    });
  }
 

  // collapseNavbar() {
  //   const navbar = document.getElementById('navbarSupportedContent');
  //   if (navbar?.classList.contains('show')) {
  //     // Bootstrap collapse via jQuery or manual trigger
  //     const bsCollapse = new this.bootstrap.Collapse(navbar, {
  //       toggle: false
  //     });
  //     bsCollapse.hide();
  //   }
  // }
  collapseNavbar() {
    const element = document.getElementById('navbarSupportedContent');
    if (element?.classList.contains('show')) {
      element.classList.remove('show');
    }
  }
  
}
