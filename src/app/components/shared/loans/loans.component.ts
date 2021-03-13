import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, ComponentFactoryResolver } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgOption } from '@ng-select/ng-select';
import * as moment from 'moment';
import { loansModel } from '../../../models/loan/loans.model'
import { from, ReplaySubject, Subject, pipe } from 'rxjs';
import { LoanService } from '../../../services/loan-services/loan.services';
import { DataTableDirective } from 'angular-datatables';
import { UserService } from 'src/app/services/user-services/user.service';
import { NgSelectOption } from '@angular/forms';


declare var $;

@Component({
  selector: "app-loans",
  templateUrl: "./loans.component.html",
  styleUrls: ["./loans.css"],
  providers: [LoanService, UserService]
})
export class LoansComponent implements OnInit {

  dataTable: any;
  idLoan: String = "";
  loans: any;
  _idUser: String
  public rateInterest: String[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, { static: true }) dtElement: DataTableDirective;

  cliente: NgOption[]

  selectedCountries = [];
  selectedCountryId: number;
  public users: any;
  public loan: loansModel;
  intr: Number = 0;
  public nameUser = '';
  public idUser = '';
  public flagPreloadSave: boolean = false;
  public spinner: boolean = false
  public show_table: boolean = false
  public message : String = ''

  constructor(
    private loanService: LoanService,
    private userService: UserService,
    private toastr: ToastrService,
    private _route: Router,
    private _router: ActivatedRoute,
    private http: HttpClient,
  ) {
    this.loan = new loansModel('12/02/2020', '', 0, false, '', "", "");
    this.rateInterest = ['5',' 6','6.5','7', '7.5', '8', '9', '10'];
    this.loans = []
  }

  ngOnInit(): void {

    this.getIdUserByRoute()
    $(document).ready(function () {
      $('#select2').select2();
    });

    $(function () {
      $("#datetimepicker1")
        .datepicker({
          autoclose: true,
          todayHighlight: true
        })
        .datepicker("update", new Date());
    });

    $(function () {
      $("#datetimepicker2")
        .datepicker({
          autoclose: true,
          todayHighlight: true
        })
        .datepicker("update", new Date());
    });

    this.showModalDelete();
  }

  getIdUserByRoute() {
    this._router.params.subscribe(
      (param: Params) => {
        let id = param.id;
        this.idUser = id;
        if (id == undefined) {
          console.log('-------> no valla')
        } else {
          console.log('-------> id user', id)
          localStorage.setItem('idUser', id)
          this.getLoans(id)
          // console.log("ID undefined---->")
        }
      }
    )
  }

  showModal(id) {
    $('#' + id).modal()
    this.getUsers()
  }

  viewLoan(id) {
    this.loanService.listLoansByI(id).subscribe(
      (loan: any) => {
        if (loan && loan.status == 'OK') {
          this.loan = loan.message
          this.loan.amount = this.formatPrice(loan.message.amount)
          this.loan.dateLoan = this.formatDate(loan.message.dateLoan)
          this.showModal('show-md-view-loan')

        }
        else {
          this.showToaster('2','Ha ocurrido un error al tratar de procesar esta solicitus','Préstamos')
        }
      },
      error => {
        this.showToaster('2','Ha ocurrido un error al tratar de procesar esta solicitus','Préstamos')
        console.error(error)
      }
      );
  }

