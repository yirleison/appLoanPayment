import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare var $;


@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.css']
})
export class LoansComponent implements OnInit {
  @ViewChild('dataTable', { static: true }) table;
  dataTable: any;
  dtOptions: any;

  constructor() { }

  ngOnInit(): void {
    $(function () {
      $("#datetimepicker1").datepicker({ 
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
              return `<a type="button" class="btn btn-sm btn-primary" data-target="#exampleModal"> <span class="glyphicon glyphicon-edit"></span></a> <a type="button" class=class="btn btn-sm btn-danger"><span class="span glyphicon glyphicon-trash"></span></a>`
            }
        }
      ]
    }
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
}


