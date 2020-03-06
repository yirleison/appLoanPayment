import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { loansModel } from '../../../models/loans.model'
import { from, ReplaySubject, Subject, pipe } from 'rxjs';
import { LoanService } from '../../../services/loan-services/loan.services';
import { ToastrService } from 'ngx-toastr';
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
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  verSeleccion: string = '';
  public loan: loansModel;

  constructor(
    private loanService: LoanService,
    private userService: UserService,
    private toastr: ToastrService,
    private _route: Router,
    private http: HttpClient,
  ) {
    this.loan = new loansModel("", 0, 0, false, null, "");
  }

  ngOnInit(): void {

    $(document).ready(function () {
      $('#select2').select2({
        placeholder: 'Select an option',
        ajax: {
          url: 'http://localhost:3000/usuarios',
          processResults: function (data) {
            console.log(data);
            // Transforms the top-level key of the response object from 'items' to 'results'
            return {
              results: data.message.map((item) => {
                return {
                  id: item._id,
                  text: item.fullName
                }
              })
            }
          }
        },
        cache: true
      });
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

  showToaster(){
    this.toastr.success("Hello, I'm the toastr message.")
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
    $("#show-md-crea-loan").modal('hide');
    this.showToaster()
    this.toastr.show("Prestamo!", "Prestamo creado con éxito");
    console.log(this.toastr)
   // let dateLoan = moment($("#loan-date").val()).format("YYYY-MM-DD");
    let amount = $("#valor-prestamo").val();
    let rateInterest = $("#interes").val();
    let statusLoan = $("#select-estado option:selected").val();
    let finishedDatePayment = null;
    let idUser = $("#select2 option:selected").val();

    let interes = {
      1: 7,
      2: 8,
      3: 9,
      4: 10
    };

    var dat = {
      amount,
      rateInterest: interes[$("#interes option:selected").val()],
      statusLoan,
      finishedDatePayment,
      idUser
    };

    this.loan = dat;
   /* this.loanService.createLoan(this.loan).subscribe(
      response => {
        if (!response) {
          //Muestro el error
        } else {
          //Muestro alert de confirmacion
          this.toastr.success("Prestamo!", "Prestamo creado con éxito");
          this.toastr.success('Hello world!', 'Toastr fun!');
         $("#show-md-crea-loan").modal('hide');
          $("#example").dataTable().fnDestroy();
          this.getLoans();
         
          let dateLoan = moment($("#loan-date").val()).format("YYYY-MM-DD");
          $("#valor-prestamo").val("");
          $("#interes").val("");
          $("#select-estado").val("");
          $("#select-user-create option:selected").val("");
        }
      },
      error => {
        let body = JSON.parse(error._body);
      }
    );*/
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


