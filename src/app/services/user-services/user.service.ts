
import { Injectable } from '@angular/core'; //  Inyectar los servicios
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Endpoints } from '../../../app/components/config/endpoints'


@Injectable()
export class UserService {
  public urlBase: String;

  constructor(private httpClient: HttpClient) {
    // this.urlBase = process.env.URLBACK || Endpoints.url
    this.urlBase = Endpoints.url
   }

  createUser(payload) {
    let headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });

    return this.httpClient.post(
      this.urlBase+"registrar-usuario",
      payload,
      { headers: headers }
    );
  }

  listUsers() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpClient.get(this.urlBase+"usuarios", httpOptions);
  }

  listUsersById(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpClient.get(this.urlBase+"usuario/" + id, httpOptions);
  }

  updateUsersById(id, payload) {
    let headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });

    return this.httpClient.put(this.urlBase+"usuario/" + id, payload, { headers: headers });
  }

  changeStatusUsersById(id, payload) {
    let headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });

    return this.httpClient.put(this.urlBase+"actualizar-usuario/" + id, payload, { headers: headers });
  }
}
