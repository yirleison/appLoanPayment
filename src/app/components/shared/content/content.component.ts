import { Component, OnInit } from '@angular/core';
//import { AlertsService } from 'angular-alert-module';
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styles: []
})

export class ContentComponent implements OnInit {

  public interes: any
  constructor() {

  }



  ngOnInit() {
    //this.alerts.setMessage('All the fields are required','error');
    this.changeStatusAlert(false, '', '')
  }
  changeStatusAlert(status, type, message) {
    if (status!= 'undefined') {
      this.interes = {
        status,
        type,
        message
      }
    }
    //console.log(this.interes)
  }

  closeAlet() {
    this.interes = {
      status: false,
      type: '',
      message: ''
    }
  }
}


