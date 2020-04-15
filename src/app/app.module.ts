import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';


import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { MenuComponent } from './components/shared/menu/menu.component';
import { ContentComponent } from './components/shared/content/content.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { SettingComponent } from './components/shared/setting/setting.component';
import { LoansComponent } from './components/shared/loans/loans.component';
import { LayoutComponent } from './components/layout/layout.component';
import { InterestComponent } from './components/shared/interest/interest.component';
import { routing, appRoutingProviders } from './app.routing';
import { HomeComponent } from './components/home/home.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaytmentsComponent } from './components/shared/paytments/paytments.component';
import { UserComponent } from './components/shared/user/user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { IonicModule } from '@ionic/angular';
//import { AlertsModule } from 'angular-alert-module';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    ContentComponent,
    FooterComponent,
    SettingComponent,
    LoansComponent,
    LayoutComponent,
    HomeComponent,
    PaytmentsComponent,
    InterestComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgbModule,
    ToastrModule.forRoot(),
    IonicModule.forRoot(),
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
