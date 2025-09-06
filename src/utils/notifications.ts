import Swal from 'sweetalert2';

export class Notifications {
  static success(title: string, text?: string) {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      timer: 3000,
      timerProgressBar: true,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      background: '#d1fae5',
      color: '#065f46',
      iconColor: '#10b981'
    });
  }

  static error(title: string, text?: string) {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      timer: 5000,
      timerProgressBar: true,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      background: '#fef2f2',
      color: '#7f1d1d',
      iconColor: '#ef4444'
    });
  }

  static warning(title: string, text?: string) {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      timer: 4000,
      timerProgressBar: true,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      background: '#fef3c7',
      color: '#92400e',
      iconColor: '#f59e0b'
    });
  }

  static info(title: string, text?: string) {
    return Swal.fire({
      icon: 'info',
      title,
      text,
      timer: 3000,
      timerProgressBar: true,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      background: '#dbeafe',
      color: '#1e3a8a',
      iconColor: '#3b82f6'
    });
  }

  static confirm(title: string, text?: string, confirmButtonText: string = 'Confirmer') {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText,
      cancelButtonText: 'Annuler',
      background: '#ffffff',
      backdrop: 'rgba(0,0,0,0.7)'
    });
  }

  static loading(title: string = 'Chargement...', text?: string) {
    return Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: '#ffffff',
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  static close() {
    Swal.close();
  }
}
