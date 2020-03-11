import { Injectable } from '@angular/core'; //  Inyectar los servicios
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Endpoints } from '../../../app/components/config/endpoints'

@Injectable()

export class PaymenService {

   public urlBase: String;

    constructor(private httpClient: HttpClient) {
        this.urlBase = Endpoints.url;
    }

createLoan(payload) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });

    return this.httpClient.post(
      "http://localhost:3000/registrar-prestamo",
      payload,
      { headers: headers }
    );
  }

  listPaymentByLoan(id) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });

    return this.httpClient.get( this.urlBase+ 'pago-prestamo/' + id, {
      headers: headers
    });
  }
}