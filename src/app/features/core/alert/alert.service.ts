// src/app/shared/services/alert.service.ts
import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  showAlert(title: string, text: string = '', icon: SweetAlertIcon = 'info') {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'OK'
    });
  }

  success(message: string, title = 'Success') {
    return this.showAlert(title, message, 'success');
  }

  error(message: string, title = 'Error') {
    return this.showAlert(title, message, 'error');
  }

  warning(message: string, title = 'Warning') {
    return this.showAlert(title, message, 'warning');
  }

  info(message: string, title = 'Info') {
    return this.showAlert(title, message, 'info');
  }

  confirm(
    title: string,
    text: string = '',
    confirmButtonText = 'Yes',
    cancelButtonText = 'Cancel'
  ) {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText
    });
  }
}
