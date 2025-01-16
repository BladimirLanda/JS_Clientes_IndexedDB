//BASE DE DATOS DE CLIENTES - Editar Cliente

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
    let gotIdReference;
    let gotId;

    //Eventos
    document.addEventListener('DOMContentLoaded', () => {
        getDB(); //Base de Datos

        setTimeout(() => {
            getIdCliente();
        }, 100);

        formularioCliente.addEventListener('submit', e => submitCliente(e));
    });

    //Funciones
    function getIdCliente() {
        /*
        URLSearchParams: es un objeto integrado en JavaScript que permite interpretar y
        trabajar con una cadena de consulta de la URL. Proporciona métodos para:
        1) Agregar, eliminar, obtener y configurar pares clave-valor en la cadena de consulta 
        2) Manipular y modificar la URL 
        3) Saber si un parámetro está en la URL
        */
        //.search: Devuelve solo los parametros de la URL
        const parametrosURL = new URLSearchParams(window.location.search);

        const getIdCliente = parametrosURL.get('id'); //.get(): Método de obtención del Objeto URLSP
        
        if(getIdCliente) {
            getRegistro(getIdCliente);
        }
    }

    //--//
    function setFormulario(registro) {
        const { nombre, email, telefono, empresa, idReference, id } = registro;

        nombreIn.value = nombre;
        emailIn.value = email;
        telefonoIn.value = telefono;
        empresaIn.value = empresa;

        gotIdReference = idReference;
        gotId = id;
    }

    //--//
    function submitCliente(e) {
        e.preventDefault();

        const validacionForm = [nombreIn, emailIn, telefonoIn, empresaIn];

        if(validacionForm.includes('')) {
            printAlert('Todos los campos son obligatorios', 'error');
            return;
        }

        const cliente = {
            nombre: nombreIn.value,
            email: emailIn.value,
            telefono: telefonoIn.value,
            empresa: empresaIn.value,
            idReference: gotIdReference,
            id: gotId
        }

        updateRegistro(cliente);
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
    function getRegistro(idCliente) {
        const setTransaccion = esquema.transaction(['clientes'], 'readonly');

        const getTabla = setTransaccion.objectStore('clientes');

        const requestRegistros = getTabla.openCursor();
        requestRegistros.onsuccess = (e) => {
            const registro = e.target.result;

            if(registro) {
                const { idReference } = registro.value;

                if(idReference === idCliente) {
                    setFormulario( {...registro.value} );
                }

                registro.continue();
            }
        } 
    }

    //--//
    function updateRegistro(edicionCliente) {
        const setTransaccion = esquema.transaction(['clientes'], 'readwrite');

        const getTabla = setTransaccion.objectStore('clientes');

        getTabla.put(edicionCliente);

        setTransaccion.onerror = () => console.log('ERROR: Error en actualizar registro');

        setTransaccion.oncomplete = () => {
            console.log('EXITO: Registro actualizado');

            printAlert('El cliente se actualizo correctamente', 'exito');

            formularioCliente.reset(); 

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2500);
        }
    }

    //------Entorno IIFE------//
})();