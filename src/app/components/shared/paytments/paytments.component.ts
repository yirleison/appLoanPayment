import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ToastrService, Toast } from 'ngx-toastr';

declare var $;
var table = null;

@Component({
  selector: 'app-paytments',
  templateUrl: './paytments.component.html',
  styleUrls: ['./paytments.component.css']
})
export class PaytmentsComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {
  }

  table = $(document).ready(function () {

    $('#table-payment').DataTable({
      "processing": true,
      "ajax": {
        url: 'http://localhost:3000/pagos',
        type: 'GET'
      },
      "language": {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ registros",
        "sZeroRecords": "No se encontraron resultados",
        "sEmptyTable": "Ningún dato disponible en esta tabla",
        "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix": "",
        "sSearch": "Buscar:",
        "sUrl": "",
        "sInfoThousands": ",",
        "sLoadingRecords": "Cargando...",
        "decimal": ",",
        "thousands": ".",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast": "Último",
          "sNext": "Siguiente",
          "sPrevious": "Anterior"
        },
        "oAria": {
          "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
          "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
      },
      columns: [
        {
          title: 'Fecha Pago',
          data: 'dateDeposit', render: function (data) {
            if (data) {
              return data = moment(data).format('YYYY-MM-DD')
            }
            else {
              return moment().format('YYYY-MM-DD')
            }
          }
        },
        {
          title: 'Valor',
          data: 'amount', render: $.fn.dataTable.render.number(',', '.', 2)
        },
        {
          title: 'Interes',
          data: 'interest', render: $.fn.dataTable.render.number(',', '.', 2)
        },
        {
          title: 'Balance',
          data: 'balanceLoand', render: $.fn.dataTable.render.number(',', '.', 2)
        },
        {
          title: 'Fecha Prox Pago',
          data: 'nextDatePayment', render: function (data) {
            if (data == null || data == 'null' || data == '') {
              data = 'Pendiente'
            }
            else {
              return moment(data).format('YYYY-MM-DD')
            }
            return moment(data).format('YYYY-MM-DD')
          }
        },
        {
          title: 'Estado',
          data: 'statusDeposit', render: function (data) {
            if (data == false) {
              data = 'Pendiente'
            }
            if (data == true) {
              data = 'Pagado'
            }
            return data;
          }
        },
        {
          //adds td row for button
          data: null,
          render:
            //return '<button type="button" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#exampleModal" (click)="showModal()" >Edit</button>';
            (data, type, row) => {
              return `<a type="button"  class="btn btn-sm btn-primary edit" data-target="#exampleModal"> <span class="glyphicon glyphicon-edit"></span></a> <a type="button" class="btn btn-sm btn-danger delete"><span class="span glyphicon glyphicon-trash"></span></a>`
            }
        },

      ]
    });
  });

}
