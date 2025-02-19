// main.js

import { initBD } from './db.js';

// Función para agregar un usuario
function agregarUsuario(docMedico, nombreMedico, apellidoMedico, correoMedico, telMedico, claveMedico, repClaveMedico, cargoMedico) {
    const openBD = window.indexedDB.open('clinica', 1);

    openBD.onerror = () => {
        console.error('Error abriendo la base de datos');
    };

    openBD.onsuccess = () => {
        let clinicaBD = openBD.result;
        const transaction = clinicaBD.transaction(['usuario'], 'readwrite');
        const usuarioStore = transaction.objectStore('usuario');

        const nuevoUsuario = {
            docMedico,
            nombreMedico,
            apellidoMedico,
            correoMedico,
            telMedico,
            claveMedico,
            repClaveMedico,
            cargoMedico
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
    if (frmData.get('claveMedico') !== frmData.get('repClaveMedico')) {
        alert('Error: Las contraseñas no coinciden.');
        return;
    }

    // Validar que ningún campo esté vacío
    if (
        !frmData.get('docMedico') ||
        !frmData.get('nombreMedico') ||
        !frmData.get('apellidoMedico') ||
        !frmData.get('correoMedico') ||
        !frmData.get('telMedico') ||
        !frmData.get('claveMedico') ||
        !frmData.get('repClaveMedico') ||
        !frmData.get('cargoMedico')
    ) {
        alert('Error: Todos los campos son obligatorios.');
        return;
    }

    // Llamar a la función para agregar el usuario
    agregarUsuario(
        frmData.get('docMedico'),
        frmData.get('nombreMedico'),
        frmData.get('apellidoMedico'),
        frmData.get('correoMedico'),
        frmData.get('telMedico'),
        frmData.get('claveMedico'),
        frmData.get('repClaveMedico'),
        frmData.get('cargoMedico')
    );
});