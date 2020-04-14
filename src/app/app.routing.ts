import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoansComponent } from './components/shared/loans/loans.component';
import { HomeComponent } from './components/home/home.component';
import { PaytmentsComponent } from './components/shared/paytments/paytments.component';
import { InterestComponent } from './components/shared/interest/interest.component';

const appRutes: Routes = [
    { path: '', component: HomeComponent },
    {path: 'prestamos', component: LoansComponent},
    {path: 'pagos/:idLoan', component: PaytmentsComponent},
    {path: 'intereses/:idPayment', component: InterestComponent},
    { path: '**', component: LayoutComponent }
]

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRutes);
