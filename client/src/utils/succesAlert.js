import Swal from 'sweetalert2'

const successAlert = (message) => { 
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 2000
  })
}

export default successAlert