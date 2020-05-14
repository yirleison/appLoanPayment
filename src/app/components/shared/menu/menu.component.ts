import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OauthService } from 'src/app/services/oauth-services/oauth.user.service';
declare var $;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [],
  providers: [OauthService]
})
export class MenuComponent implements OnInit {
  public user: any
  name: String
  constructor(private _route: Router, private oauthService : OauthService) { 
    this.user = JSON.parse(this.oauthService.getCurrenUser())
  }

  ngOnInit() {
   
   this.name = this.user.fullName.split(' ')[0]
   // console.log('Usuario------>',name)
  }

  redirect(path) {
    this._route.navigate(['home/'+path]);
  }

  prueba() {
    $(document).ready(function(){
      $(".prueba").addClass("treeview");
    })
  }

}
