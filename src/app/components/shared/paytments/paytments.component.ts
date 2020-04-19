import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { from, ReplaySubject, Subject, pipe, empty } from 'rxjs';
import * as moment from 'moment';
import { ToastrService, Toast } from 'ngx-toastr';
import { PaymenService } from 'src/app/services/payment-services/payment.services';
import { InterestService } from '../../../services/interest-service/interest.service';
import { PaymentModel } from '../../../models/payment/payment.full.model';
import { paymenPaymentModel } from '../../../models/payment/payment.model'
import { ContentComponent } from '../content/content.component'
declare var $;

@Component({
  selector: 'app-paytments',
  templateUrl: './paytments.component.html',
  styleUrls: ['./paytments.component.css'],
  providers: [PaymenService, InterestService]
})
export class PaytmentsComponent implements OnInit {

  //@ViewChild(ContentComponent) hijo: ContentComponent;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, { static: true }) dtElement: DataTableDirective;

  public paymentFull: PaymentModel;
  public paymentNormal: paymenPaymentModel;
  public statusPayment: String[];
  activateTablet: boolean = false;
  public payments: any;
  public status: String = '';
  public balances: any;
  public balancePago: any = 0;
  public balanceInteres: any = 0;
  public cuotas: any = 0;
  public bandera: boolean;
  public interest: any;



