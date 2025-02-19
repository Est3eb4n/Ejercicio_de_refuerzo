//*********************************************************************************************/
//******************************** CRACION DE LA BASE DE DATOS ********************************/
//*********************************************************************************************/

export function initBD() {
    const openBD = window.indexedDB.open('clinica', 1);

    openBD.onupgradeneeded = (event) => {
        let clinicaBD = event.target.result;

        clinicaBD.onerror = () => {
            console.error('Error cargando la base de datos');
        };
        if (!clinicaBD.objectStoreNames.contains('usuario')) {
            let table = clinicaBD.createObjectStore('usuario', { keyPath: 'docMedico' });
            table.createIndex('docMedico', 'docMedico', { unique: true }); // Asegurar que el documento sea único
        }
    };

    openBD.onerror = () => {
        console.error('Error abriendo la base de datos');
    };

    openBD.onsuccess = () => {
        console.log('Base de datos abierta correctamente');
    };
}