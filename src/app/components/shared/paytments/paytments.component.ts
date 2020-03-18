import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { from, ReplaySubject, Subject, pipe } from 'rxjs';
import * as moment from 'moment';
import { ToastrService, Toast } from 'ngx-toastr';
import { PaymenService } from 'src/app/services/payment-services/payment.services';
import { PaymentModel } from '../../../models/payment/payment.full.model';
import { paymenPaymentModel } from '../../../models/payment/payment.model'
declare var $;

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
  public statusPayment: String[];
  activateTablet: boolean = false;
  public payments: any;
  public status: String = '';

  constructor(private _router: ActivatedRoute, private paymentService: PaymenService, private toastr: ToastrService, ) {
    this.paymentNormal = new paymenPaymentModel('0');
    this.paymentFull = new PaymentModel('', '0', 0, '', 0, '0', '');
    this.statusPayment = ['Pendiente', 'Pagado'];
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
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 5,
      autoWidth: true,
      order: [[0, 'desc']],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
      }
    };
    this.paymentService.listPaymentByLoan(id).subscribe(
      (payments: any) => {
        //console.log(payments)
        this.payments = payments.message;
        this.dtTrigger.next();
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
    if (date == null || date == 'null') {
      return date = 'Pendiente'
    }
    else {
      return date.substring(0, 10)
    }
  }

  //Funcionabilidad para pagos...
  openModal(id, idPaymen) {
    localStorage.setItem('idPayment', idPaymen);
    $("#" + id).modal("show");
  }

  closeModal(id) {
    $("#" + id).modal("hide");
  }

  setFormat(e, model) {
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
    if (model == 'interes') {
      console.log(model)
      this.paymentFull.interest = amount_parts.join('.');
    }
    else if (model == 'normal') {
      console.log(model)
      this.paymentNormal.amount = amount_parts.join('.');
    }
    else if (model == 'balance') {
      this.paymentFull.balanceLoand = amount_parts.join('.');
    }
    else {
      this.paymentFull.amount = amount_parts.join('.');
    }


    //   console.log(amount_parts.join('.'))
  }

  changeinterest(e) {
    let status = {
      Pendiente: '1',
      Pagado: '2'
    }
    this.status = status[e.target.value];
   
  }

  createPayment() {
    let value = this.paymentNormal.amount;
    let p = value.toString().split(',');
    this.paymentNormal.amount = p.join('');
    this.paymentService.createPayment(this.paymentNormal, '1', localStorage.getItem('idPayment')).subscribe(
      (payment: any) => {
        console.log('reponse payment', payment)
        if (payment.status == 'OK') {
          this.showToaster('1', 'Pago Cuota', 'Pago Cuota realizado exitosamente');
          $("#tablePayment").dataTable().fnDestroy();
          this.getPaymentbyLoan(localStorage.getItem('idLoan'));
          this.paymentNormal = new paymenPaymentModel('0');
          this.closeModal('show-md-crea-payment');
        } else {
          this.showToaster('2', 'Pago Cuota', 'No se ha podido realizar esta transacción');
          this.paymentNormal = new paymenPaymentModel('0');
          this.closeModal('show-md-crea-payment');
        }
      },
      error => {
        console.log(error);
      }

    )
  }

  updatePayment() {
    console.log(moment($("#payment-date").val()).format("YYYY-MM-DD"))
    this.paymentFull.dateDeposit = moment($("#payment-date").val()).format("YYYY-MM-DD");
    this.paymentFull.nextDatePayment = moment($("#payment-next-date").val()).format("YYYY-MM-DD");
    this.paymentFull.statusDeposit = this.status;
    console.log(this.paymentFull)
  }

  showToaster(status, title, message) {
    switch (status) {
      case '1':
        this.toastr.success(message, title);
        break;
      case '2':
        this.toastr.error(message, title);
        break
      default:
        this.toastr.error(message, title);
        break;
    }

  }

}





