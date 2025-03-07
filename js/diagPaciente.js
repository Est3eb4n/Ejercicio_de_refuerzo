//*********************************************************************************************/
//******************************** CRACION DE LA BASE DE DATOS ********************************/
//*********************************************************************************************/

const tablaUsuarios = 'usuarios'
const tablaPacientes = 'pacientes'
const tablaHistorial = 'historiaClinica'
const tablaRecetas = 'citasMedicas'
function initBD() {
   const openDB = window.indexedDB.open('clinica', 1);

   openDB.onupgradeneeded = (event) => {
       let clinicaDB = event.target.result;

       clinicaDB.onerror = () => {
           console.error('Error cargando la base de datos');
       };
       if (!clinicaDB.objectStoreNames.contains(tablaUsuarios)) {
           let table = clinicaDB.createObjectStore(tablaUsuarios, { keyPath: 'docMed' });
       }

       if(!clinicaDB.objectStoreNames.contains(tablaPacientes)){
           let table = clinicaDB.createObjectStore(tablaPacientes, {keyPath: 'cedulaPaciente'})
       }
       if(!clinicaDB.objectStoreNames.contains(tablaRecetas)){
        let table = clinicaDB.createObjectStore(tablaRecetas,{keyPath: 'citasMedicas'});
        
        table.createIndex('medicamento', 'medicamento', {unique:false})
        table.createIndex('dosis', 'dosis', {unique:false})
        table.createIndex('tiempo', 'tiempo', {unique:false})
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
//********************************** DIADNOSTICO DE PACIENTE **********************************/
//*********************************************************************************************/


btnBuscarPaciente.addEventListener('click', ()=>{
    const documentoPaciente = document.getElementById('documentoPaciente');
    mostrarPaciente(documentoPaciente.value)
})


function mostrarPaciente( cedulaPaciente ){
    const openDB = window.indexedDB.open('clinica',1);

    openDB.onerror = () => console.error('Error abriendo la base de datos');

    openDB.onsuccess = () => {

        const transaccion = openDB.result.transaction(['pacientes'], 'readonly');

        const tablaPacientes = transaccion.objectStore('pacientes');

        const datosPaciente = tablaPacientes.get(cedulaPaciente);

        datosPaciente.onsuccess = function (event){
            const datos = event.target.result;

            document.getElementById('datosPaciente').innerHTML = `
            <input type="text" value="${datos.nombrePaciente + datos.apellidoPaciente}">
            <input type="text" value="${datos.generoPaciente}">
            <input type="text" value="${datos.fechaPaciente}">
        `;
        }
    }
    
}

function agregarCita(cedulaPaciente, sintomasPaciente, diagnosticoPaciente, medicamentoPaciente, dosisPaciente, tratamientoPaciente){
    const openDB = window.indexedDB.open('clinica', 1);

    openDB.onerror = () => console.log('Error abriendo la base de datos');

    openDB.onsuccess = () => {
        let clinicaDB = openDB.result;
        
        if(!clinicaDB.objectStoreNames.contains(tablaRecetas)){
            console.error('El almacen de objetos "tablaRecetas" no existe');
            return;
        }
        const transaction = clinicaDB.transaction([tablaRecetas], 'readwrite');
        const recteasStore = transaction.objectStore(tablaRecetas);
        const nuevaReceta = { cedulaPaciente, sintomasPaciente, diagnosticoPaciente, medicamentoPaciente, dosisPaciente, tratamientoPaciente }
        const agregarRequest = recteasStore.add(nuevaReceta);

        agregarRequest.onsuccess = () =>{
            console.log('Receta medica guardad exitosamente');
        };
        agregarRequest.onerror = (error) => {
            if (error.target.error.name == "ConstraintError") {
              console.log("Error: Ya existe una receta con este número de identificación.");
            } else {
              console.log("Error desconocido:", error.target.error.name);
        }
    }
}
}

document.getElementById("btnGuardarDiagnostico").addEventListener("click", (event) =>{
    event.preventDefault();
    const formularioRecetas= document.querySelector("#formularioCitas");
    const frmData = new FormData(agregarCita);

    agregarCita(
        frmData.get('cedulaPaciente'),
        frmData.get('sintomasPaciente'),
        frmData.get('diagnosticoPaciente'),
        frmData.get('medicamentoPaciente'),
        frmData.get('dosisPaciente'),
        frmData.get('tratamientoPaciente')
    );
})

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los elementos del DOM
    const btnAgregar = document.getElementById('btnAgregar');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const tablaMedicamentos = document.getElementsByClassName('contAbla')[0];

    // Función para agregar una nueva fila a la tabla
    btnAgregar.addEventListener('click', function(event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del botón

        // Crear una nueva fila
        const newRow = document.createElement('tr');

        // Crear y agregar celdas con inputs y botón de borrar
        newRow.innerHTML = `
            <td><input type="text" class="frm"></td>
            <td><input type="text" class="frm"></td>
            <td><input type="text" class="frm"></td>
            <td><button type="button" class="borrar">Borrar</button></td>
        `;

        // Agregar la nueva fila a la tabla
        tablaMedicamentos.appendChild(newRow);

        // Asignar evento al botón de borrar de la nueva fila
        newRow.querySelector('.borrar').addEventListener('click', function() {
            tablaMedicamentos.removeChild(newRow);
        });
    });

    // Función para limpiar todos los campos de input
    btnLimpiar.addEventListener('click', function(event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del botón
        // Seleccionar todos los inputs y establecer su valor a vacío
        for (let i = tablaMedicamentos.children.length-1  ; i > 0;i--) {
            tablaMedicamentos.removeChild(tablaMedicamentos.children[i]);
        }
        tablaMedicamentos.children[0].querySelectorAll("td>input").forEach( elemento =>{
            elemento.value = ""
        })

        // Seleccionar todos los inputs y establecer su valor a vacío
        const inputs = document.querySelectorAll('.contDt input');
        inputs.forEach(input => input.value = '');
    });
});