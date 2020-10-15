import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService, Toast } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user/user.model'
import { Endpoints } from '../../config/endpoints'
import { UserService } from '../../../services/user-services/user.service';
import { UploadService } from '../../../services/uploads-service/upload.service';
//import { MustMatch } from './_helpers/must-match.validator';
declare var $;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [UserService, UploadService]
})
export class UserComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  public user: User;
  public users: any;
  public nameImagen;
  public fileToUpload: Array<File>;
  public urlBase: String;
  public avatar: String = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQzr9MZuVHIBRWTXhdzLQAx_-Y0e5Wg6-MmJv4uLE1AyHnhdA5V&usqp=CAU'
  public statusUser: String = "0";
  public bandera: Boolean = false
  public flagUserUpdate: boolean = false;
  public flagUserCreate: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private uploadService: UploadService,
    private _route: Router
  ) {
    this.urlBase = Endpoints.url;

    this.userFormUpdate = this.formBuilder.group({
      fullName: '',
      documentType: '0',
      documentNumber: '',
      accountType: '0',
      accountNumber: '',
      bank: '0',
      phone: '',
      email: '',
      password: '',
      status: '',
      role: ''
    })
    this.user = new User('', '', '', '', '', '', '', '', '', '', '', '');
  }

  userForm = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.maxLength(30)]],
    documentType: ['0', [Validators.required, Validators.pattern("[a-zA-Z0-9]")]],
    documentNumber: [''],
    accountType: ['0'],
    accountNumber: [''],
    bank: ['0'],
    phone: ['', [Validators.required]],
    email: ['',],
    password: [''],
    status: [''],
    role: []
  })

  userFormUpdate = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.maxLength(15)]],
    documentType: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9]")]],
    documentNumber: [''],
    accountType: [''],
    accountNumber: [''],
    bank: [''],
    phone: ['', [Validators.required]],
    email: ['',],
    password: [''],
    status: [''],
    role: []
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
    //console.log(this.userForm.value)
    var str = this.userForm.value.fullName;
    str = str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
      return letter.toUpperCase();
    })

    this.user.fullName = str
    this.user.documentNumber = this.userForm.value.documentNumber
    this.user.documentType = this.userForm.value.documentType
    this.user.accountNumber = this.userForm.value.accountNumber
    this.user.accountType = this.userForm.value.accountType
    this.user.bank = this.userForm.value.bank
    this.user.phone = this.userForm.value.phone
    this.user.email = this.userForm.value.email
    this.user.password = this.userForm.value.password
    this.user.role = this.userForm.value.role
    this.user.photo = (localStorage.getItem('image') == '' || localStorage.getItem('image') == null ? '' : localStorage.getItem('image'))
    this.user.status = '1';
    console.log(this.user)
    /**Save user in DB */
    this.flagUserCreate = true;
    setTimeout(() => {
      this.userService.createUser(this.user)
        .subscribe(
          (user: any) => {
            if (user.status == 'OK') {
              this.closeModal('show-md-create-user')
              this.showToaster('1', 'Registrar usuario', 'El usuario se ha registrado exitosamente')
              $("#tableUser").dataTable().fnDestroy();
              localStorage.removeItem('image')
              this.flagUserCreate = false;
              this.getUsers()
              this.userForm.reset();
              this.userForm = this.formBuilder.group({
                fullName: '',
                documentType: '0',
                documentNumber: '',
                accountType: '0',
                accountNumber: '',
                bank: '0',
                phone: '',
                email: '',
                password: '',
                photo: '',
                role: ''
              })
            }
            else {
              this.showToaster('2', 'Ha ocurrido un error al tratar de crear el usuari', 'Usuario')
            }
          },
          error => {
            console.log(error)
          }
        )
    }, 1000)
  }

  editUser(idModal, idUser) {
    /**Save user in DB */
    localStorage.setItem('userId', idUser)
    this.userService.listUsersById(idUser)
      .subscribe(
        (user: any) => {
          if (user.status == 'OK') {
            //this.showToaster('1', 'Registrar usuario', 'El usuario se ha registrado exitosamente')
            // $("#tableUser").dataTable().fnDestroy();
            // this.getUsers()
            // this.closeModal('show-md-create-user')
            // this.userForm.reset();
            console.log(user)
            this.user = user.message
            this.userFormUpdate = this.formBuilder.group({
              fullName: this.user.fullName,
              documentType: this.user.documentType,
              documentNumber: this.user.documentNumber,
              accountType: (this.user.accountType == '0' ? '' : this.user.accountType),
              accountNumber: (this.user.accountNumber == '' || this.user.accountNumber == null || this.user.accountNumber == 'undefined' ? '' : this.user.accountNumber),
              bank: (this.user.bank == '0' ? '' : this.user.bank),
              phone: this.user.phone,
              email: (this.user.email == '' || this.user.email == null || this.user.email == 'udefined' ? '' : this.user.email),
              password: (this.user.password == '' || this.user.password == null || this.user.password == 'undefined' ? '' : this.user.password),
              status: this.user.status,
              role: this.user.role
            })

            if (this.user.photo == '' || this.user.photo == null) {
              $(".image-user").attr("src", this.avatar);
            }
            else {
              $(".image-user").attr("src", this.urlBase + 'imagen/' + this.user.photo);
            }
            //console.log(this.userFormUpdate.value)
            this.openModal(idModal, null)
          }
        },
        error => {
          console.log(error)
        }
      )
  }

  // Recojo la información del archivo a subir con el evento change...
  fileChangeEvent(fileInput: any) {
    this.fileToUpload = <Array<File>>fileInput.target.files;
    console.log(this.fileToUpload.length);
    if (this.fileToUpload.length > 0 || this.fileToUpload != null) {
      this.uploadService.makeFileRequest([], this.fileToUpload, null, 'archivo', 'usuario').then(
        (result: any) => {
          console.log(result)
          localStorage.setItem('image', result.nameImagen)
          var image_path = this.urlBase + 'imagen/' + result.nameImagen
          $(".image-user").attr("src", image_path);
        },
        (error: any) => {
          console.log(error)
        }
      )
    }
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

  updateUser() {
    var str = this.userFormUpdate.value.fullName;
    str = str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
      return letter.toUpperCase();
    })
    this.user.fullName = str
    this.user.documentNumber = this.userFormUpdate.value.documentNumber
    this.user.documentType = this.userFormUpdate.value.documentType
    this.user.accountNumber = this.userFormUpdate.value.accountNumber
    this.user.accountType = this.userFormUpdate.value.accountType
    this.user.bank = this.userFormUpdate.value.bank
    this.user.phone = this.userFormUpdate.value.phone
    this.user.email = this.userFormUpdate.value.email
    this.user.password = this.userFormUpdate.value.password
    this.user.role = this.userForm.value.role
    this.user.photo = (localStorage.getItem('image') == '' || localStorage.getItem('image') == null ? '' : localStorage.getItem('image'))
    console.log('Este es el usuario a actualizar ---------------------> ', localStorage.getItem('userId'))

    this.userService.updateUsersById(localStorage.getItem('userId'), this.user).subscribe(
      (updateUser: any) => {
        if (updateUser.status == 'OK') {
          setInterval(() => {
            this.flagUserUpdate = true;
            this.closeModal('show-md-update-user')
          }, 1000)
          this.flagUserUpdate = true
          this.showToaster('1', 'Actualizar usuario', 'Datos actualizados exitosamente')
          $("#tableUser").dataTable().fnDestroy();
          localStorage.removeItem('image')
          this.getUsers()
          this.userForm.reset();
          this.userForm = this.formBuilder.group({
            fullName: '',
            documentType: '0',
            documentNumber: '',
            accountType: '0',
            accountNumber: '',
            bank: '0',
            phone: '',
            email: '',
            password: '',
            photo: '',
            role: ''
          })
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  changeStatus(id, status) {
    let sta = false

    if (id == 'null') {
      // this.statusUser = (status == '0' || status == '' || typeof(status) == 'undefined' ? 'Inactivo' : 'Activo')
      this.getStatus(status)
      sta = (status == '0' || typeof (status) == 'undefined' ? false : true)
      if (sta) {
        $(".status1").attr("class", 'btn btn-success btn btn-xs  delete button-magin cursor-pinter');
      }
      else {
        $(".status2").attr("class", 'btn btn-warning btn btn-xs  delete button-magin cursor-pinter');
      }
    }
    else {
      this.userService.changeStatusUsersById(id, { status: (status == '1' ? '0' : '1') }).subscribe(
        (statusUser: any) => {
          // this.getStatus(statusUser.message.status)
          sta = (statusUser.message.status == '0' || typeof (statusUser.message.status) == 'undefined' ? false : true)
          // console.log( this.statusUser)
          if (sta) {
            $(".status1").attr("class", 'btn btn-warning btn btn-sm  delete button-magin cursor-pinter');
            $("#tableUser").dataTable().fnDestroy();
            this.getUsers()
          }
          else {
            console.log('entro cuando se actualiza el estado a false', sta)
            $(".status2").attr("class", 'btn btn-warning btn btn-sm  delete button-magin cursor-pinter');
            $("#tableUser").dataTable().fnDestroy();
            this.getUsers()
          }
          // console.log(sta)
        },
        error => {
          console.log(error)
        }
      )
    }
    // console.log('New status',sta)
    return sta
  }

  getStatus(data) {
    this.statusUser = (data == '0' || data == '' || typeof (data) == 'undefined' ? 'Inactivo' : 'Activo')
    return this.statusUser
  }

  getDocumentType(type) {
    let documentType = {
      '1': 'CC',
      '2': 'TI',
      '3': 'CE'
    }
    return documentType[type]
  }

  getBank(name) {
    let bank = {
      '1': 'Bancolombia',
      '2': 'Davivienda',
      '3': 'Banco de Bogota',
      '4': 'Banco Popular',
    }
    return bank[name]
  }

  getaccountType(type) {
    let accountType = {
      '1': 'AHORROS',
      '2': 'CORRIENTE',
    }
    return accountType[type]
  }
  onSubmit() {
    console.log('hola mundo');
    this.submitted = true;
  }

  goTo(id) {
    this._route.navigate(['home/prestamos/', id])
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
