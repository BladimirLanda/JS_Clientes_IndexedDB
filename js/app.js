//BASE DE DATOS DE CLIENTES - Principal

/*
IIFE (Immediately Invoked Function Expression): Las expresiones de función ejecutadas inmediatamente 
son funciones que se ejecutan tan pronto como se definen.
Es un patrón de diseño también conocido cómo función autoejecutable y se compone por dos partes:
 
1) La primera es la función anónima con alcance de operación encerrado por el Operador de Agrupación (). 
Esto impide accesar variables fuera del IIFE, así cómo contaminar el alcance (scope) global.
2) La segunda parte crea la expresión de función cuya ejecución es inmediata (), siendo interpretado 
directamente en el motor de JavaScript.

Permiten el acceso público a los métodos mientras se conserva la privacidad de las variables 
definidas dentro de la función.

(function () {
  statements;
})();
*/

(function() {
    //------Entorno IIFE------//

    //Selección HTML
    const listadoClientes = document.querySelector('#listado-clientes');

    //Parametros
    let esquema;

    //Eventos
    document.addEventListener('DOMContentLoaded', () => {
        setDB(); //Base de Datos

        if(window.indexedDB.open('crm', 1)) {
            getRegistros(); //Base de datos
        } 

        listadoClientes.addEventListener('click', e => deleteRegistro(e));
    });

    //--Funciones Base de Datos--//
    function setDB() {
        const baseDatos = window.indexedDB.open('crm', 1);

        baseDatos.onerror = () => console.log('ERROR: creación/acceso Base de Datos');

        baseDatos.onsuccess = () => {
            console.log('EXITO: creación/acceso Base de Datos');

            esquema = baseDatos.result;
        }

        baseDatos.onupgradeneeded = (e) => {
            const setEsquema = e.target.result;

            const setTabla = setEsquema.createObjectStore('clientes', {
                keyPath: 'id',
                autoIncrement: true
            });

            setTabla.createIndex('nombre', 'nombre', { unique: false });
            setTabla.createIndex('email', 'email', { unique: true });
            setTabla.createIndex('telefono', 'telefono', { unique: false });
            setTabla.createIndex('empresa', 'empresa', { unique: false });
            setTabla.createIndex('idReference', 'idReference', { unique: true });

            console.log('EXITO: construcción Base de Datos');
        }
    }

    //--//
    function getRegistros() {
        const baseDatos = window.indexedDB.open('crm', 1);

        baseDatos.onerror = () => console.log('ERROR: no hubo conexión con Base de Datos');

        baseDatos.onsuccess = () => {
            //En caso de que no se aplique ningún modo, se entiende como solo 'obtención' y se puede omitir el ['']
            const setTransaccion = esquema.transaction(['clientes']); 
            
            const getTabla = setTransaccion.objectStore('clientes');

            const requestRegistros = getTabla.openCursor();
            requestRegistros.onsuccess = (e) => {
                const registro = e.target.result;

                if(registro) {
                    const { nombre, email, telefono, empresa, idReference, id } = registro.value;

                    listadoClientes.innerHTML += `
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg font-bold">${nombre}</p>
                                <p class="text-sm leading-10 text-gray-700">${email}</p>
                            </td>

                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>

                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${empresa}</p>
                            </td>

                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${idReference}" class="btn-editar text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="btn-eliminar text-red-600 hover:text-red-900">Eliminar</a>
                            </td>
                        </tr>
                    `;

                    /*
                    El signo de interrogación (?) en una URL indica el inicio de un parámetro (query string), 
                    que es una forma de agregar información adicional a la URL, que se puede utilizarla para 
                    definir contenido, rastraer información o ejecutar acciones específicas.
                    Cada parámetro se representa como un par clave-valor:
                    1) Se coloca el (?) al final de la URL
                    2) Se establece el parametro
                    3) Se le asigna el valor (=)
                    */

                    registro.continue();
                } else {
                    console.log('MENSAJE: No hay más Registros');
                }
            }
        }
    }

    //--//
    function deleteRegistro(e) {
        if(e.target.classList.contains('btn-eliminar')) {
            const idRegistro = Number(e.target.dataset.cliente); //.data-cliente

            /*
            confirm(): Es un método que muestra un cuadro de diálogo con un mensaje, 
            un botón de Aceptar y otro de Cancelar. Cada uno tomando un valor booleano.
            */
            const confirmar = confirm('¿Deseas eliminar este cliente?')

            if(confirmar) {
                const setTransaccion = esquema.transaction(['clientes'], 'readwrite');

                const getTabla = setTransaccion.objectStore('clientes');

                getTabla.delete(idRegistro);

                setTransaccion.onerror = () => console.log('ERROR: Registro no eliminado');
        
                setTransaccion.oncomplete = () => {
                    console.log('EXITO: Registro eliminado');

                    e.target.parentElement.parentElement.remove();
                }
            }
        }
    }

    //------Entorno IIFE------//
})();
