import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class TellerGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) { }

    canActivate(): boolean {
        const role = this.auth.getRole();
        if (role === 'TELLER') {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}