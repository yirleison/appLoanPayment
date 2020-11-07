import { Injectable } from '@angular/core'; //  Inyectar los servicios
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Endpoints } from '../../components/config/endpoints'

@Injectable()

export class ExpensesIncomesService {
    public urlBase: String;
    constructor(private httpClient: HttpClient) {
        // this.urlBase = process.env.URLBACK || Endpoints.url;
        this.urlBase = Endpoints.url
    }
    createExpenseIncome(payload) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
        })
      };
      return this.httpClient.post(this.urlBase +'registrar-ingresos-salidas',payload,httpOptions);
    }

    getExpenseIncome() {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
        })
      };
      return this.httpClient.get(this.urlBase +'listar-entradas-salidas',httpOptions);
    }

    listExpensesIncomesById(id) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
        })
      };
      return this.httpClient.get(`${this.urlBase}listar-entradas-salidas/${id}`,httpOptions);
    }

    updateExpensesIncomesById(payload,id) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
        })
      };
      return this.httpClient.put(`${this.urlBase}listar-entradas-salidas/${id}`,payload,httpOptions);
    }

    geBalanceCapitalInterest() {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
        })
      };
      return this.httpClient.get(`${this.urlBase}reporte-capital-interes`,httpOptions);
    }
  }

