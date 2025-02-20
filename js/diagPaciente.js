//*********************************************************************************************/
//******************************** CRACION DE LA BASE DE DATOS ********************************/
//*********************************************************************************************/

const tablaUsuarios = 'usuarios'
const tablaPacientes = 'pacientes'
const tablaRecetas = 'recetas'
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
        let table = clinicaDB.createObjectStore(tablaRecetas,{keyPath: 'recteaMedica'});
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

function agregarReceta(cedulaPaciente, sintomasPaciente, diagnosticoPaciente, medicamentoPaciente, dosisPaciente, tratamientoPaciente){
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

const formularioRecetas= document.querySelector("#formularioReceta");
const btnGuardarReceta = document.getElementById("btnGuardarReceta");

btnGuardarReceta.addEventListener("click", (event) =>{
    event.preventDefault();

    const frmData = new FormData(agregarReceta);

    agregarReceta(
        frmData.get('cedulaPaciente'),
        frmData.get('sintomasPaciente'),
        frmData.get('diagnosticoPaciente'),
        frmData.get('medicamentoPaciente'),
        frmData.get('dosisPaciente'),
        frmData.get('tratamientoPaciente')
    );
})