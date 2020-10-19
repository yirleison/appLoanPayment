import { Component, OnInit } from '@angular/core';
declare var $
@Component({
  selector: 'app-expenses-icomes',
  templateUrl: './expenses-icomes.component.html',
  styleUrls: ['./expenses-icomes.component.css']
})
export class ExpensesIcomesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    $(document).ready(function () {
      $("#datetimepicker-expenses-icomes")
        .datepicker({
          autoclose: true,
          todayHighlight: true
        })
      })

  }

  openModal(id) {
    $("#" + id).modal("show");
  }

  closeModal(id) {
    $("#" + id).modal("hide");
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

    //this.loan.amount = amount_parts.join('.');

    console.log(amount_parts.join('.'))

    //console.log(priceValue)
  }

}
