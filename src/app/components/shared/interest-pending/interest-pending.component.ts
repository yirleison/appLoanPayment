import { Component, OnInit } from '@angular/core';
import { NgOption } from '@ng-select/ng-select';
import { PaymenService } from 'src/app/services/payment-services/payment.services';
import { UserService } from 'src/app/services/user-services/user.service';

@Component({
  selector: 'app-interest-pending',
  templateUrl: './interest-pending.component.html',
  styleUrls: ['./interest-pending.component.css']
})
export class InterestPendingComponent implements OnInit {

  public idUser = '';
  public users: any;
  public showFormFront: boolean = false
  public message: String = ''
  clients: NgOption[]
  selectedCountries = [];
  selectedCountryId: number;
  public id = ''
  public payments: any;
  dtOptions: DataTables.Settings = {};
  public spinnerr: boolean =  false

  constructor(
    private userService: UserService,
    private paymentService: PaymenService,
  ) { }

  ngOnInit(): void {
  }

  getUsers() {
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
            this.payments = payments.message
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


}
