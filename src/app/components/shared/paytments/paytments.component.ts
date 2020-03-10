import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import { ToastrService, Toast } from 'ngx-toastr';

declare var $;
var table = null;

@Component({
  selector: 'app-paytments',
  templateUrl: './paytments.component.html',
  styleUrls: ['./paytments.component.css']
})
export class PaytmentsComponent implements OnInit {

  activateTablet: boolean = false;

  constructor(private _router: ActivatedRoute) {

  }

  ngOnInit() {
    this.paramsByRoute()
  }

  paramsByRoute() {
    this._router.params.subscribe(
      (params: Params) => {
        console.log(params.idPayment)
      }
    );
  }
}
