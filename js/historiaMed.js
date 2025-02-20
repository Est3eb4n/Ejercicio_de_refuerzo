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
//******************************** OBTENCION Y MUESTRA DE DATOS *******************************/
//*********************************************************************************************/


const btnGenerarHistoria = document.getElementById('btnGenerarHistoria');
const historialMedico = document.getElementById('historialMedico');

function obtenerDatos(){
  const openDB = window.indexedDB.open('clinica', 1);

  openDB.onerror = () => console.error('Error abriendo la base de datos');

  openDB.onsuccess = () => {
    
    const documentoPaciente = document.getElementById('documentoPaciente').value;

    let datosPaciente;
    let datosReceta;

    let clinicaDB = openDB.result;

    const transaction = clinicaDB.transaction([tablaPacientes, tablaRecetas], 'readonly');
    const storePacientes = transaction.objectStore(tablaPacientes)
    const storeRecetas = transaction.objectStore(tablaRecetas)
    const requestPacientes = storePacientes.getAll();
    const requestRecetas = storeRecetas.getAll();

    requestPacientes.onsuccess = function (event){
      let datos = event.target.result;

      for(const pacientes of datos){
        if(pacientes.cedulaPaciente == documentoPaciente){
          datosPaciente = pacientes;
          break;
        }
      };

      requestRecetas.onsuccess = function(event){
        let datos = event.target.result;

        for (const recetas of datos){
          if(recetas.cedulaPaciente == documentoPaciente){
            datosReceta = recetas;
            break;
          }
        };

        console.log('Datos obtenidos correctamente', datos);
        mostarDatosEnTabla(datos);
      };

      requestPacientes.onerror = function(event){
        console.error('Error al obtener los datos',event.target.errorCode);
      };
    }
  }
}

function mostarDatosEnTabla(datos){
  const table = document.querySelector('#historialMedico')
  let tbody = table.querySelector('tbody');

  if(tbody){
    tbody.innerHTML = '';
  }else{
    tbody = document.createElement('tbody')
    table.appendChild(tbody);
  }

  datos.forEach(pacientes => {
    row.innerHTML = `
    <td>${pacientes.sintomasPaciente}</td>
    <td>${pacientes.diagnosticoPaciente}</td>
    <td>${pacientes.medicamentoPaciente}</td>
    <td>${pacientes.dosisPaciente}</td>
    <td>${pacientes.tratamientoPaciente}</td>
    `;
    tbody.appendChild(row)
  });
}



class MiHistorial extends HTMLElement{
  constructor(){
    super();
    this.innerHTML=`
    <div class="contHistory">
    <table>
        <tbody id="historialMedico">
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>  
        </tbody>
    </table>
    </div>
    
    `;
  }
}

customElements.define('mi-historial',MiHistorial);

btnGenerarHistoria.addEventListener('click',(event) =>{
  event.preventDefault();

  historialMedico.innerHTML = '';
  historialMedico.innerHTML = `<mi-historial></mi-historial>`;

  obtenerDatos();
})