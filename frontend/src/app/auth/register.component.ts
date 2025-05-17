import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

declare const bootstrap: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  email = '';
  password = '';
  citizenId = '';
  thaiName = '';
  engName = '';
  pin = '';
  error = '';
  success = '';
  role = 'CUSTOMER';

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit() {
    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailRegex.test(this.email)) {
      this.showError('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }

    if (this.role === 'CUSTOMER') {
      if (!this.citizenId || this.citizenId.trim().length !== 13) {
        this.showError('กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก');
        return;
      }

      if (!this.pin || this.pin.trim().length !== 6) {
        this.showError('กรุณากรอก PIN ให้ครบ 6 หลัก');
        return;
      }
    }
    if (!this.isThai(this.thaiName)) {
      this.showError('ชื่อภาษาไทยต้องเป็นอักษรไทยเท่านั้น');
      return;
    }

    if (!this.isEnglish(this.engName)) {
      this.showError('ชื่อภาษาอังกฤษต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้น');
      return;
    }

    const payload = {
      email: this.email,
      password: this.password,
      citizenId: this.citizenId,
      role: this.role,
      thaiName: this.thaiName,
      engName: this.engName,
      pin: this.pin,
    };

    this.auth.register(payload).subscribe({
      next: (res: any) => {
        const message = res.message;
        switch (message) {
          case 'Register success':
            this.showSuccess('ลงทะเบียนสำเร็จ');
            break;
          default:
            this.showError('ลงทะเบียนสำเร็จ');
        }
        setTimeout(() => this.router.navigate(['/login']), 700);
      },
      error: (err) => {
        const message = err.error?.message || '';
        switch (message) {
          case 'Email already exists':
            this.showError('อีเมลนี้ซ้ำกับในระบบแล้ว');
            break;
          default:
            this.showError('ลงทะเบียนไม่สำเร็จ: ' + message);
        }
      }
    });
  }

  showError(message: string) {
    this.error = '';
    setTimeout(() => {
      this.error = message;
      const toastEl = document.getElementById('errorToast');
      if (toastEl) {
        const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
        toast.show();
      }
    }, 500);
  }
  showSuccess(message: string) {
    this.success = message;
    const toastEl = document.getElementById('successToast');
    if (toastEl) {
      const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
      toast.show();
    }
  }
  isThai(text: string): boolean {
    return /^[\u0E00-\u0E7F\s]+$/.test(text);
  }

  isEnglish(text: string): boolean {
    return /^[A-Za-z\s]+$/.test(text);
  }
}
