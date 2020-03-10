import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, ComponentFactoryResolver } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import * as moment from 'moment';
import { loansModel } from '../../../models/loans.model'
import { from, ReplaySubject, Subject, pipe } from 'rxjs';
import { LoanService } from '../../../services/loan-services/loan.services';
import { DataTableDirective } from 'angular-datatables';
import { UserService } from 'src/app/services/user-services/user.service';

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
  public rateInterest: Number[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  public users: any;
  public loan: loansModel;

  constructor(
    private loanService: LoanService,
    private userService: UserService,
    private toastr: ToastrService,
    private _route: Router,
    private http: HttpClient,
  ) {
    this.loan = new loansModel('12/02/2020', 0, 0, false, '', "");
    this.rateInterest = [5,6,7,8,9,10]
  }


  ngOnInit(): void {

    this.getUsers();

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
    this.getLoans();
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

  showModal(id) {
    $('#' + id).modal()
  }

  getLoans() {

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 5,
      autoWidth: true,
      order: [[0, 'desc']],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
      }
    };
    this.loanService.listLoan().subscribe(
      (loans: any) => {
        if (loans) {
          this.loans = loans.data;
          console.log(this.loans);
          this.dtTrigger.next();
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  formatterNumber(data: number) {
    //numero = Number(new Intl.NumberFormat().format(numero));
    //var rounded = data.toFixed(2);
    var str = data.toString();
    var num = str.replace(".", ",");
    return num;
  }

  statusLoan(status) {
    return status == false ? 'Pendiente' : 'Pagado'
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
    // console.log($('#loan-date').val());
    //var valor = $("#select-user-create option:selecte").val();
    // let dateLoan = moment($("#loan-date").val()).format("YYYY-MM-DD");
    let amount = $("#valor-prestamo").val();
    let rateInterest = $("#interes").val();
    let statusLoan = $("#select-estado option:selected").val();
    let finishedDatePayment = null;
    let idUser = $("#select2 option:selected").val();

    let interest = {
      1: 7,
      2: 8,
      3: 9,
      4: 10
    };

    console.log($('#amoutn').val())
    this.loan.rateInterest = interest[this.loan.rateInterest]
    this.loan.finishedDatePayment = null
    this.loan.idUser = $("#select2 option:selected").val()
    console.log(this.loan)
    this.loanService.createLoan(this.loan).subscribe(
      response => {
        if (!response) {
          //Muestro el error
        } else {
          //Muestro alert de confirmacion
          $("#show-md-crea-loan").modal('hide');
          this.showToaster('1', 'Prestamo', 'Prestamo creado con éxito')
          $("#example").dataTable().fnDestroy();
          this.getLoans();

          // let dateLoan = moment($("#loan-date").val()).format("YYYY-MM-DD");
          // $("#valor-prestamo").val("");
          $("#select2").val("");
          //$("#select-estado").val("");
          // $("#select-user-create option:selected").val("");
          this.loan = new loansModel('', 0, 0, false, null, "");
        }
      },
      error => {
        let body = JSON.parse(error._body);
      }
    );
  }


  editLoan() {
    let dateLoan = moment($("#loan-date-edit").val()).format("YYYY-MM-DD");
    let amount = $("#valor-prestamo-edit").val();
    let rateInterest = $("#interes-edit").val();
    let statusLoan = $("#select-estado-edit option:selected").val();
    let finishedDatePayment = null;
    let idUser = $("#select-user-edit option:selected").val();

    let interes = {
      1: 7,
      2: 8,
      3: 9,
      4: 10
    };

    var dat = {
      dateLoan,
      amount,
      rateInterest: interes[$("#interes-edit option:selected").val()],
      statusLoan,
      finishedDatePayment,
      idUser
    };
    this.loan = dat;
    console.log(this.loan);
  }

  getUsers() {
      this.userService.listUsers().subscribe(
        (user: any) => {
          this.users = user.message;
          console.log(this.users)
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
}


