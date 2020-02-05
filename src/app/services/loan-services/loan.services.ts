
import { Injectable } from '@angular/core'; //  Inyectar los servicios
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()

export class LoanService {

    constructor(private httpClient: HttpClient){

    }

    createLoan (payload) {
        const headers = new HttpHeaders({
            'Content-Type' :'application/json; charset=utf-8'
        });

        return this.httpClient.post('http://localhost:3000/registrar-prestamo',payload,{headers: headers});
    }
}