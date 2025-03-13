//*******************************/
//*********** CONSTANTES Y CONFIGURACIÓN ************/
//*******************************/

const tablaUsuarios = 'usuarios';
const tablaPacientes = 'pacientes';
const tablaHistorial = 'historiaClinica';
const tablaRecetas = 'citasMedicas';

//*******************************/
//*********** INICIALIZACIÓN DE LA BASE DE DATOS **********/
//*******************************/

function initBD() {
    const openDB = window.indexedDB.open('clinica', 1);

    openDB.onupgradeneeded = (event) => {
        let clinicaDB = event.target.result;

        clinicaDB.onerror = () => {
            console.error('Error cargando la base de datos');
        };

        if (!clinicaDB.objectStoreNames.contains(tablaUsuarios)) {
            clinicaDB.createObjectStore(tablaUsuarios, { keyPath: 'docMed' });
        }

        if (!clinicaDB.objectStoreNames.contains(tablaPacientes)) {
            clinicaDB.createObjectStore(tablaPacientes, { keyPath: 'cedulaPaciente' });
        }

        if (!clinicaDB.objectStoreNames.contains(tablaRecetas)) {
            let table = clinicaDB.createObjectStore(tablaRecetas, { keyPath: 'documentoPaciente', autoIncrement: true });
            table.createIndex('sintomasPaciente', 'sintomasPaciente', { unique: false });
            table.createIndex('diagnosticoPaciente', 'diagnosticoPaciente', { unique: false });
            table.createIndex('medicamentos', 'medicamentos', { unique: false });
        }
    };

    openDB.onerror = () => {
        console.error('Error abriendo la base de datos', event.target.error);
    };

    openDB.onsuccess = () => {
        console.log('Base de datos abierta correctamente');
    };
}

//*******************************/
//************ FUNCIONES DE LA BASE DE DATOS **********/
//*******************************/

async function openDatabase() {
    return new Promise((resolve, reject) => {
        const openDB = window.indexedDB.open('clinica', 1);

        openDB.onerror = () => reject('Error abriendo la base de datos');
        openDB.onsuccess = () => resolve(openDB.result);
    });
}

async function mostrarPaciente(cedulaPaciente) {
    try {
        const clinicaDB = await openDatabase();
        const transaccion = clinicaDB.transaction(['pacientes'], 'readonly');
        const tablaPacientes = transaccion.objectStore('pacientes');
        const datosPaciente = await tablaPacientes.get(cedulaPaciente);

        if (datosPaciente) {
            document.getElementById('datosPaciente').innerHTML = `
                <p>${datosPaciente.nombrePaciente} ${datosPaciente.apellidoPaciente}</p>
                <p>${datosPaciente.generoPaciente}</p>
                <p>${datosPaciente.fechaPaciente}</p>
            `;
        } else {
            console.log('Paciente no encontrado');
        }
    } catch (error) {
        console.error('Error mostrando paciente:', error);
    }
}

async function agregarCita(documentoPaciente, sintomasPaciente, diagnosticoPaciente, medicamentos) {
    try {
        const clinicaDB = await openDatabase();
        const transaction = clinicaDB.transaction([tablaRecetas], 'readwrite');
        const recetasStore = transaction.objectStore(tablaRecetas);
        const nuevaReceta = { documentoPaciente, sintomasPaciente, diagnosticoPaciente, medicamentos };
        const request = recetasStore.add(nuevaReceta);

        request.onsuccess = () => {
            console.log('Receta médica guardada exitosamente');
        };

        request.onerror = (error) => {
            console.error('Error guardando la receta:', error.target.error);
        };

        transaction.oncomplete = () => {
            console.log('Transacción completada');
        };

        transaction.onerror = () => {
            console.error('Error en la transacción:', transaction.error);
        };
    } catch (error) {
        console.error('Error en agregarCita:', error);
    }
}

//*******************************/
//************ MANEJO DE EVENTOS DEL DOM ************/
//*******************************/

document.getElementById('btnBuscarPaciente').addEventListener('click', () => {
    const documentoPaciente = document.getElementById('documentoPaciente').value;
    mostrarPaciente(documentoPaciente);
});

document.getElementById('btnGuardarDiagnostico').addEventListener('click', (event) => {
    event.preventDefault();
    const cedulaPaciente = document.getElementById('documentoPaciente').value;
    const sintomasPaciente = document.getElementById('sintomasPaciente').value;
    const diagnosticoPaciente = document.getElementById('diagnosticoPaciente').value;

    const medicamentos = [];
    const filasMedicamentos = document.querySelectorAll('.contAbla tr');
    filasMedicamentos.forEach(fila => {
        const inputs = fila.querySelectorAll('input');
        if (inputs.length === 3) {
            const medicamento = inputs[0].value;
            const dosis = inputs[1].value;
            const tiempo = inputs[2].value;
            if (medicamento && dosis && tiempo) {
                medicamentos.push({ medicamento, dosis, tiempo });
            }
        }
    });

    agregarCita(cedulaPaciente, sintomasPaciente, diagnosticoPaciente, medicamentos);
});

document.addEventListener('DOMContentLoaded', function () {
    const btnAgregar = document.getElementById('btnAgregar');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const tablaMedicamentos = document.getElementsByClassName('contAbla')[0];

    btnAgregar.addEventListener('click', function (event) {
        event.preventDefault();

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" class="frm"></td>
            <td><input type="text" class="frm"></td>
            <td><input type="text" class="frm"></td>
            <td><button type="button" class="borrar">Borrar</button></td>
        `;

        tablaMedicamentos.appendChild(newRow);

        newRow.querySelector('.borrar').addEventListener('click', function () {
            tablaMedicamentos.removeChild(newRow);
        });
    });

    btnLimpiar.addEventListener('click', function (event) {
        event.preventDefault();
        for (let i = tablaMedicamentos.children.length - 1; i > 0; i--) {
            tablaMedicamentos.removeChild(tablaMedicamentos.children[i]);
        }
        tablaMedicamentos.children[0].querySelectorAll("td>input").forEach(elemento => {
            elemento.value = "";
        });

        const inputs = document.querySelectorAll('.contDt input');
        inputs.forEach(input => input.value = '');
    });
});

// Inicializar la base de datos al cargar la página
initBD();