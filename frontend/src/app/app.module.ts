import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './auth/register.component';
import { DashboardComponent } from './dashbord/dashboard.component';
import { OpenAccountComponent } from './teller/open-account.component';
import { DepositComponent } from './teller/deposit.component';
import { WithdrawComponent } from './customer/withdraw.component';
import { TransferComponent } from './customer/transfer.component';
import { StatementComponent } from './customer/statement.component';
import { AccountsComponent } from './customer/accounts.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent,
    DashboardComponent, OpenAccountComponent, DepositComponent,
    WithdrawComponent, TransferComponent, StatementComponent, AccountsComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  bootstrap: [AppComponent]
})
export class AppModule { }