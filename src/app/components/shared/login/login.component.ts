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
    emailPattern: any = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;


    constructor(
        private _route: Router,
        private formBuilder: FormBuilder,
        private authService: OauthService
    ) {
        this.localStorageService = localStorage;
        this.user = new User('', '', '', '', '', '', '', '', '', '', '');
    }

    loginUser = this.formBuilder.group({
        email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
        password: ['', [Validators.required]]
    })



    ngOnInit() {

    }

    login() {
        

    }

    goTo() {
        console.log('entroo')
        this._route.navigate(['prestamos'])
    }

    onSubmit() {
        if (this.loginUser.valid) {
            //this.loginUser.value.gethash = true
            this.authService.oautLogin(this.loginUser.value).subscribe(resp => {
                console.log(resp)
            }, err => {
                console.log(err);
            })
            this.loginUser.reset()
        }
        else {
            console.log('No valid')
        }

    }

}