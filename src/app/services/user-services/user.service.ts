
import { Injectable } from '@angular/core'; //  Inyectar los servicios
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UserService {
  constructor(private httpClient: HttpClient) { }

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
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this.httpClient.get(" http://localhost:3000/usuarios", { headers: headers });
  }

  listUsersById(id) {
    let headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });

    return this.httpClient.get(" http://localhost:3000/usuario/" + id, { headers: headers });
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