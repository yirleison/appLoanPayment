import { Injectable } from '@angular/core'; //  Inyectar los servicios
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Endpoints } from '../../../app/components/config/endpoints'
import  { environment } from '../../../environments/environment.prod'
import { environment_prod } from 'src/environments/environment';


@Injectable()

export class InterestService {
    public urlBase: String;
    constructor(private httpClient: HttpClient) {
        // this.urlBase = process.env.URLBACK || Endpoints.url;
        this.urlBase = Endpoints.url
    }

    listInterestByIdPayment(id) {
        const headers = new HttpHeaders({
          "Content-Type": "application/json; charset=utf-8"
        });

        return this.httpClient.get( this.urlBase + 'interest-por-pago/' + id, {
          headers: headers
        });
      }

      listInterestById(id) {
        const headers = new HttpHeaders({
          "Content-Type": "application/json; charset=utf-8"
        });

        return this.httpClient.get( this.urlBase + 'interest/' + id, {
          headers: headers
        });
      }

      listInterest() {
        const headers = new HttpHeaders({
          "Content-Type": "application/json; charset=utf-8"
        });

        return this.httpClient.get( this.urlBase + 'interest', {
          headers: headers
        });
      }

      updateInterest(id, payload) {
        console.log()
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
          })
        };
        return this.httpClient.put(this.urlBase +'interest/'+id,payload,httpOptions);
      }

      deleteInterest(id) {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json'
          })
        }
        return this.httpClient.delete(this.urlBase +'interest/'+id,httpOptions)
      }
}
