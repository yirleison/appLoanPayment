import { Injectable } from '@angular/core'; //  Inyectar los servicios
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Endpoints } from '../../../app/components/config/endpoints'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';



@Injectable()

export class OauthService {

  public token: string
  public user: any
  public urlBase: string
  constructor(private router: Router, private httpClient: HttpClient) {
    // this.urlBase = process.env.URLBACK || Endpoints.url
    this.urlBase = Endpoints.url
    this.token = localStorage.getItem('token')
    this.user = JSON.parse(localStorage.getItem('user'))
  }

  oautLogin(payload) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });
    return this.httpClient.post(this.urlBase+"login", payload, { headers: headers }).pipe(
      map((response: any) => {
        this.token = response.token
        this.user = response.user
        this.setSession(this.token, this.user)
        this.router.navigate(['home'])
        return true
      }),
      catchError(error => {
        //console.log('Error-oautLogin--------->', error.error);
        return throwError(error);
      }))
  }

  getCurrenUser() {
    let user = localStorage.getItem('user');
    return (user == null || typeof (user) == 'undefined' ? null : user)
  }

  getCurrenToken() {
    let token = localStorage.getItem('token');
    return (token == null || typeof (token) == 'undefined' ? null : token)
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
    //console.log('isLoggin',this.getCurrenUser(),this.getCurrenToken())
    if (this.getCurrenUser() && this.getCurrenToken()) {
      console.log('isLoggin', this.getCurrenUser(), this.getCurrenToken())
      return true
    }
    else {
      return false
    }


  }
}

