////BASE DE DATOS DE CLIENTES - Funciones

function printAlert(mensaje, tipo) {
    const validacionDiv = document.querySelector('.alert');
    validacionDiv?.remove();

    const divMensaje = document.createElement('div');
    divMensaje.classList.add('alert', 'px-4', 'py-3', 'mx-auto', 'mt-6', 'border', 'max-w-lg', 'rounded', 'text-center');

    if(tipo === 'error') {
        divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
    } else {
        divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
    }

    divMensaje.textContent = mensaje;

    const formularioCliente = document.querySelector('#formulario');
    formularioCliente.appendChild(divMensaje);

    setTimeout(() => {
        divMensaje.remove();
    }, 2000)
}

