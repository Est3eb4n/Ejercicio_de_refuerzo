//*********************************************************************************************/
//******************************** CRACION DE LA BASE DE DATOS ********************************/
//*********************************************************************************************/

const tablaUsuarios = 'usuarios'
const tablaPacientes = 'pacientes'
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
   };

   openDB.onerror = () => {
       console.error('Error abriendo la base de datos', evet.target.error);
   };

   openDB.onsuccess = () => {
       console.log('Base de datos abierta correctamente');
   };
}

//**********************************************************************************************/
//*************************************** AGEGAR PACIENTE **************************************/
//**********************************************************************************************/

function agregarPaciente(cedulaPaciente, nombrePaciente, apellidoPaciente, fechaPaciente, generoPaciente, imagenPaciente){
    const openDB = window.indexedDB.open('clinica',1)
    openDB.onerror = () => console.error('Error abriendo la base de datos');

    openDB.onsuccess = () => {
        let registroPacientes = openDB.result;

        if(!registroPacientes.objectStoreNames.contains(tablaPacientes)){
            console.error('El almacen de objetos "tablaPacientes no existe');
            return;
        }
       const transaction = registroPacientes.transaction([tablaPacientes], "readwrite");
       const pacientesStore = transaction.objectStore(tablaPacientes);
       const nuevoPaciente = {cedulaPaciente, nombrePaciente, apellidoPaciente, fechaPaciente, generoPaciente, imagenPaciente};
       const agregarRequest = pacientesStore.add(nuevoPaciente);

       agregarRequest.onsuccess = () => {
        console.log("Paciente creado correctamente")
       };
       agregarRequest.onerror = (error) => {
        if(error.target.name == "ConstaintError"){
            console.log("Error: El documento del paciente ya está registrado.")
        }else{
            console.log("Error desconocido", error, target. name);
        }
       };
    };
}

const cargarPaciente = document.querySelector("#formularioPacientes");
const btnGuardarPaciente = document.getElementById("btnPaciente");

btnGuardarPaciente.addEventListener("click",(event) =>{
    event.preventDefault();

    const frmData = new FormData(cargarPaciente);

    agregarPaciente(
        frmData.get("cedulaPaciente"),
        frmData.get("nombrePaciente"),
        frmData.get("apellidoPaciente"),
        frmData.get("fechaPaciente"),
        frmData.get("generoPaciente"),
        frmData.get("imagenPaciente"),
    );
})