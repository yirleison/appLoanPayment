import { Injectable } from '@angular/core'; //  Inyectar los servicios
import 'rxjs/add/operator/map'; // Mapear datos ú objetos
import { Observable } from 'rxjs/Observable'; // recoger las respuestas de las peticiones
import { Endpoints } from '../../../app/components/config/endpoints'


@Injectable()

export class UploadService {

    public urlBase: String;

    constructor() {
        this.urlBase = Endpoints.url;
    }

    makeFileRequest( params: Array<string>, files: Array<File>, token: string, name: string, tipo) {
      let url = this.urlBase;
        return new Promise(function (resolve, reject) {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            for (var i = 0; i < files.length; i++) {
                formData.append(name, files[i], files[i].name);
            }
            console.log(formData)
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    }

                    else {
                        reject(JSON.parse(xhr.response));
                    }
                }
            }
            xhr.open('PUT', url + 'upload?tipo='+tipo, true);
            //xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}