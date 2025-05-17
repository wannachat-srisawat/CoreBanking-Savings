import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  role: string | null = '';
  email: string | null = '';
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
    this.role = user?.role || 'CUSTOMER';
    this.email = user?.sub || 'unknown@example.com';
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
