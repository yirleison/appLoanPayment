import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user-services/user.service'
import { Observable } from 'rxjs/Observable';
import { NgOption } from '@ng-select/ng-select';
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
  clients: NgOption[]
  selectedCountries = [];
  selectedCountryId: number;

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
        let us = user.message.map(x => {
          return { id: x._id, name: x.fullName }
        })
        this.clients = us
      },
      error => {
        console.log(error)
      }
    )
  }

  onChange = ($event: any): void => {

    try {
      if ($event != undefined) {
        this.showFormFront = true
      }
      else{
        this.showFormFront = false
      }
    } catch (error) {
      console.log('Error ---------> ',error)
    }
  }

  onAdd = ($event: any): void => {
    this.selectedCountries.push($event);
    console.log('AFTER ADD OPERATION:');
    console.log(this.selectedCountries.length);
    console.log(this.selectedCountries[0].id);
  }

  onRemove = ($event: any): void => {
    console.log($event);
    this.selectedCountries = this.selectedCountries.filter(country => country.id !== $event.value.id);
    console.log('AFTER DELETE OPERATION:');
    console.log(this.selectedCountries);
    this.showFormFront = false
  }




}
