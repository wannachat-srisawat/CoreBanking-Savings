import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html'
})
export class AccountsComponent implements OnInit {
    email = '';
    account: any = null;
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

      ngOnInit(): void {
        const token = localStorage.getItem('token');
        if (!token) return;
    
        const decoded = JSON.parse(atob(token.split('.')[1]));
        this.email = decoded.sub;
    
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        const params = new HttpParams().set('email', this.email);
    
        this.http.get<any>('http://localhost:8080/saving/accountInfo', { headers, params }).subscribe({
          next: (res) => this.account = res,
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
}
