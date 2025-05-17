import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { DashboardComponent } from './dashbord/dashboard.component';
import { TellerGuard } from './auth/teller.guard';
import { OpenAccountComponent } from './teller/open-account.component';
import { DepositComponent } from './teller/deposit.component';
import { WithdrawComponent } from './customer/withdraw.component';
import { TransferComponent } from './customer/transfer.component';
import { StatementComponent } from './customer/statement.component';
import { AccountsComponent } from './customer/accounts.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard/teller', component: DashboardComponent, canActivate: [TellerGuard] },
  { path: 'dashboard/customer', component: DashboardComponent },
  { path: 'open-account', component: OpenAccountComponent },
  { path: 'deposit', component: DepositComponent },
  { path: 'withdraw', component: WithdrawComponent },
  { path: 'transfer', component: TransferComponent },
  { path: 'statement', component: StatementComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }