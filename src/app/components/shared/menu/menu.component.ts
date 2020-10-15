import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OauthService } from 'src/app/services/oauth-services/oauth.user.service';
import { Endpoints } from '../../config/endpoints'
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
  public urlBase: String;
  public urlPhoto: String
  public avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQzr9MZuVHIBRWTXhdzLQAx_-Y0e5Wg6-MmJv4uLE1AyHnhdA5V&usqp=CAU'

  constructor(private _route: Router, private oauthService : OauthService) {
    this.user = JSON.parse(this.oauthService.getCurrenUser())
    this.urlBase = Endpoints.url
  }

  ngOnInit() {

   this.name = this.user.fullName.split(' ')[0]
   console.log('show data user -------->',this.user.potho)

   this.urlPhoto = ( this.user.potho == '' || this.user.potho == null ? this.avatar : this.urlBase + this.user.potho)
   // console.log('Usuario------>',name)
  //  $(document).ready(() => {
  //   const trees: any = $('[data-widget="tree"]');
  //   trees.tree();
  // });
  }



  redirect(path) {
    console.log('redirect------>',path)
    this._route.navigate(['home/'+path])
  }

  prueba() {
    $(document).ready(function(){
      $(".prueba").addClass("treeview");
    })
  }

}
