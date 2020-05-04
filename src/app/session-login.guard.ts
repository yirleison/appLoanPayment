import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OauthService } from './services/oauth-services/oauth.user.service'


@Injectable({
  providedIn: 'root'
})
export class SessionLoginGuard implements CanActivate {
  
  constructor(public _authServices : OauthService, private _route: Router){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this._authServices.isLoggin()){
        console.log('deberia de entrar al home')
        this._route.navigate(['home'])
        return true
      }else{
        return true;
      }
  }
  
}
