document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const usuarioID = params.get('usuarioID');

    console.log('ID de usuario obtenido:',usuarioID);

    if (!usuarioID) {
        console.error("No se encontró el ID del doctor en la URL");
        return;
    }


    const urlBaseCitas = `https://localhost:7060/api/Citas/CitasDoctor?id=${usuarioID}`;
    const contenedorCitas = document.querySelector('#CitasDoctor tbody');
    let resultadosCitas = '';

    // Función para mostrar las citas del doctor
    const mostrarCitasDoctor = (citas) => {
        
        citas.forEach(cita => {
            resultadosCitas += `
                <tr class="text-center">
                    <td>${cita.citaId}</td>
                    <td>${new Date(cita.fecha).toLocaleString()}</td>
                    <td>${cita.nombrePaciente}</td>
                    <td>${cita.especialidad}</td>
                    <td>${cita.estado}</td>
                </tr>
            `;
        });
        contenedorCitas.innerHTML = resultadosCitas;
    };

    // Mostrar todas las citas del doctor al cargar la página
    fetch(`https://localhost:7060/api/Cita/ObtenerCitasPorDoctor?doctorId=${usuarioID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => mostrarCitasDoctor(data))
        .catch(error => console.error('Error fetching citas:', error));

    // Filtrar citas del doctor
    const formFiltrarCitas = document.querySelector('#formFiltrarCitas');
    formFiltrarCitas.addEventListener('submit', (e) => {
        e.preventDefault();
        const fecha = document.getElementById('FechaCita').value;
        const especialidad = document.getElementById('EspecialidadCita').value;
        const estado = document.getElementById('EstadoCita').value;

        fetch(`${urlBaseCitas}&fecha=${fecha}&especialidad=${especialidad}&estado=${estado}`)
            .then(response => response.json())
            .then(data => {
                resultadosCitas = '';
                mostrarCitasDoctor(data);
            })
            .catch(error => console.log(error));
        ModalFiltrarCitas.hide();
    });
});
