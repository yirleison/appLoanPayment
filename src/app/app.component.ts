import { Component } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'appLoans';

  constructor(private spinnerService: NgxSpinnerService){}

  ngOnInit(): void {
    this.spinner()
  }

  spinner():void{
    this.spinnerService.show()
    setTimeout(()=>{
      this.spinnerService.hide()
    },2000)
  }
}
