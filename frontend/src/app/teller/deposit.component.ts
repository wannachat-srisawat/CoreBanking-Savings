import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

declare const bootstrap: any;

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
})
export class DepositComponent {
    accountNumber = '';
    amount = 0;
    success = '';
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
        this.success = '';
        this.error = '';

        if (this.amount <= 0) {
            this.error = 'จำนวนเงินต้องฝากมากกว่า 0 บาท';
            this.showToast('errorToast');
            return;
        }

        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        this.http.post<any>('http://localhost:8080/saving/deposit', {
            accountNumber: this.accountNumber,
            amount: this.amount
        }, { headers }).subscribe({
            next: (res) => {
                this.success = `ฝากเงินสำเร็จ จำนวน ` + this.amount + ` บาท เข้าบัญชี ${this.accountNumber}`;
                this.showToast('successToast');
            },
            error: (err) => {
                const raw = err.error?.message || err.error || 'ไม่สามารถฝากเงินได้';
                let msg = '';

                switch (raw) {
                    case 'AccountNumber not found':
                        msg = 'ไม่พบเลขบัญชีนี้ในระบบ';
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
