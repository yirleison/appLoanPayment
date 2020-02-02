import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoansComponent } from './components/shared/loans/loans.component';
import { HomeComponent } from './components/home/home.component';

const appRutes: Routes = [
    { path: '', component: HomeComponent },
    {path: 'prestamos', component: LoansComponent},
    { path: '**', component: LayoutComponent }
]

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRutes);