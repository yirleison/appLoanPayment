import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user-services/user.service'
import { PaymenService } from 'src/app/services/payment-services/payment.services';
import { NgOption } from '@ng-select/ng-select';
import { PaymentModel } from '../../../../models/payment/payment.full.model'
import { NgxSpinnerService } from "ngx-spinner";

declare var $;

@Component({
  selector: 'app-schedule-payment',
  templateUrl: './schedule-payment.component.html',
  styleUrls: ['./schedule-payment.component.css'],
  providers: [UserService, PaymenService]
})
export class SchedulePaymentComponent implements OnInit {

  public idUser = '';
  public users: any;
  public showFormFront: boolean = false
  public message: String = ''
  clients: NgOption[]
  selectedCountries = [];
  selectedCountryId: number;
  public payments: any;
  dtOptions: DataTables.Settings = {};
  public spinnerr: boolean =  false

  constructor(
    private userService: UserService,
    private paymentService: PaymenService,
    private spinnerService: NgxSpinnerService
  ) {this.payments = []}

  ngOnInit(): void {
    this.spinner()
    this.headerTable()
    this.getUsers()
    $(document).ready(function () {
      $('#select-users').select2()
    });

    $('#select-users').on('select2:select', function (e) {
      var data = e.params.data;
      console.log(data.text);
    });

  }

  getUsers() {
    //validar si el usuario tiene cuotas de pago pendientes.
    this.userService.listUsers().subscribe(
      (user: any) => {
        let us = user.message.map(x => {
          return { id: x._id, name: x.fullName }
        })
        this.clients = us
      },
      error => {
        console.log(error)
      }
    )
  }
  public id = ''

  onChange = ($event: any): void => {
    this.id = ($event == undefined ? '' : $event.id)
    if (this.id == '') {
      this.payments = []
      this.message = ''
      this.spinnerr = false
    }
    else {
      this.payments = []
      this.getPaymentsByIdUser(this.id)
    }
  }

  onAdd = ($event: any): void => {
    this.selectedCountries.push($event);
    console.log('AFTER ADD OPERATION:');
    console.log(this.selectedCountries.length);
    console.log(this.selectedCountries[0].id);
  }

  onRemove = ($event: any): void => {
    console.log($event);
    this.selectedCountries = this.selectedCountries.filter(country => country.id !== $event.value.id);
    console.log('AFTER DELETE OPERATION:');
    console.log(this.selectedCountries);
    this.showFormFront = false
  }

  getPaymentsByIdUser(id) {
    this.spinnerr = true
      this.paymentService.getPaymentByIdUser(id).subscribe(
        (payments: any) => {
          console.log('pagos usuario',payments.message[0])
          if (payments.status != 'false' && payments.message.length > 0) {
            this.spinnerr = false
            this.message = ''
            console.log(payments.message);

            this.payments = payments.message.filter(this.filttrarData)
          }
          else {
            setTimeout(()=>{
              this.spinnerr = false
              this.message = 'No se encontraron pagos para esta consulta.'
            },1000)
            console.log(this.message)
            this.payments = []
          }
        },
        (error: any) => {
          console.log('------------------> entro en el catch del error', error)
        }
      )
  }

   filttrarData(element, index, array) {
    return (element.statusDeposit === false);
 }


  statusPaymenDate(status) {
    return status == false || status == null || status == 'null' ? 'Pendiente' : 'Pagado'
  }
  headerTable() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 8,
      autoWidth: true,
      order: [[0, 'asc']],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
      }
    }
  }

  closeAlet() {
    this.message = ''
    console.log('Message --------------> ', this.message);
  }

  spinner():void{
    this.spinnerService.show()
    setTimeout(()=>{
      this.spinnerService.hide()
    },2000)
  }

}
