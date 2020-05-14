import { Component, OnInit } from '@angular/core';
import { OauthService } from 'src/app/services/oauth-services/oauth.user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
  providers: [OauthService]
})
export class HeaderComponent implements OnInit {
  public user: any
  name: String
  constructor(private oauthService : OauthService) {
    this.user = JSON.parse(this.oauthService.getCurrenUser())
   }

  ngOnInit() {
    this.name = this.user.fullName.split(' ')[0]
  }

}
