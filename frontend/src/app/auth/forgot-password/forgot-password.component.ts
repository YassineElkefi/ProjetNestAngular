import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
constructor(private authService: AuthService) { }

  email: string;
  submitted: boolean = false;
  success: boolean = false;
  onSubmit() {
    this.authService.forgotPassword(this.email).subscribe(
      {
        next: () => {
          this.submitted = true;
          this.success = true;
        },
        error: () => {
          this.submitted = true;
          this.success = false;
        }
      }
    );
  }
}
