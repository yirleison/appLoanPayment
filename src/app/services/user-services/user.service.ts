
import { Injectable } from '@angular/core'; //  Inyectar los servicios
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Endpoints } from '../../../app/components/config/endpoints'


@Injectable()
export class UserService {
  public urlBase: String;

  constructor(private httpClient: HttpClient) {
    this.urlBase = Endpoints.url;
   }

  createUser(payload) {
    let headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });

    return this.httpClient.post(
      "http://localhost:3000/registrar-usuario",
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

    return this.httpClient.get(" http://localhost:3000/usuario/" + id, httpOptions);
  }

  updateUsersById(id, payload) {
    let headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });

    return this.httpClient.put("http://localhost:3000/usuario/" + id, payload, { headers: headers });
  }

  changeStatusUsersById(id, payload) {
    let headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });

    return this.httpClient.put("http://localhost:3000/actualizar-usuario/" + id, payload, { headers: headers });
  }
}