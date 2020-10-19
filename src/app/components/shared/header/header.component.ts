import { Component, OnInit } from '@angular/core';
import { OauthService } from 'src/app/services/oauth-services/oauth.user.service';
import { Endpoints } from '../../config/endpoints'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
  providers: [OauthService]
})
export class HeaderComponent implements OnInit {
  public user: any
  name: String
  public urlBase: String;
  public urlPhoto: String
  public avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQzr9MZuVHIBRWTXhdzLQAx_-Y0e5Wg6-MmJv4uLE1AyHnhdA5V&usqp=CAU'

  constructor(private oauthService : OauthService) {
    this.user = JSON.parse(this.oauthService.getCurrenUser())
    this.urlBase = Endpoints.url
   }

  ngOnInit() {
    this.name = this.user.fullName.split(' ')[0]
    if(!this.user.photo){
      this.urlPhoto = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQzr9MZuVHIBRWTXhdzLQAx_-Y0e5Wg6-MmJv4uLE1AyHnhdA5V&usqp=CAU'
     }
     else {
      this.urlPhoto = this.urlBase +'imagen/'+ this.user.photo
     }
  }

}
