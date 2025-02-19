//*********************************************************************************************/
//******************************** CRACION DE LA BASE DE DATOS ********************************/
//*********************************************************************************************/

 const tablaUsuarios = 'usuarios'
function initBD() {
    const openDB = window.indexedDB.open('clinica', 1);

    openDB.onupgradeneeded = (event) => {
        let clinicaDB = event.target.result;

        clinicaDB.onerror = () => {
            console.error('Error cargando la base de datos');
        };
        if (!clinicaDB.objectStoreNames.contains(tablaUsuarios)) {
            let table = clinicaDB.createObjectStore(tablaUsuarios, { keyPath: 'docMed' });
            table.createIndex('docMed', 'docMed', { unique: false }); // Asegurar que el documento sea único
        }

        
    };

    openDB.onerror = () => {
        console.error('Error abriendo la base de datos', evet.target.error);
    };

    openDB.onsuccess = () => {
        console.log('Base de datos abierta correctamente');
    };
}


//*********************************************************************************************/
//************************************* ADICION DE USUARIO ************************************/
//*********************************************************************************************/
function agregarUsuario(docMed, nombreMed, apellidoMed, correoMed, telMed, claveMed, repClaveMed, cargoMed) {
    const openDB = window.indexedDB.open('clinica', 1);


    openDB.onerror = () => {
        console.error('Error abriendo la base de datos');
    };


    openDB.onsuccess = () => {
        let clinicaDB = openDB.result;

        if (!clinicaDB) {
            console.error('Error: La base de datos no está disponible.');
            return;
        } 

        const transaction = clinicaDB.transaction([tablaUsuarios], 'readwrite');
        const usuarioStore = transaction.objectStore(tablaUsuarios);
        
        const nuevoUsuario = {
            docMed,
            nombreMed,
            apellidoMed,
            correoMed,
            telMed,
            claveMed,
            repClaveMed,
            cargoMed
        };

        const agregarRequest = usuarioStore.add(nuevoUsuario);

        agregarRequest.onsuccess = () => {
            console.log('Usuario agregado correctamente');
            alert('Usuario registrado con éxito');
        };

        agregarRequest.onerror = (error) => {
            if (error.target.error.name === 'ConstraintError') {
                console.error('Error: El documento del médico ya está registrado.');
                alert('Error: El documento del médico ya está registrado.');
            } else {
                console.error('Error desconocido:', error.target.error.name);
                alert('Error desconocido al registrar el usuario.');
            }
        };

        transaction.onerror = (error) => {
            console.error('Error en la transacción:', error);
        };
    };
}

// Inicializar la base de datos al cargar la página
    
initBD();
// Capturar el formulario y el botón de guardar
const crearUser = document.querySelector('#formularioMedico');
const btnGuardar = document.getElementById('btnGuardar');

btnGuardar.addEventListener('click', (event) => {
    event.preventDefault();
    
    const frmData = new FormData(crearUser);
    
    // Validar que las contraseñas coincidan
    if (frmData.get('claveMed') !== frmData.get('repClaveMed')) {
        alert('Error: Las contraseñas no coinciden.');
        return;
    }
    
    // Llamar a la función para agregar el usuario
    agregarUsuario(
        frmData.get('docMed'),
        frmData.get('nombreMed'),
        frmData.get('apellidoMed'),
        frmData.get('correoMed'),
        frmData.get('telMed'),
        frmData.get('claveMed'),
        frmData.get('repClaveMed'),
        frmData.get('cargoMed')
        );
    });
