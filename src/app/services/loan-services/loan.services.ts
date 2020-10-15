
import { Injectable } from '@angular/core'; //  Inyectar los servicios
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { Endpoints } from '../../../app/components/config/endpoints'


@Injectable()
export class LoanService {
  public urlBase: String;
  constructor(private httpClient: HttpClient) {
    // this.urlBase = process.env.URLBACK || Endpoints.url
      this.urlBase = Endpoints.url
  }

  createLoan(payload) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });

    return this.httpClient.post(
      `${this.urlBase}registrar-prestamo`,
      payload,
      { headers: headers }
    );
  }

  listLoansByIdUser(id) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpClient.get(this.urlBase + "prestamo-usuario/" + id, httpOptions);
  }

  listLoansByI(id) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpClient.get(this.urlBase + "prestamo/" + id, httpOptions);
  }

  listLoans() {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpClient.get(this.urlBase + "prestamos/", httpOptions);
  }

}
