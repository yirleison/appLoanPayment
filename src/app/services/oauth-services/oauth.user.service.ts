import { Injectable } from '@angular/core'; //  Inyectar los servicios
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Endpoints } from '../../../app/components/config/endpoints'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { map, catchError } from 'rxjs/operators';


@Injectable()

export class OauthService {

    public token: string
    public user: any
    constructor(private router: Router, private httpClient: HttpClient) {
        this.token = localStorage.getItem('token')
        this.user = JSON.parse(localStorage.getItem('user'))
    }

    oautLogin(payload) {
        const headers = new HttpHeaders({
            "Content-Type": "application/json; charset=utf-8"
        });
        return this.httpClient.post("http://localhost:3000/login", payload, { headers: headers }).pipe(
            map((response: any) => {
                this.token = response.token
                this.user = response.user
                this.setSession(this.token, this.user)
                return true
            }),
            catchError((err => {
                return err
            }))
        );
    }

    getCurrenUser() {
        let user = localStorage.getItem('currenUser');
        return (user == null || typeof (user) == 'undefined' ? null : user)
    }

    logoutUser() {
        localStorage.removeItem('accesToken')
        localStorage.removeItem('currenUser');
    }

    setSession(token: string, user: any) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
    }

    isLoggin() {
        if (this.token && this.user) return true
        else return false
    }
}

