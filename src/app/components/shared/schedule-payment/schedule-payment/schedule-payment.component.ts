import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user-services/user.service'
import { Observable } from 'rxjs/Observable';
declare var $;

@Component({
  selector: 'app-schedule-payment',
  templateUrl: './schedule-payment.component.html',
  styleUrls: ['./schedule-payment.component.css'],
  providers: [UserService]
})
export class SchedulePaymentComponent implements OnInit {

  public idUser = '';
  public users: any;
  public showFormFront: boolean = false


  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {

    this.getUsers()
    $(document).ready(function () {
      $('#select-users').select2()
    });

    $('#select-users').on('select2:select', function (e) {
      var data = e.params.data;
      console.log(data.text);
    });

  }

  getUsers() {
    this.userService.listUsers().subscribe(
      (user: any) => {
        this.users = user.message;
        //console.log('Gestion Usuarios --------->',this.users)
      },
      error => {
        console.log(error)
      }
    )
  }

  showForm() {
    this.showFormFront = true
    console.log(this.showFormFront)
  }




}
