import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OauthService } from './services/oauth-services/oauth.user.service'

@Injectable({
  providedIn: 'root',
})
export class SessionGuard implements CanActivate {
  constructor(public _authServices : OauthService,  private _route: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this._authServices.isLoggin()){
      return true
    }else{
      localStorage.clear()
      this._route.navigate(['login'])
      return true;
    }
  }
  
}
