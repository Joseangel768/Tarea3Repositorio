document.addEventListener('DOMContentLoaded', () => {
    const urlCitas = "https://localhost:7060/api/Cita/ObtenerTodasLasCitas";
    const urlUsuarios = "https://localhost:7060/api/Usuario/GetAllUsuarios";
    const urlDoctorescitas = "https://localhost:7060/api/Doctor/ObtenerTodosLosDoctores";
    const urlEspecialidadescitas = "https://localhost:7060/api/Especialidades/GetEspecialidades";
    const urlFiltrarCitas = "https://localhost:7060/api/Citas/FiltrarCitas";

    const contenedorCitas = document.querySelector('#Citas tbody');
    const selectDoctor = document.getElementById('DoctorCita');
    const selectEspecialidad = document.getElementById('EspecialidadCita');
    const selectUsuario = document.getElementById('UsuarioCita');
    const inputFecha = document.getElementById('FechaCita');

    // Función para mostrar citas
    const mostrarCitas = (citas) => {
        let resultadosCitas = '';
        citas.forEach(cita => {
            resultadosCitas += `<tr>
                                <td>${cita.nombrePaciente}</td>
                                <td>${new Date(cita.fecha).toLocaleString()}</td>
                                <td>${cita.nombreDoctor}</td>
                                <td>${cita.especialidad}</td>
                                <td>${cita.nombrePaciente}</td>
                            </tr>`;
        });
        contenedorCitas.innerHTML = resultadosCitas;
    };

    // Llenar listas desplegables
    const llenarSelect = (url, selectElement) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                selectElement.innerHTML = `<option value="">Seleccionar...</option>`;
                data.forEach(item => {
                    selectElement.innerHTML += `<option value="${item.citaId}">${item.nombreDoctor}</option>`;
                });
            })
            .catch(error => console.log(error));
    };

    const cargarDatosIniciales = () => {
        llenarSelect(urlDoctorescitas, selectDoctor);
        llenarSelect(urlEspecialidadescitas, selectEspecialidad);
        llenarSelect(urlUsuarios, selectUsuario);

        // Cargar todas las citas al inicio
        fetch(urlCitas)
            .then(response => response.json())
            .then(data => mostrarCitas(data))
            .catch(error => console.log(error));
    };

    // Filtrar citas
    document.getElementById('formFiltrarCitas').addEventListener('submit', (e) => {
        e.preventDefault();
        const doctorId = selectDoctor.value;
        const especialidadId = selectEspecialidad.value;
        const fecha = inputFecha.value;
        const usuarioId = selectUsuario.value;

        fetch(`https://localhost:7060/api/Cita/ObtenerTodasLasCitas`)
            .then(response => response.json())
            .then(data => mostrarCitas(data))
            .catch(error => console.log(error));
    });

    cargarDatosIniciales();
});
