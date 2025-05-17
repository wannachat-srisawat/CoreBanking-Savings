import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

declare const bootstrap: any;

@Component({
    selector: 'app-withdraw',
    templateUrl: './withdraw.component.html'
})
export class WithdrawComponent {
    accountNumber = '';
    amount = 0;
    pin = '';
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
    account: any = null;
    ngOnInit(): void {
        const token = localStorage.getItem('token');
        const email = token ? JSON.parse(atob(token.split('.')[1])).sub : null;


        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        const params = new HttpParams().set('email', email);

        this.http.get<any>('http://localhost:8080/saving/accountInfo', { headers, params }).subscribe({
            next: (res) => {
                this.account = res;
                this.accountNumber = res.accountNumber;
            },
            error: (err) => {
                const raw = err.error?.message || err.error || 'ไม่สามารถดึงข้อมูลได้';
                let msg = '';

                switch (raw) {
                    case 'Saving account not found':
                        msg = 'คุณยังไม่ได้ทำการเปิดบัญชี กรุณาติดต่อ TELLER เพื่อเปิดบัญชี';
                        break;
                    default:
                        msg = typeof raw === 'string' ? raw : JSON.stringify(raw);
                }

                this.error = msg;
                this.showToast('errorToast');
            }
        });
    }

    onSubmit() {
        this.success = '';
        this.error = '';

        if (!this.amount || this.amount <= 0) {
            this.error = 'จำนวนเงินต้องมากกว่า 0';
            this.showToast('errorToast');
            return;
        }

        if (!this.pin.trim()) {
            this.error = 'กรุณาระบุ PIN';
            this.showToast('errorToast');
            return;
        }

        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        this.http.post<any>('http://localhost:8080/saving/withdraw', {
            accountNumber: this.accountNumber,
            amount: this.amount,
            pin: this.pin
        }, { headers }).subscribe({
            next: (res) => {
                this.success = `ถอนเงินสำเร็จจากบัญชี ${this.accountNumber} จำนวน ${this.amount} บาท`;
                this.showToast('successToast');
                this.ngOnInit();
            },
            error: (err) => {
                const raw = err.error?.message || err.error || 'ไม่สามารถถอนเงินได้';
                let msg = '';

                switch (raw) {
                    case 'AccountNumber not found':
                        msg = 'ไม่พบเลขที่บัญชีนี้';
                        break;
                    case 'Insufficient balance':
                        msg = 'ยอดเงินในบัญชีไม่เพียงพอ';
                        break;
                    case 'Invalid PIN':
                        msg = 'PIN ไม่ถูกต้อง';
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
