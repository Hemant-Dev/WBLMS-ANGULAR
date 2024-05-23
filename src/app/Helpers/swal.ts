import Swal from 'sweetalert2';

export function successAlert(msg: string) {
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: msg,
    showConfirmButton: false,
    timer: 1500,
    width: 400,
    heightAuto: true,
  });
}

export function showReason(msg: string) {
  Swal.fire({
    position: 'center',
    // icon: 'info',
    title: msg,
    showConfirmButton: false,
    timer: 1500,
    width: 400,
    heightAuto: true,
  });
}
export function errorAlert(msg: string) {
  Swal.fire({
    position: 'top-end',
    icon: 'error',
    title: msg,
    showConfirmButton: false,
    timer: 1500,
    width: 400,
    heightAuto: true,
  });
}

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export function successToast(msg: string) {
  Toast.fire({
    icon: 'success',
    title: msg,
  });
}

export function errorToast(msg: string) {
  Toast.fire({
    icon: 'error',
    title: msg,
  });
}

export function dialogSwal() {
  Swal.fire({
    title: '',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Save',
    denyButtonText: `Don't save`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire('Saved!', '', 'success');
    } else if (result.isDenied) {
      Swal.fire('Changes are not saved', '', 'info');
    }
  });
}
