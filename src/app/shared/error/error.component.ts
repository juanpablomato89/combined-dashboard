import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/services/error.service';
import { ImagenService } from 'src/app/services/imagen.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  textoError = '';
  mostrarError = false;
  subscription: Subscription;
  constructor(private _imagenSevice: ImagenService, private _errorService: ErrorService) {
    this.subscription = this._errorService.getError().subscribe(mensaje => {
      this.mostrarError = true;
      this.textoError = mensaje;

      setTimeout(() => {
        this.mostrarError = false
        this.textoError = '';
      }, 4000);
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
