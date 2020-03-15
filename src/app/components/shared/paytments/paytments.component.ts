import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { from, ReplaySubject, Subject, pipe } from 'rxjs';
import * as moment from 'moment';
import { ToastrService, Toast } from 'ngx-toastr';
import { PaymenService } from 'src/app/services/payment-services/payment.services';
import { PaymentModel } from '../../../models/payment/payment.full.model';
import { paymenPaymentModel } from '../../../models/payment/payment.model'
declare var $;
var table = null;


@Component({
  selector: 'app-paytments',
  templateUrl: './paytments.component.html',
  styleUrls: ['./paytments.component.css'],
  providers: [PaymenService]
})
export class PaytmentsComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, { static: true }) dtElement: DataTableDirective;

  public paymentFull: PaymentModel;
  public paymentNormal: paymenPaymentModel;

  activateTablet: boolean = false;
  public payments: any;

  constructor(private _router: ActivatedRoute, private paymentService: PaymenService) {
    this.paymentNormal = new paymenPaymentModel('0');
    this.paymentFull = new PaymentModel('', '0', 0, '', 0, false, '');
  }

  ngOnInit() {
    this.paramsByRoute()

  }

  paramsByRoute() {
    this._router.params.subscribe(
      (params: Params) => {
        this.getPaymentbyLoan(params.idLoan)
        localStorage.setItem('idLoan', params.idLoan);
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

  formateDate(date) {
    if(date != 'Pendiente') {
      return date.substring(0,10)
    }
  }

  //Funcionabilidad para pagos...
  openModal(id,idPaymen) {
   localStorage.setItem('idPayment',idPaymen);
    $("#" + id).modal("show");
  }

  setFormat(e) {

    let amount;
    amount += '';
    amount = e.target.value;
    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto
     // si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(0);
    // si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(amount) || amount === 0)
      return parseFloat("0").toFixed(2);
    var amount_parts = amount.split('.'),
      regexp = /(\d+)(\d{3})/;
    while (regexp.test(amount_parts[0]))
      amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');

    this.paymentNormal.amount = amount_parts.join('.');
    console.log(amount_parts.join('.'))
  }

  createPayment() {
    let value = this.paymentNormal.amount;
    let p = value.toString().split(',');
    this.paymentNormal.amount = p.join('');
    this.paymentService.createPayment(this.paymentNormal,'1',localStorage.getItem('idPayment')).subscribe(
      (payment: any) => {
        console.log('Respuesta Server para un pago',payment)
        $("#tablePayment").dataTable().fnDestroy();
        this.getPaymentbyLoan(localStorage.getItem('idLoan'))
      },
      error => {
        console.log(error);
      }
      
      )        
  }

}





