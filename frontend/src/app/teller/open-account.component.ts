import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

declare const bootstrap: any;

@Component({
    selector: 'app-open-account',
    templateUrl: './open-account.component.html'
})
export class OpenAccountComponent {
    citizenId = '';
    thaiName = '';
    engName = '';
    initialDeposit: number = 0;
    result = '';
    error = '';

    constructor(private http: HttpClient, private router: Router) { }

    goBack() {
        const token = localStorage.getItem('token');
        if (!token) return this.router.navigate(['/login']);

        const decoded = JSON.parse(atob(token.split('.')[1]));
        const role = decoded.role;

        if (role === 'TELLER') {
            return this.router.navigate(['/dashboard/teller']);
        } else if (role === 'CUSTOMER') {
            return this.router.navigate(['/dashboard/customer']);
        } else {
            return this.router.navigate(['/login']);
        }
    }

    onSubmit() {
        this.result = '';
        this.error = '';

        const citizenIdRegex = /^\d{13}$/;

        if (!citizenIdRegex.test(this.citizenId)) {
            this.error = 'เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก';
            this.showToast('errorToast');
            return;
        }

        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        this.http.post<any>('http://localhost:8080/saving/open', {
            citizenId: this.citizenId,
            thaiName: this.thaiName,
            engName: this.engName,
            initialDeposit: this.initialDeposit
        }, { headers }).subscribe({
            next: (res) => {
                this.result = `เปิดบัญชีสำเร็จ เลขที่บัญชี: ${res.accountNumber}`;
                this.showToast('successToast');
            },
            error: (err) => {
                const raw = err.error?.message || err.error || 'ไม่สามารถ';
                let msg = '';

                switch (raw) {
                    case 'This user already has a saving account':
                        msg = 'เลขบัตรประชาชน' + this.citizenId + ' ได้ทำการเปิดบัญชีนี้ไปแล้ว';
                        break;
                    default:
                        msg = typeof raw === 'string' ? raw : JSON.stringify(raw);
                }

                this.error = msg;
                this.showToast('errorToast');
            }
        });
    }

    showToast(id: string) {
        const el = document.getElementById(id);
        if (el) {
            const toast = bootstrap.Toast.getOrCreateInstance(el);
            toast.show();
        }
    }
}
