import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: []
})
export class MenuComponent implements OnInit {

  constructor(private _route: Router) { }

  ngOnInit() {
  }

  redirect(path) {
    this._route.navigate(['home/'+path]);
  }

}
