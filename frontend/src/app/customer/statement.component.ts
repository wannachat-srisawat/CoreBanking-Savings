import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

interface Transaction {
    transactionDate: string;
    type: string;
    amount: number;
    balance: number;
    remark: string;
}

interface MonthlyStatementResponse {
    accountNumber: string;
    month: number;
    year: number;
    transactions: Transaction[];
    totalIn: number;
    totalOut: number;
}

@Component({
    selector: 'app-statement',
    templateUrl: './statement.component.html'
})
export class StatementComponent {
    accountNumber = '';
    month = new Date().getMonth() + 1;
    year = new Date().getFullYear();

    result: MonthlyStatementResponse | null = null;
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
          }
        });
      }

    onSubmit() {
        this.result = null;
        this.error = '';

        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        const params = new HttpParams()
            .set('accountNumber', this.accountNumber)
            .set('month', this.month.toString())
            .set('year', this.year.toString());

        this.http.get<MonthlyStatementResponse>('http://localhost:8080/saving/statement', { headers, params }).subscribe({
            next: (res) => {
                this.result = res;
            },
            error: (err) => {
                this.error = err.error?.message || err.error || 'ไม่สามารถดึงข้อมูลได้';
            }
        });
    }
}
