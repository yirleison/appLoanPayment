import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { from, ReplaySubject, Subject, pipe, empty } from 'rxjs';
import * as moment from 'moment';
import { ToastrService, Toast } from 'ngx-toastr';
import { PaymenService } from 'src/app/services/payment-services/payment.services';
import { InterestService } from '../../../services/interest-service/interest.service';
import { PaymentModel } from '../../../models/payment/payment.full.model';
import { paymenPaymentModel } from '../../../models/payment/payment.model'
import { InterestModel } from '../../../models/interest/interst.model'
import { ContentComponent } from '../content/content.component'
declare var $;

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css'],
  providers: [InterestService]
})
export class InterestComponent implements OnInit {
  public interest: any
  public statusInterest: String[];
  public status: String = '';
  public interestModel: InterestModel;
  public prueba: any;
  public flagPreload: boolean = false
  public showTable: boolean = false
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: true }) dtElement: DataTableDirective;
  constructor(private _location: Location, private _router: ActivatedRoute, private interestService: InterestService, private toastr: ToastrService) {
    this.statusInterest = ['Pendiente', 'Pagado'];
    this.interestModel = new InterestModel('', '', '', '0', '')
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.paramsByRoute()
    $(function () {
      $("#interest-datepicker")
        .datepicker({
          autoclose: true,
          todayHighlight: true
        })
        .datepicker("update", new Date());
    });

  }
  backClicked() {
    this._location.back();
  }
  statusPaymenDate(status) {
    return status == false || status == null || status == 'null' ? 'Pendiente' : 'Pagado'
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
      this.interestModel.interestPending = amount_parts.join('.');
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
    console.log(this.status)
  }

  paramsByRoute() {

    this._router.params.subscribe(
      (params: Params) => {
        let idPayment = params.idPayment;
        this.getInterestById(null, params.idPayment)
        localStorage.setItem('idPaymentUpdate', idPayment);
      }
    );
  }
  openModal(id, idPayment) {
    if (idPayment != null || idPayment != 'undefined' || idPayment != '' || idPayment != 'null') {
      localStorage.setItem('idPayment', idPayment);
      console.log('idPayment', idPayment)
    }
    $("#" + id).modal("show");
  }

  closeModal(id) {
    $("#" + id).modal("hide");
  }

  createInterest() {
    this.flagPreload = true
    let state = this.interestModel.state;
    let dateTest = $("#date-interest").val()
    if (dateTest == 'Pendiente') {
      this.interestModel.dayPayment = 'null'
    }
    if (dateTest == 'Invalid date') {
      this.interestModel.dayPayment = 'null'
    }
    if (dateTest == "") {
      this.interestModel.dayPayment = 'null'
    }
    this.interestModel.dayPayment = (dateTest == 'null' || dateTest == null ? 'null' : this.interestModel.dayPayment = moment(new Date(dateTest)).format("YYYY-MM-DD"))
    this.interestModel.state = (state == 'Pendiente' ? '0' : '1')
    this.interestModel.interestPending = this.resetAmount(this.interestModel.interestPending)
    this.interestModel.idPayment = localStorage.getItem('idPaymentUpdate')
    this.interestService.createInterest(this.interestModel._id, this.interestModel).subscribe(
      (interestUpdate: any) => {
        if (interestUpdate.status == 'OK') {
          this.flagPreload = false
            //console.log('Funciono')
            this.showToaster('1', 'Registro intereses', 'Registro creado exitosamente');
            $("#tableInterest").dataTable().fnDestroy();
            this.getInterestByIdPayment(null, localStorage.getItem('idPaymentUpdate'))
            this.interestModel = new InterestModel('', '', '', '0', '')
            this.closeModal('show-md-create-interest')
          //this.openModal(idModal, null)
        } else {
          this.flagPreload = false
          this.showToaster('2', 'Registro intereses', 'No se ha podido procesar esta solicitud.');
        }
      },
      error => {
        this.flagPreload = false
        console.log(error)
      }
    )
    //console.log(this.interestModel)
  }

  editInterest(idModal, id) {
    console.log(idModal, id)
    this.interestService.listInterestById(id).subscribe(
      (interest: any) => {
        if (interest.status == 'OK') {
          if (interest.status == 'OK') {
            //this.interest = interest.message;
            this.interestModel = interest.message
            this.interestModel.dayPayment = this.interestModel.dayPayment.substring(0, 10)
            this.interestModel.state = (this.interestModel.state) ? this.statusInterest[1] : this.statusInterest[0]
            this.interestModel.interestPending = this.formatPrice(this.interestModel.interestPending)
          }
          this.openModal(idModal, null)
        }
      },
      error => { console.error(error) }
    )
    // this.openModal(idModal,null);
    //console.log(id,idModal)
  }

  updateInterest() {
    this.flagPreload = true
    let state = this.interestModel.state;
    this.interestModel.state = (state == 'Pendiente' ? '0' : '1')
    this.interestModel.interestPending = this.resetAmount(this.interestModel.interestPending)
    console.log(this.interestModel)
    this.interestService.updateInterest(this.interestModel._id, this.interestModel).subscribe(
      (interestUpdate: any) => {
        if (interestUpdate.status == 'OK') {
          if (interestUpdate.status == 'OK') {
            this.flagPreload = false
            //console.log('Funciono')
            this.showToaster('1', 'Actualización intereses', 'Actualización reaizada con exito');
            $("#tableInterest").dataTable().fnDestroy();
            this.getInterestByIdPayment(null, localStorage.getItem('idPaymentUpdate'))
            this.interestModel = new InterestModel('', '', '', '0', '')
            this.closeModal('show-md-update-interest')
          }
          //this.openModal(idModal, null)
        } else {
          this.flagPreload = false
          this.showToaster('2', 'Actualización intereses', 'No se ha podido procesar esta solicitud.');
        }
      },
      error => {
        this.flagPreload = false
        console.log(error)
      }
    )
    //console.log(this.interestModel)
  }

  //Funcionabilidad para pago y consulta de intereses...
  getInterestByIdPayment(idModal, idPayment) {
    let options = {
      pagingType: "full_numbers",
      pageLength: 5,
      autoWidth: true,
      order: [[0, 'desc']],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
      }
    }
    this.interestService.listInterest().subscribe(
      (interest: any) => {
        if (interest.status == 'OK') {
          if (interest.status == 'OK') {
            this.interest = interest.message;
            if (this.interest.length > 0) {
              $(document).ready(function () {
                $("#tableInterest").dataTable({
                  language: {
                    url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
                  },
                  order: [[0, 'desc']],
                  pagingType: "full_numbers",
                  pageLength: 5,
                  autoWidth: true,
                  "footerCallback": function (row, data, start, end, display) {
                    var api = this.api();
                    var nb_cols = api.columns().nodes().length;
                    console.log(nb_cols)
                    var j = 2;
                    while (j <= 2) {
                      var pageTotal = api
                        .column(j, { page: 'current' })
                        .data()
                        .reduce(function (a, b) {
                          console.log('hola a---------->', a)
                          console.log('hola b---------->', b)
                          let y = a.toString().split(',');
                          let p = b.toString().split(',');

                          let u = p.join('');
                          let r = y.join('')

                          let o = parseFloat(u) + parseFloat(r)
                          console.log('Result', o)
                          let total = parseFloat(u) + parseFloat(r);
                          return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }, 0);
                      console.log(pageTotal)
                      // Update footer
                      $(api.column(j).footer()).html(pageTotal);
                      j++;
                    }
                  }
                })
              });
            } else {
              //this.contentComponent.changeStatusAlert(true, 'info','Esta cuota de pago no presenta intereses en mora.')
              //this.contentComponent.changeStatusAlert(true, '','')
            }
          }

        }
      },
      error => { console.error(error) }
    )
  }

  getInterestById(idModal, idPayment) {
    this.interestService.getInterestByIdPayment(idPayment).subscribe(
      (interest: any) => {
        if (interest.status == 'OK') {
          if (interest.status == 'OK') {
            this.interest = interest.message;
            this.showTable = true
            if (this.interest.length > 0) {
              $(document).ready(function () {
                $("#tableInterest").dataTable({
                  language: {
                    url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
                  },
                  order: [[0, 'desc']],
                  pagingType: "full_numbers",
                  pageLength: 5,
                  autoWidth: true,
                  "footerCallback": function (row, data, start, end, display) {
                    var api = this.api();
                    var nb_cols = api.columns().nodes().length;
                    console.log(nb_cols)
                    var j = 2;
                    while (j <= 2) {
                      var pageTotal = api
                        .column(j, { page: 'current' })
                        .data()
                        .reduce(function (a, b) {
                          console.log('hola a---------->', a)
                          console.log('hola b---------->', b)
                          let y = a.toString().split(',');
                          let p = b.toString().split(',');

                          let u = p.join('');
                          let r = y.join('')

                          let o = parseFloat(u) + parseFloat(r)
                          console.log('Result', o)
                          let total = parseFloat(u) + parseFloat(r);
                          return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }, 0);
                      console.log(pageTotal)
                      // Update footer
                      $(api.column(j).footer()).html(pageTotal);
                      j++;
                    }
                  }
                })
              });
            } else {
              this.showTable = false
              this.showToaster('3','Intereses Pendientes', 'No se econtraron intereses pendientes para este pago.')
              //this.contentComponent.changeStatusAlert(true, 'info','Esta cuota de pago no presenta intereses en mora.')
              //this.contentComponent.changeStatusAlert(true, '','')
            }
          }

        }
      },
      error => { console.error(error.error.message) }
    )
  }


  deleteInterest() {
    this.interestService.deleteInterest(localStorage.getItem('idPaymentUpdate')).subscribe(
      (interesDelete: any) => {
        if (interesDelete.status === 'OK') {
          this.showToaster('1', 'Eliminación pago', 'Eliminación de pago reaizada con exito');
          $("#tableInterest").dataTable().fnDestroy();
          this.getInterestByIdPayment(null, localStorage.getItem('idPaymentUpdate'))
          this.closeModal('confirm-delete')
        }
      },
      error => {
        console.log(error)
        this.showToaster('2', 'Eliminación interest', 'No se ha podido procesar esta solicitud.');
      }
    )
  }

  resetAmount(value) {
    value.toString().split(',');
    let p = value.toString().split(',');
    return p.join('');
  }

  statusInteres(status) {
    return (status == 'Pendiente' ? '0' : '1')
  }
  showToaster(status, title, message) {
    switch (status) {
      case '1':
        this.toastr.success(message + '.', title);
        break;
      case '2':
        this.toastr.error(message + '.', title);
        break;
        case '3':
          this.toastr.info(message + '.', title);
          break
      default:
        this.toastr.error(message + '.', title);
        break;
    }

  }

  formatDate(date) {
    return moment(date).add('day', 1).format('YYYY-MM-DD')
  }
}

