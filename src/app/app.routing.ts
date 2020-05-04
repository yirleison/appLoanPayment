import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoansComponent } from './components/shared/loans/loans.component';
import { HomeComponent } from './components/home/home.component';
import { PaytmentsComponent } from './components/shared/paytments/paytments.component';
import { InterestComponent } from './components/shared/interest/interest.component';
import { UserComponent } from './components/shared/user/user.component';
import { LoginComponent } from './components/shared/login/login.component';
import { NoFoundComponent } from './components/shared/no-found/nofound.component';
import { MainComponent } from './components/main.component';
import { SessionGuard } from './session.guard';
import { SessionLoginGuard } from './session-login.guard';


const appRutes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [SessionLoginGuard] },
    { path: '', component: LoginComponent },
    {
        path: 'home', component: LayoutComponent,
        canActivate: [SessionGuard],
        children: [
            { path: '', component: HomeComponent },
            { path: 'prestamos/:id', component: LoansComponent },
            { path: 'prestamos', component: LoansComponent },
            { path: 'pagos/:idLoan', component: PaytmentsComponent },
            { path: 'intereses/:idPayment', component: InterestComponent },
            { path: 'usuarios', component: UserComponent },
        ]
    },{path: '**', redirectTo:'login', pathMatch : 'full'}
]

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRutes);
