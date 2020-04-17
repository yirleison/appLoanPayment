import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService, Toast } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user/user.model'
import { UserService } from '../../../services/user-services/user.service';
//import { MustMatch } from './_helpers/must-match.validator';
declare var $;
@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
    providers: [UserService]
})
export class UserComponent implements OnInit {
    registerForm: FormGroup;
    submitted = false;
    public user: User;
    public users: any;
    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private userService: UserService) {
        this.userForm = this.formBuilder.group({
            fullName: '',
            documentType: '0',
            documentNumber: '',
            accountType: '0',
            accountNumber: '',
            phone: '',
            email: '',
            password: ''
        })
        this.user = new User('', '', '', '', '', '', '', '');
    }

    userForm = this.formBuilder.group({
        fullName: ['', [Validators.required, Validators.maxLength(15)]],
        documentType: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9]")]],
        documentNumber: [''],
        accountType: [''],
        accountNumber: [''],
        phone: ['', [Validators.required]],
        email: ['',],
        password: ['']
    })

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.getUsers()
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

    closeModal(id) {
        $("#" + id).modal("hide");
    }

    createUser() {
        console.log(this.userForm.value)
        var str = this.userForm.value.fullName;
        str = str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
        })

        this.user.fullName = str
        this.user.documentNumber = this.userForm.value.documentNumber
        this.user.documentType = this.getDocumentType(this.userForm.value.documentType)
        this.user.accountNumber = this.userForm.value.accountNumber
        this.user.accountType = this.getaccountType(this.userForm.value.accountType)
        this.user.phone = this.userForm.value.phone
        this.user.email = this.userForm.value.email
        this.user.password = this.userForm.value.password

        /**Save user in DB */
        this.userService.createUser(this.user)
            .subscribe(
                (user: any) => {
                    if (user.status == 'OK') {
                        this.showToaster('1', 'Registrar usuario', 'El usuario se ha registrado exitosamente')
                        this.closeModal('show-md-create-user')
                        this.userForm.reset();
                        this.userForm = this.formBuilder.group({
                            fullName: '',
                            documentType: '0',
                            documentNumber: '',
                            accountType: '0',
                            accountNumber: '',
                            phone: '',
                            email: '',
                            password: ''
                        })
                    }
                },
                error => {
                    console.log(error)
                }
            )
    }

    getUsers() {
        this.userService.listUsers().subscribe(
            (users: any) => {
                if (users.status == 'OK') {
                    this.users = users.message
                    $(document).ready(function () {
                        $('#tableUser').dataTable({
                            language: {
                                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
                            }
                        })
                    })
                }
            },
            error => {
                console.log(error)
            }
        )
    }

    getDocumentType(type) {
        let documentType = {
            '1': 'CC',
            '2': 'TI',
            '3': 'CE'
        }
        return documentType[type]
    }

    getaccountType(type) {
        let accountType = {
            '1': 'AHORROS',
            '2': 'CORRIENTE',
        }
        return accountType[type]
    }

    showToaster(status, title, message) {
        switch (status) {
            case '1':
                this.toastr.success(message + '.', title);
                break;
            case '2':
                this.toastr.error(message + '.', title);
                break
            default:
                this.toastr.error(message + '.', title);
                break;
        }
    }
} 