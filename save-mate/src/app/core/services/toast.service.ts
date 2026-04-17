import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) { }

  public successToastr(title: string, message: string) {
    this.toastr.success(message, title);
  }

  public infoToastr(title: string, message: string) {
    this.toastr.info(message, title);
  }

  public errorToastr(title: string, message: string) {
    this.toastr.error(message, title);
  }

  public warningToastr(title: string, message: string) {
    this.toastr.warning(message, title);
  }
}
