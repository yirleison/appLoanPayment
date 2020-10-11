import { Injectable } from '@angular/core'; //  Inyectar los servicios
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Endpoints } from '../../../app/components/config/endpoints'

@Injectable()

export class PaymenService {

  public urlBase: String;

  constructor(private httpClient: HttpClient) {
    // this.urlBase = process.env.URLBACK || Endpoints.url
    this.urlBase = Endpoints.url
  }

  createPayment(payload) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(this.urlBase + 'registrar-pago', payload, httpOptions);
  }

  updatePaymentNormal(payload, typepayment, id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'typepayment': typepayment
      })
    };
    return this.httpClient.put(this.urlBase + 'pago/' + id, payload, httpOptions);
  }

  listPaymentByLoan(id) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });

    return this.httpClient.get(this.urlBase + 'pago-prestamo/' + id, {
      headers: headers
    });
  }

  listPaymentBId(id) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });

    return this.httpClient.get(this.urlBase + 'pago/' + id, {
      headers: headers
    });
  }

  consultPaymentDate(id) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });

    return this.httpClient.get(this.urlBase + 'pago-fecha/' + id, {
      headers: headers
    });
  }

  updatePayment(payload, id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'typepayment': '0'
      })
    };
    return this.httpClient.put(this.urlBase + 'actualizar-pago/' + id, payload, httpOptions);
  }

  deletePayment(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.httpClient.delete(this.urlBase + 'pago/' + id, httpOptions)
  }

  getPaymentByIdUser(id) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });

    return this.httpClient.get(`${this.urlBase}pagos-cliente/${id}`, {
      headers: headers
    });
  }



}
