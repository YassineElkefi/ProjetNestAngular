import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import  Swal from 'sweetalert2'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private authService: AuthService) { }

  password = '';
  confirmPassword = '';
  email = '';

  onRegister() {
    this.authService.register(this.email, this.password).subscribe(
      {
        "next": (user) => {
          Swal.fire(
            {
              icon: 'success',
              title: 'Success',
              text: 'User registered successfully'
            })
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
      })
  }
}
