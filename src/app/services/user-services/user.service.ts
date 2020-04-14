
import { Injectable } from '@angular/core'; //  Inyectar los servicios
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UserService {
  constructor(private httpClient: HttpClient) {}

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

  listUsers() {
    const headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });

    return this.httpClient.get(" http://localhost:3000/usuarios", { headers: headers  });
  }
}