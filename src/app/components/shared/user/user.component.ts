import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { MustMatch } from './_helpers/must-match.validator';
declare var $;
@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
    providers: []
})
export class UserComponent implements OnInit {
    registerForm: FormGroup;
    submitted = false;
    constructor(private formBuilder: FormBuilder) {

    }

    userForm = this.formBuilder.group({
        fullName: ['', [Validators.required, Validators.maxLength(15)]],
        documentType: [''],
        documentNumber: [''],
        accountType: [''],
        accountNumber: [''],
        email: ['', [Validators.email, Validators.required]],
        password: ['']
    })

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.

    }

    public hasError(name: string) {
        let response: string = ''
        const control = this.userForm.get(name)
        if (control.errors) {
            if (control.errors.maxlength) {
               response = "Limite de caracteres excedido"
                console.log(control);
            }
        }
        return response
    }
    //Funcionabilidad para pagos...
    openModal(id, idPaymen) {
        if (idPaymen != null || idPaymen != 'undefined' || idPaymen != '' || idPaymen != 'null') {
            localStorage.setItem('idPayment', idPaymen);
            console.log('idPayment', idPaymen)
        }
        $("#" + id).modal("show");
    }

    createUser() {
        console.log(this.userForm.value)
    }
} 