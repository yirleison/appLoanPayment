import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Session } from '../../../models/session/session.model';
import { User } from 'src/app/models/user/user.model';
import { OauthService } from 'src/app/services/oauth-services/oauth.user.service';
@Component({
    selector: 'login',
    styleUrls: ['./login.componen.css'],
    templateUrl: './login.component.html',
    providers: [OauthService]
})

export class LoginComponent implements OnInit {

    private localStorageService;
    private currentSession: Session = null;
    public user: User;
    submitted = false;
    islogin = false


    constructor(
        private _route: Router,
        private formBuilder: FormBuilder,
        private authService: OauthService
    ) {
        this.localStorageService = localStorage;
        this.user = new User('', '', '', '', '', '', '', '', '', '', '');
    }

    loginUser = this.formBuilder.group({
        email: '',
        password: '',
        gethash: ''
    })



    ngOnInit() {

    }

    login() {
        this.loginUser.value.gethash = true
        console.log(this.loginUser.value)
        this.authService.oautLogin(this.loginUser.value).subscribe(resp => {
           console.log(resp)
        }, err => {
            console.log(err);
        })


    }

    goTo() {
        console.log('entroo')
        this._route.navigate(['prestamos'])
    }

    onSubmit() {
        console.log('hola mundo');
        this.submitted = true;
    }

}