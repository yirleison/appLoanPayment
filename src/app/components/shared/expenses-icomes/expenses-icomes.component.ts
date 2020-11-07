import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService, Toast } from 'ngx-toastr';
import { ExpensesIncomesService } from '../../../services/expenses-incomes-service/expenses.icncomes.service';

declare var $
@Component({
  selector: 'app-expenses-icomes',
  templateUrl: './expenses-icomes.component.html',
  styleUrls: ['./expenses-icomes.component.css'],
  providers: [ExpensesIncomesService]
})
export class ExpensesIcomesComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, { static: true }) dtElement: DataTableDirective;

  public flagPreload: boolean = false
  formExpIcom: FormGroup;
  typeIcome: any = ['Entrada', 'Salida']
  isSubmitted = false;
  public expensesIncomes: any
  public spinner: boolean = false
  public prueba: any
  public balanceCapitalInterest: any

  expresRegular: any = '^-?\\d+(?:,\\d+)?(?:[Ee][-+]?\\d+)?$'
  constructor(public fb: FormBuilder, private expensesIncomesService: ExpensesIncomesService, private toastr: ToastrService) {
    this.formExpIcom = this.fb.group({
      dateIncome: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(this.expresRegular)]],
      note: ['', [Validators.required]],
      type: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getExpensesIncomes()
    $(document).ready(function () {
      $("#datetimepicker-expenses-icomes")
        .datepicker({
          autoclose: true,
          todayHighlight: true
        })
    })
    this.geBalanceCapitalInterest()
  }

  CreateOrUpdate() {
    this.isSubmitted = true
    if (!this.formExpIcom.valid) {
      return false;
    } else {
      if (localStorage.getItem('createRegistry') == 'yes') {
        this.flagPreload = true
        let payload = {
          dateIncome: this.formExpIcom.value.dateIncome,
          income: (this.formExpIcom.value.type == 0 ? parseFloat(this.resetAmount(this.formExpIcom.value.amount)) : 0),
          expenses: (this.formExpIcom.value.type == 1 ? parseFloat(this.resetAmount(this.formExpIcom.value.amount)) : 0),
          note: this.formExpIcom.value.note,
          type: this.formExpIcom.value.type,
          id: ''
        }
        this.expensesIncomesService.createExpenseIncome(payload).subscribe(
          (response: any) => {
            if (response.status == 'OK') {
              if (response.message.type == 0) {
                this.flagPreload = false
                localStorage.removeItem('createRegistry')
                this.closeModal('md-create-or-update-expenses-icomes')
                this.showToaster('1', 'Ingreso Dinero', 'Registro creado exitosamente');
                this.formExpIcom.reset()
                this.getExpensesIncomes()
                this.geBalanceCapitalInterest()
              } else {
                this.flagPreload = false
                this.closeModal('md-create-or-update-expenses-icomes')
                this.showToaster('1', 'Salida Dinero', 'Registro creado exitosamente');
                this.formExpIcom.reset()
                this.getExpensesIncomes()
                this.geBalanceCapitalInterest()
              }
            }
          },
          error => {
            this.flagPreload = false
            this.showToaster('2', 'Registro Dinero', 'Ha ocurrido algo al tratar de procesar esta solicitud.');
            console.error(error)
          }
        )
      }
      else {
        this.flagPreload = true
        let payload = {
          dateIncome: this.formExpIcom.value.dateIncome,
          income: (this.formExpIcom.value.type == 0 ? parseFloat(this.resetAmount(this.formExpIcom.value.amount)) : 0),
          expenses: (this.formExpIcom.value.type == 1 ? parseFloat(this.resetAmount(this.formExpIcom.value.amount)) : 0),
          note: this.formExpIcom.value.note,
          type: this.formExpIcom.value.type,
          id: ''
        }
       // console.log(payload)
         this.expensesIncomesService.updateExpensesIncomesById(payload, localStorage.getItem('idUpdateIncomesExpenses')).subscribe(
          (response: any) => {
            if (response.status == 'OK') {
              if (response.message.type == 0) {
                this.flagPreload = false
                localStorage.removeItem('createRegistry')
                this.closeModal('md-create-or-update-expenses-icomes')
                this.showToaster('1', 'Actualización ingreso Dinero', 'Registro creado exitosamente');
                this.formExpIcom.reset()
                this.getExpensesIncomes()
                this.geBalanceCapitalInterest()
              } else {
                this.flagPreload = false
                this.closeModal('md-create-or-update-expenses-icomes')
                this.showToaster('1', 'Actualización salida Dinero', 'Registro creado exitosamente');
                this.formExpIcom.reset()
                this.getExpensesIncomes()
                this.geBalanceCapitalInterest()
              }
            }
          },
          error => {
            this.flagPreload = false
            this.showToaster('2', 'Registro Dinero', 'Ha ocurrido algo al tratar de procesar esta solicitud.');
            console.error(error)
          }
        )
        console.log('update --------------> ',payload)
      }
    }
  }

  geBalanceCapitalInterest(){
    this.expensesIncomesService.geBalanceCapitalInterest().subscribe(
      (response: any) => {
        if (response.status == 'OK') {
          this.balanceCapitalInterest = response.message
          console.log(this.balanceCapitalInterest)
        }
      },
      error => {
        console.error(error)
      }
    )
  }

  getExpensesIncomesById(id) {
    this.formExpIcom.reset()
    localStorage.setItem('createRegistry', 'no')
    localStorage.setItem('idUpdateIncomesExpenses', id)
    this.expensesIncomesService.listExpensesIncomesById(id).subscribe(
      (response: any) => {
        let amountResponse = 0
        console.log('0',response)
        console.log(response.message.expenses.toString().length)
        if (response.status == 'OK') {
          if (response.message.income |= 0) {
            amountResponse = response.message.income
            console.log('1',amountResponse)
          }
         if (response.message.expenses |= 0){
            amountResponse = response.message.expenses
            console.log('2',amountResponse)
          }
          this.formExpIcom.patchValue({
            dateIncome: moment(response.message.date).format('YYYY-MM-DD'),
            amount: this.formatPrice(amountResponse),
            note: response.message.note,
            type: response.message.type

          })
          this.openModal('md-create-or-update-expenses-icomes', 'false')
        }
      },
      error => {
        console.error(error)
      }
    )
  }

  getExpensesIncomes() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 5,
      autoWidth: true,
      order: [[0, 'asc']],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
      }
    };
    this.expensesIncomesService.getExpenseIncome().subscribe(
      (datos: any) => {
        //this.expensesIncomes = response.message
        if (datos.message.length > 0) {

          let data = datos.message
          this.prueba = data
          // this.expensesIncomes = response.message
          console.log('Response ExpensesIncomes ----------> ', this.prueba)
        }
      },
      error => {

      }
    )
  }

  openModal(id, isCreate) {
    console.log(id + '  ' + isCreate)
    if (isCreate == 'create') {
      localStorage.setItem('createRegistry', 'yes')
      this.formExpIcom.reset()
    }
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
    this.formExpIcom.controls.amount.setValue(amount_parts.join('.'))
  }

  formatPrice(value) {
    let val = (value / 1)
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  get dateIncome() { return this.formExpIcom.get('dateIncome') }
  get amount() { return this.formExpIcom.get('amount') }
  get type() { return this.formExpIcom.get('type') }
  get note() { return this.formExpIcom.get('note') }

  changetypeIcome(e) {
    this.type.setValue(e.target.value, {
      onlySelf: true
    })
  }

  resetAmount(value) {
    value.toString().split(',');
    let p = value.toString().split(',');
    return p.join('');
  }

  showToaster(status, title, message) {
    switch (status) {
      case '1':
        this.toastr.success(message + '.', title);
        break;
      case '2':
        this.toastr.error(message + '.', title);
        break;
      case '3':
        this.toastr.info(message + '.', title);
        break
      default:
        this.toastr.error(message + '.', title);
        break;
    }

  }
}