  constructor(
    private _router: ActivatedRoute,
    private _route: Router,
    private paymentService: PaymenService,
    private interestService: InterestService,
    private toastr: ToastrService,
    private contentComponent: ContentComponent
  ) {
    this.paymentNormal = new paymenPaymentModel('0');
    this.paymentFull = new PaymentModel('', '', '0', '0', '', '0', '0', '');
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
        console.log(payments.message)
        if (payments.message.length > 0) {
          this.bandera = false;
        }
        else {
          this.bandera = true;
        }
        console.log(this.bandera)
        this.payments = payments.message;
        console.log(this.payments)
        this.balances = payments.message;
        this.cuotas = 0;
        for (let i = 0; i < this.balances.length; i++) {

          if (this.balances[i].statusDeposit) {
            this.balancePago += parseFloat(this.balances[i].balanceLoand);
            this.balanceInteres += parseFloat(this.balances[i].interest);
            this.cuotas++;
          }
        }
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
      return 'Pendiente'
    }
    else {
      return moment(date).format("YYYY-MM-DD");
      // return moment(date).year() + '-' + moment(date).month() +'-' + moment(date).day()
    }
  }

  //Funcionabilidad para pagos...
  openModal(id, idPaymen) {
    if (idPaymen != null || idPaymen != 'undefined' || idPaymen != '' || idPaymen != 'null') {
      localStorage.setItem('idPayment', idPaymen);
      console.log('idPayment', idPaymen)
    }
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
      this.paymentNormal.amount = amount_parts.join('.');
    }
    else if (model == 'balance') {
      this.paymentFull.balanceLoand = amount_parts.join('.');
    }
    //   console.log(amount_parts.join('.'))
  }

  formatPrice(value) {
    let val = (value / 1)
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  changeinterest(e) {
    let status = {
      Pendiente: '1',
      Pagado: '2'
    }
    this.status = status[e.target.value];
  }

  createPayment() {
    let status = {
      Pendiente: '1',
      Pagado: '2'
    }
    this.paymentFull.dateDeposit = null;
    //this.paymentFull.dateDeposit = moment($("#payment-date").val()).format("YYYY-MM-DD");
    this.paymentFull.nextDatePayment = moment($("#payment-next-date").val()).format("YYYY-MM-DD");
    if (this.paymentFull.statusDeposit) {
      this.paymentFull.statusDeposit = status[$("#statusPayment").val()];
    }
    else {
      this.paymentFull.statusDeposit = this.status;
    }
    this.paymentFull.balanceLoand = this.resetAmount(this.paymentFull.balanceLoand)
    this.paymentFull.interest = this.resetAmount(this.paymentFull.interest)
    this.paymentFull.amount = this.resetAmount(this.paymentFull.amount)
    this.paymentFull._id = localStorage.getItem('idPayment');
    this.paymentFull.idLoan = localStorage.getItem('idLoan');
    console.log(this.paymentFull)
    this.paymentService.createPayment(this.paymentFull)
      .subscribe(
        (paymetCreate: any) => {
          console.log(paymetCreate)
          if (paymetCreate.status == 'OK') {
            $("#tablePayment").dataTable().fnDestroy();
            this.balances = empty;
            this.balancePago = 0;
            this.balanceInteres = 0;
            this.cuotas = 0;
            this.getPaymentbyLoan(localStorage.getItem('idLoan'));
            this.closeModal('show-md-create-payment');
            this.paymentFull = new PaymentModel('', '', '0', '0', '', '0', '0', '');
            this.showToaster('1', 'Crear Pago', 'Pago creado con exito');
          }
        }
      )
  }
  updatePaymentNormal() {
    let value = this.paymentNormal.amount;
    let p = value.toString().split(',');
    this.paymentNormal.amount = p.join('');
    this.paymentService.updatePaymentNormal(this.paymentNormal, '1', localStorage.getItem('idPayment')).subscribe(
      (payment: any) => {
        console.log('reponse payment', payment)
        if (payment.message === "El prestamo se ha pagado en su totalidad" && payment.status === 'OK') {
          console.log('mensaje normal')
          this.showToaster('1', 'Pago Cuota', 'El prestamo se ha pagado en su totalidad');
          $("#tablePayment").dataTable().fnDestroy();
          this.balances = empty;
          this.balancePago = 0;
          this.balanceInteres = 0;
          this.cuotas = 0;
          this.getPaymentbyLoan(localStorage.getItem('idLoan'));
          this.paymentNormal = new paymenPaymentModel('0');
          this.closeModal('show-md-update-payment-normal');
        } else if (payment.status == 'OK' && payment.message !== "El prestamo se ha pagado en su totalidad") {
          console.log('mensaje cuando se paga un prestamo a totalidad')
          this.showToaster('1', 'Pago Cuota', 'Pago Cuota realizado exitosamente');
          $("#tablePayment").dataTable().fnDestroy();
          this.balances = empty;
          this.balancePago = 0;
          this.balanceInteres = 0;
          this.cuotas = 0;
          this.getPaymentbyLoan(localStorage.getItem('idLoan'));
          this.paymentNormal = new paymenPaymentModel('0');
          this.closeModal('show-md-update-payment-normal');
        } else if (payment.status == 'false') {
          this.showToaster('2', 'Pago Cuota', 'No se ha podido realizar esta transacción');
          this.paymentNormal = new paymenPaymentModel('0');
          this.closeModal('show-md-update-payment-normal');
        }


      },
      error => {
        console.log(error);
      }

    )
  }

  editPayment(idModal, idPaymen) {

    console.log(idModal, idPaymen)
    this.paymentService.listPaymentBId(idPaymen)
      .subscribe(
        (payment: any) => {
          if (payment) {
            //console.log('payment',payment);
            this.paymentFull = payment.message;
            if (this.paymentFull.dateDeposit == 'null' || this.paymentFull.dateDeposit == null) {
              this.paymentFull.dateDeposit = 'Pendiente'
            }
            else {
              this.paymentFull.dateDeposit = this.formateDate(this.paymentFull.dateDeposit)
            }
            this.paymentFull.nextDatePayment = this.formateDate(this.paymentFull.nextDatePayment);
            this.paymentFull.statusDeposit = (this.paymentFull.statusDeposit ? 'Pagado' : 'Pendiente')
            this.paymentFull.balanceLoand = this.formatPrice(this.paymentFull.balanceLoand)
            this.paymentFull.interest = this.formatPrice(this.paymentFull.interest)
            this.paymentFull.amount = this.formatPrice(this.paymentFull.amount)
            console.log('Modelo completo payment', this.paymentFull);
            this.openModal(idModal, idPaymen)
          }
        },
        error => {
          console.log(error);
        }
      )

  }

  updatePayment() {
    let status = {
      Pendiente: '1',
      Pagado: '2'
    }
    this.paymentFull.dateDeposit = ($("#payment-date").val() == 'Pendiente' ? this.paymentFull.dateDeposit = 'null' : this.paymentFull.dateDeposit = moment($("#payment-date").val()).format("YYYY-MM-DD"))
    //this.paymentFull.dateDeposit = moment($("#payment-date").val()).format("YYYY-MM-DD");
    this.paymentFull.nextDatePayment = moment($("#payment-next-date").val()).format("YYYY-MM-DD");
    if (this.paymentFull.statusDeposit) {
      this.paymentFull.statusDeposit = status[$("#statusPayment").val()];
      console.log('entro1', this.paymentFull.statusDeposit)
    }
    else {
      this.paymentFull.statusDeposit = this.status;
      console.log('entro2', this.paymentFull)
    }
    this.paymentFull.balanceLoand = this.resetAmount(this.paymentFull.balanceLoand)
    this.paymentFull.interest = this.resetAmount(this.paymentFull.interest)
    this.paymentFull.amount = this.resetAmount(this.paymentFull.amount)
    this.paymentFull._id = localStorage.getItem('idPayment');
    //this.paymentFull.idLoan = localStorage.getItem('idPayment');
    console.log(this.paymentFull)
    this.paymentService.updatePayment(this.paymentFull, this.paymentFull._id)
      .subscribe(
        (paymetUpdate: any) => {
          console.log(paymetUpdate)
          if (paymetUpdate.status == 'OK') {
            $("#tablePayment").dataTable().fnDestroy();
            this.balances = empty;
            this.balancePago = 0;
            this.balanceInteres = 0;
            this.cuotas = 0;
            this.getPaymentbyLoan(localStorage.getItem('idLoan'));
            this.closeModal('show-md-update-payment');
            this.paymentFull = new PaymentModel('', '', '0', '0', '', '0', '0', '');
            this.showToaster('1', 'Actualización pago', 'Actuañización pago reaizada con exitoso');
          }
        }
      )
  }

  deletePayment() {
    //console.log(localStorage.getItem('idPayment'))
    this.paymentService.deletePayment(localStorage.getItem('idPayment')).subscribe(
      (paymentDelete: any) => {
        if (paymentDelete.status == 'OK') {
          this.showToaster('1', 'Eliminación pago', 'Eliminación de pago reaizada con exito');
          $("#tablePayment").dataTable().fnDestroy();
          this.getPaymentbyLoan(localStorage.getItem('idLoan'));
          this.balances = empty;
          this.balancePago = 0;
          this.balanceInteres = 0;
          this.cuotas = 0;

          this.closeModal('confirm-delete');
        }
      },
      error => {
        console.error(error);

      }
    )
  }

  showToaster(status, title, message) {
    switch (status) {
      case '1':
        this.toastr.success(message + '.', title);
        break;
      case '2':
        this.toastr.error(message + '.', title);
        break
      default:
        this.toastr.error(message + '.', title);
        break;
    }
  }

  getInterestByIdPayment(id) {
   
    this.interestService.listInterest().subscribe(
      (interest: any) => {
        console.log(interest)
        if (interest.status == 'OK' && interest.message.length > 0) {
          console.log(id)
          let p = interest.message;
          let t = p.filter(x => x.idPayment == id);
          if (t.length > 0) {
            console.log('entro', t)
            this._route.navigate(['intereses/', id]);
          }
          else {
            console.log('no lo encontro')
            this.contentComponent.changeStatusAlert(true, 'info', 'Esta cuota de pago no presenta intereses en mora.')
          }
          // this._route.navigate(['intereses/', id]);
        }
        else {
          this.contentComponent.changeStatusAlert(true, 'info', 'Esta cuota de pago no presenta intereses en mora.')
        }
      },
      error => { console.error(error) }
    )

  }
  resetAmount(value) {
    value.toString().split(',');
    let p = value.toString().split(',');
    return p.join('');
  }
}





