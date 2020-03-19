import { Injectable } from '@angular/core'; //  Inyectar los servicios
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Endpoints } from '../../../app/components/config/endpoints'

@Injectable()

export class PaymenService {

   public urlBase: String;

    constructor(private httpClient: HttpClient) {
        this.urlBase = Endpoints.url;
    }

createPayment(payload, typepayment, id) {
  console.log(payload)
  console.log(typepayment)
  console.log(id)
   
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'typepayment': typepayment
      })
    };
    return this.httpClient.post(this.urlBase +'pago/'+id,payload,httpOptions);
  }

  listPaymentByLoan(id) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });

    return this.httpClient.get( this.urlBase+ 'pago-prestamo/' + id, {
      headers: headers
    });
  }

  listPaymentBId(id) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });

    return this.httpClient.get( this.urlBase+ 'pago/' + id, {
      headers: headers
    });
  }

  updatePayment(payload, id) {
    console.log(payload)
    console.log(id)
     
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
        })
      };
      return this.httpClient.put(this.urlBase +'pago/'+id,payload,httpOptions);
    }
}