  getLoans(id) {
    this.spinner = true
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      autoWidth: true,
      order: [[0, 'asc']],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
      }
    };
    this.loanService.listLoansByIdUser(id).subscribe(
      (loans: any) => {
        if (loans.data.length != 0) {
          if (loans.data.user) {
            this.nameUser = loans.data.user.fullName
            this.message = ''
          }
          if (loans.data) {
            //this.message = 'No se encontraron prestamos asociados a esete usuario.'
            if(loans.data.user){
              try {
                this.spinner = false
                this.show_table = false
                this.message = `La consulta no trajo datos para este usua ${loans.data.user.fullName}`
              } catch (error) {
              }
            }
            else {
              let [{ idUser }] = loans.data
              this.nameUser = idUser.fullName
              this.spinner = false
              this.show_table = true
              this.loans = loans.data;
              console.log(loans.data)

            }
            //console.log('Loans------------>', idUser);
          }
        }
        else {
          console.log('Loans------------> no trajo data');
          this.spinner = false
          this.show_table = true
        }
      },
      error => {
        console.log('Este es el error -> ', error);
        this.spinner = false
        this.show_table = true
      }
    );
    //this.dtTrigger.next();
  }

  formatterNumber(data) {
    //numero = Number(new Intl.NumberFormat().format(numero));
    //var rounded = data.toFixed(2);
    var str = data.toString();
    var num = str.replace(".", ",");
    return num;
  }

  statusLoan(status) {
    return status == false || status == null || status == 'null' ? 'Pendiente' : 'Pagado'
  }

  modal() {
    this.message = ''
    this.getUsers()
    //$('#show-md-crea-loan').modal('show');
    $('#show-md-crea-loan').modal({
      show: 'tue'
    });
  }

  modalview() {
    this.getUsers()
    //$('#show-md-crea-loan').modal('show');
    $('#show-md-view-loan').modal({
      show: 'tue'
    });
  }

  showModalLoan() {
    $(document).ready(function () {
      $(".js-example-responsive").select2({
        ajax: {
          url: "http://localhost:3000/usuarios",
          processResults: function (data) {
            // Transforms the top-level key of the response object from 'items' to 'results'
            let dat = [];
            var p;
            data.message.forEach(element => {
              p = {
                id: element._id,
                text: element.name + " " + element.fullName
              };
              dat.push(p);
            });
            return {
              results: dat
            };
          }
        }
      });
      $("#createLan").modal("show");
    });
  }

  createLoan() {
    this.loan.finishedDatePayment = null
    let dni = ''
    if (this._idUser == undefined || this._idUser == '') {
      console.log('id user no route')
    } else {
      dni = this._idUser.toString()
    }
    if (localStorage.getItem('idUser') == undefined || localStorage.getItem('idUser') == '') {
      console.log('id user no localstorage')
    } else {
      dni = localStorage.getItem('idUser')
    }
    this.loan.idUser = dni
    let inter = this.loan.amount;
    let p = inter.toString().split(',');
    this.loan.amount = p.join('');
    this.loan.dateLoan = $('#loan-date').val()
    console.log(this.loan)
    this.flagPreloadSave = true;
    this.loanService.createLoan(this.loan).subscribe(
      (response: any) => {
        if (response.status == 'false') {
          this.showToaster('2', 'El monto ingresado supera el capital', 'Prestamo')
          this.flagPreloadSave = false;
          //Muestro el error
        } else {
          //Muestro alert de confirmacion
          console.log('mostramos respnse create loan', response)
          this.showToaster('1', 'Prestamo', 'Prestamo creado con éxito')
          $("#example").dataTable().fnDestroy();
          this.getLoans(dni);
          this.loan = new loansModel('12/02/2020', '', 0, false, '', "", "");
          $("#show-md-crea-loan").modal('hide');
          this.flagPreloadSave = false;
        }
      },
      error => {
        let body = JSON.parse(error._body);
        console.error('Error crendo prestamo -------> ',body)
        this.showToaster('2', 'Ha ocurrido un error no se ha podido procesar la solicitud.', 'Prestamo')
        this.flagPreloadSave = false;
      }
    )
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

    this.loan.amount = amount_parts.join('.');

    console.log(amount_parts.join('.'))

    //console.log(priceValue)
  }

  format(input) {
    let r = input.target.value.replace(/\D/g, "")
      .replace(/([0-9])([0-9]{2})$/, '$1.$2')
      .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
      this.loan.amount = r
  }

  goToPage(id) {
    this._route.navigate(['home/pagos/', id]);
  }

  changeinterest(e) {
    this.intr = e.target.value;
    this.loan.rateInterest = e.target.value;
  }

  editLoan() {
    let dateLoan = moment($("#loan-date-edit").val()).format("YYYY-MM-DD");
    let amount = $("#valor-prestamo-edit").val();
    let rateInterest = $("#interes-edit").val();
    let statusLoan = $("#select-estado-edit option:selected").val();
    let finishedDatePayment = null;
    let idUser = $("#select-user-edit option:selected").val();

  }

  getUsers() {
    this.userService.listUsers().subscribe(
      (user: any) => {
        this.users = user.message;
        console.log(this.users)
        let us = user.message.map(x => {
          return { id: x._id, name: x.fullName }
        })
        this.cliente = us
      },
      error => {
        console.log(error)
      }
    )
  }

  showModalDelete() {
    $(document).ready(function () {
      var table = $("#table-loans").DataTable();
      $("#table-loans tbody").on("click", "a.delete", function () {
        var datos = table.row($(this).parents("tr")).data();
        console.log("Delete", datos);
      });
    });
  }

  showToaster(status, title, message) {
    switch (status) {
      case '1':
        this.toastr.success(title, message);
        break;
      case '2':
        this.toastr.error(title, message);
        break
      default:
        this.toastr.error(title, message);
        break;
    }
  }

  onChange = ($event: any): void => {
    // console.log('SELECTION CHANGED INTO',$event);
    //console.log(`SELECTION CHANGED INTO ${$event.id || ''}`);
    this._idUser = $event.id
    console.log('DNI usuario onChange ------->', this._idUser)
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
  }

  closeAlet() {
    this.message = ''
    console.log('Message --------------> ', this.message);
  }

  formatDate(date) {
   return moment(date).add('day',1).format('YYYY-MM-DD')
  }

  formatPrice(value) {
    let val = (value / 1)
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

}


