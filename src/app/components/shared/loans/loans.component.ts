import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as moment from 'moment';
import { loansModel } from '../../../models/loans.model'
import { from } from 'rxjs';
import { LoanService } from '../../../services/loan-services/loan.services';
declare var $;


@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.css'],
  providers: [LoanService]
})
export class LoansComponent implements OnInit {
 
  @ViewChild('dataTable', { static: true }) table;
  dataTable: any;
  dtOptions: any;
  public loan: loansModel;
  constructor(private loanService: LoanService) {
    this.loan = new loansModel('', 0, 0, false, null, '')
  }

  ngOnInit(): void {
    $(function () {
      $("#datetimepicker1").datepicker({
        autoclose: true,
        todayHighlight: true
      }).datepicker('update', new Date());
    });

    $(function () {
      $("#datetimepicker2").datepicker({
        autoclose: true,
        todayHighlight: true
      }).datepicker('update', new Date());
    });

    this.chargerTable();
    this.showMOdal();
  }

  chargerTable() {
    this.dataTable = $(this.table.nativeElement);
    this.dataTable.dataTable(this.getdataLoans());
  }

  getdataLoans() {

    return this.dtOptions = {
      "ajax": {
        url: ' http://localhost:3000/prestamos',
        type: 'GET'
      },
      columns: [
        {
          title: 'Fecha Prestamo',
          data: 'dateLoan'
        },
        {
          title: 'Valor',
          data: 'amount'
        },
        {
          title: 'Tasa Interes',
          data: 'rateInterest'
        },
        {
          title: 'Estado',
          data: 'statusLoan'
        },
        {
          title: 'Fecha Cancelacion',
          data: 'finishedDatePayment'
        },
        {
          //adds td row for button
          data: null,
          render:
            //return '<button type="button" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#exampleModal" (click)="showModal()" >Edit</button>';
            function (data, type, row) {
              return `<a type="button" class="btn btn-sm btn-primary" data-target="#exampleModal"> <span class="glyphicon glyphicon-edit"></span></a> <a type="button" class="btn btn-sm btn-danger"><span class="span glyphicon glyphicon-trash"></span></a>`
            }
        }
      ]
    }
  }

  showModalLoan() {
    $(document).ready(function () {
      $('.js-example-responsive').select2({
        ajax: {
          url: 'http://localhost:3000/usuarios',
          processResults: function (data) {
            // Transforms the top-level key of the response object from 'items' to 'results'
            let dat = []
            var p;
            data.message.forEach(element => {
              p = {
                id: element._id,
                text: element.name + ' ' + element.fullName,
              }
              dat.push(p);
            });
            return {
              results: dat
            };
          }
        }
      });
      $("#createLan").modal('show')
    });

  }

  createLoan() {
    // console.log($('#loan-date').val());
    //var valor = $("#select-user-create option:selecte").val();
    let dateLoan = moment($('#loan-date').val()).format('YYYY-MM-DD');
    let amount = $('#valor-prestamo').val();
    let rateInterest = $('#interes').val();
    let statusLoan = $("#select-estado option:selected").val();
    let finishedDatePayment = null;
    let idUser = $("#select-user-create option:selected").val();

    var dat = {
      dateLoan,
      amount,
      rateInterest,
      statusLoan,
      finishedDatePayment,
      idUser
    }

    this.loanService.createLoan(this.loan).subscribe(data => {
      console.log('Mostrando datos',data)
    })
    console.log(this.loan = dat)
    //console.log(dat)
  }

  showMOdal() {
    $(document).ready(function () {
      var table = $('#p').DataTable();
      $('#p tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        console.log(data);
        $("#exampleModal").modal('show')
      });
    });
  }

  listUsersToSelect() {
    $('#user-select2').select2({
      ajax: {
        url: 'http://localhost:3000/usuarios',
        processResults: function (data) {
          // Transforms the top-level key of the response object from 'items' to 'results'
          return {
            results: data.message
          };
        }
      }
    });
  }
}


