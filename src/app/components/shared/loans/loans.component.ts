import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import { loansModel } from '../../../models/loans.model'
import { from, ReplaySubject } from 'rxjs';
import { LoanService } from '../../../services/loan-services/loan.services';
import { ToastrService, Toast } from 'ngx-toastr';

declare var $;
var table = null;


@Component({
  selector: "app-loans",
  templateUrl: "./loans.component.html",
  styleUrls: ["./loans.css"],
  providers: [LoanService]
})
export class LoansComponent implements OnInit {
  dataTable: any;
  dtOptions: any;
  idLoan: String = "";
  loans: any;

  public loan: loansModel;
  constructor(
    private loanService: LoanService,
    private toastr: ToastrService,
    private _route: Router
  ) {
    this.loan = new loansModel("", 0, 0, false, null, "");
  }

  ngOnInit(): void {
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

    $(document).ready(function () {
      $('#datatable').dataTable();

      $("[data-toggle=tooltip]").tooltip();

    });

    this.showModalEdit();
    this.showModalDelete();
    this.getLoans();
  }



  getLoans() {
    this.loanService.listLoan().subscribe(
      (loans: any) => {
        if (loans) {
          this.loans = loans.data;
          console.log(this.loans);
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
    let dateLoan = moment($("#loan-date").val()).format("YYYY-MM-DD");
    let amount = $("#valor-prestamo").val();
    let rateInterest = $("#interes").val();
    let statusLoan = $("#select-estado option:selected").val();
    let finishedDatePayment = null;
    let idUser = $("#select-user-create option:selected").val();

    let interes = {
      1: 7,
      2: 8,
      3: 9,
      4: 10
    };

    var dat = {
      dateLoan,
      amount,
      rateInterest: interes[$("#interes option:selected").val()],
      statusLoan,
      finishedDatePayment,
      idUser
    };

    this.loan = dat;

    console.log(this.loan);
    this.loanService.createLoan(this.loan).subscribe(
      response => {
        if (!response) {
          //Muestro el error
        } else {
          //Muestro alert de confirmacion
          console.log(response);
          this.toastr.success("Prestamo!", "Prestamo creado con éxito");
          //$('#table-loans').dataTable().fnClearTable();
          $(function () {
            var table1 = $("#table-loans").DataTable();
            table1.ajax.reload(function (json) {
              $("#able-loans").val(json.lastInput);
            });
            let dateLoan = moment($("#loan-date").val()).format("YYYY-MM-DD");
            $("#valor-prestamo").val("");
            $("#interes").val("");
            $("#select-estado").val("");
            $("#select-user-create option:selected").val("");
            $("#createLan").modal("hide");
          });
        }
      },
      error => {
        let body = JSON.parse(error._body);
      }
    );
  }

  showModalEdit() {
    let listUsersToSelect = id_modal => {
      console.log("entroooo", id_modal);
      $(document).ready(function () {
        $(id_modal).select2({
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
      });
    };

    $(document).ready(function () {
      var table = $("#table-loans").DataTable();
      $("#table-loans tbody").on("click", "a.edit", function () {
        var datos = table.row($(this).parents("tr")).data();
        console.log("Edit", datos);
        //Petición ajax
        listUsersToSelect("#select-user-edit");
        $("#loan-edit").modal("show");
      });
    });
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


