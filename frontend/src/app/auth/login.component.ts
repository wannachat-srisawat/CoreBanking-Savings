import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
declare const bootstrap: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token);

        const tokenPayload = JSON.parse(atob(res.token.split('.')[1]));
        const role = tokenPayload.role;

        if (role === 'TELLER') {
          this.router.navigate(['/dashboard/teller']);
        } else {
          this.router.navigate(['/dashboard/customer']);
        }
      },
      error: () => this.showError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    });
  }

  showError(message: string) {
    this.error = message;
    const toastEl = document.getElementById('errorToast');
    if (toastEl) new bootstrap.Toast(toastEl).show();
  }

  showSuccess(message: string) {
    this.success = message;
    const toastEl = document.getElementById('successToast');
    if (toastEl) new bootstrap.Toast(toastEl).show();
  }
}