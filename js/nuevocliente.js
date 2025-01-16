//BASE DE DATOS DE CLIENTES - Nuevo Cliente

(function() {
    //------Entorno IIFE------//

    //Selección HTML
    const formularioCliente = document.querySelector('#formulario');
    const nombreIn = document.querySelector('#nombre');
    const emailIn = document.querySelector('#email');
    const telefonoIn = document.querySelector('#telefono');
    const empresaIn = document.querySelector('#empresa');

    //Parametros
    let esquema;

    //Eventos
    document.addEventListener('DOMContentLoaded', () => {
        getDB(); //Base de Datos

        formularioCliente.addEventListener('submit', e => submitCliente(e));
    });

    //Funciones
    function submitCliente(e) {
        e.preventDefault();

        const nombre = nombreIn.value;
        const email = emailIn.value;
        const telefono = telefonoIn.value;
        const empresa = empresaIn.value;

        const validacionForm = [nombre, email, telefono, empresa];
        
        if(validacionForm.includes('')) {
            printAlert('Todos los campos son obligatorios', 'error');
            return;
        }

        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
        }
        cliente.idReference = Math.random().toString(36).slice(2) + Date.now();

        setRegistro(cliente);
    }

    //--Funciones Base de Datos--//
    function getDB() {
        const baseDatos = window.indexedDB.open('crm', 1);
    
        baseDatos.onerror = () => console.log('ERROR: no hubo conexión con Base de Datos');
    
        baseDatos.onsuccess = () => {
            esquema = baseDatos.result;
        }
    }

    //--//
    function setRegistro(nuevoCliente) {
        const setTransaccion = esquema.transaction(['clientes'], 'readwrite');

        const getTabla = setTransaccion.objectStore('clientes');

        getTabla.add(nuevoCliente);

        setTransaccion.onerror = () => {
            console.log('ERROR: Registro no establecido')

            printAlert('El correo ya existe', 'error');
        };

        setTransaccion.oncomplete = () => {
            console.log('EXITO: Registro establecido');

            printAlert('El cliente se agregó correctamente', 'exito');

            formularioCliente.reset(); 

            setTimeout(() => {
                /*
                El método .href accede a la propiedad de URL de .location.
                Al asignar un nuevo valor, esta recargará en automático.
                */
                window.location.href = 'index.html';
            }, 2500);
        }
    }

    //------Entorno IIFE------//
})();