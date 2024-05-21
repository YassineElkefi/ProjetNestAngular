import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private cookieService: CookieService, private router: Router) { }

  userEmail = this.cookieService.get('user') || null;

  logout() {
    this.cookieService.delete('authToken');
    this.cookieService.delete('user');
    this.router.navigate(['/auth/login']);
  }

}
