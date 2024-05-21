import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showNavbar: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const excludedRoutesNavbar = ["/auth/login","/auth/register"];
        this.showNavbar = !excludedRoutesNavbar.includes(event.url);
      }
    });
  }
}
