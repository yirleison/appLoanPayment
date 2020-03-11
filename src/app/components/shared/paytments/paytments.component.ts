import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import { ToastrService, Toast } from 'ngx-toastr';
import { PaymenService } from 'src/app/services/payment-services/payment.services';

declare var $;
var table = null;

@Component({
  selector: 'app-paytments',
  templateUrl: './paytments.component.html',
  styleUrls: ['./paytments.component.css'],
  providers: [PaymenService]
})
export class PaytmentsComponent implements OnInit {

  activateTablet: boolean = false;
  public payments: any;

  constructor(private _router: ActivatedRoute, private paymentService: PaymenService) {

  }

  ngOnInit() {
    this.paramsByRoute()
  }

  paramsByRoute() {
    this._router.params.subscribe(
      (params: Params) => {
       this.getPaymentbyLoan(params.idLoan)
      }
    );
  }
  
  getPaymentbyLoan(id) {
    this.paymentService.listPaymentByLoan(id).subscribe(
      (payments: any) => {
        console.log(payments)
        this.payments = payments.message;
      },
      error => {
        console.log(error)
      }
    )
  }

  statusPaymenDate(status) {
    return status == false || status == null || status == 'null' ? 'Pendiente' : 'Pagado'
  }


}





