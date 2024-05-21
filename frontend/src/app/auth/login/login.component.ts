import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  password = '';
  email = '';

  constructor(private authService:AuthService, private router:Router) { }
  onLogin() {
    this.authService.login(this.email, this.password).subscribe(
      {
        "next": (user) => {
          Swal.fire(
            {
              icon: 'success',
              title: 'Welcome!',
              text: 'You are now logged in!'
            }
          );
          this.router.navigate(['/']);
        },
        "error": (error) => {
          Swal.fire(
            {
              icon: 'error',
              title: 'Oops...',
              text: error.error.message
            }
          );
        }
      });
      }
  }
