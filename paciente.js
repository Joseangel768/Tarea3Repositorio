document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const usuarioID = params.get('usuarioID');

    console.log('ID de usuario obtenido:', usuarioID);

    if (!usuarioID) {
        console.error("No se encontró el ID del usuario en la URL");
        return;
    }

    const urlBaseCitas = 'https://localhost:7060/api/Citas';
    const urlDoctores = 'https://localhost:7060/api/Doctores';
    const urlEspecialidades = 'https://localhost:7060/api/Especialidades';
    const contenedorCitas = document.querySelector('#Citas tbody');
    const modalCrearCita = new bootstrap.Modal(document.getElementById('ModalCrearCita'));
    const modalFiltrarCitas = new bootstrap.Modal(document.getElementById('ModalFiltrarCitas'));
    const formCitas = document.getElementById('formCitas');
    const formFiltrarCitas = document.getElementById('formFiltrarCitas');

    const obtenerCitas = () => {
        fetch(`https://localhost:7060/api/Cita/ObtenerCitasPorUsuario/`+usuarioID)
            .then(response => response.json())
            .then(citas => mostrarCitas(citas))
            .catch(error => console.error('Error fetching citas:', error));
    };

    const mostrarCitas = (citas) => {
        contenedorCitas.innerHTML = '';
        citas.forEach(cita => {
            contenedorCitas.innerHTML += `
                <tr>
                    <td>${cita.citaId}</td>
                    <td>${new Date(cita.fecha).toLocaleString()}</td>
                    <td>${cita.nombreDoctor}</td>
                    <td>${cita.especialidad}</td>
                    <td>
                        <button class="btn btn-primary btn-sm btnEditarCita" data-id="${cita.citaId}">Editar</button>
                        <button class="btn btn-danger btn-sm btnEliminarCita" data-id="${cita.citaId}">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    };

    const obtenerOpciones = () => {
        fetch(`${urlDoctores}/ObtenerTodosLosDoctores`)
            .then(response => response.json())
            .then(doctores => llenarSelect('#DoctorCita', doctores))
            .catch(error => console.error('Error fetching doctores:', error));
        
        fetch(`https://localhost:7060/api/Especialidades/GetEspecialidades`)
            .then(response => response.json())
            .then(especialidades => llenarSelect('#EspecialidadCita', especialidades))
            .catch(error => console.error('Error fetching especialidades:', error));
    };

    const llenarSelect = (selector, opciones) => {
        const select = document.querySelector(selector);
        select.innerHTML = opciones.map(opcion => `<option value="${opcion.id}">${opcion.nombre}</option>`).join('');
    };

    const mostrarModalCrear = (modo, cita = {}) => {
        document.getElementById('FechaCita').value = cita.fecha || '';
        document.getElementById('DoctorCita').value = cita.doctorId || '';
        document.getElementById('EspecialidadCita').value = cita.especialidadId || '';
        document.getElementById('citaId').value = cita.citaId || '';
        modalCrearCita.show();
    };

    const ocultarModalCrear = () => {
        modalCrearCita.hide();
    };

    const crearCita = (cita) => {
        fetch(`${urlBaseCitas}/CrearCita`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cita)
        })
        .then(response => response.json())
        .then(() => {
            obtenerCitas();
            ocultarModalCrear();
        })
        .catch(error => console.error('Error creating cita:', error));
    };

    const editarCita = (id) => {
        fetch(`${urlBaseCitas}/EditarCita/${id}`)
            .then(response => response.json())
            .then(cita => mostrarModalCrear('editar', cita))
            .catch(error => console.error('Error fetching cita:', error));
    };

    const actualizarCita = (cita) => {
        fetch(`${urlBaseCitas}/ActualizarCita/${cita.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cita)
        })
        .then(response => response.json())
        .then(() => {
            obtenerCitas();
            ocultarModalCrear();
        })
        .catch(error => console.error('Error updating cita:', error));
    };

    const eliminarCita = (id) => {
        alertify.confirm("¿Estás seguro de que deseas eliminar esta cita?",
            function(){
                fetch(`https://localhost:7060/api/Cita/CancelarCita/`+id, {
                    method: 'DELETE'
                })
                .then(() => {
                    obtenerCitas();
                    alertify.success('Cita eliminada');
                })
                .catch(error => console.error('Error deleting cita:', error));
            },
            function(){
                alertify.error('Cancelado');
            }
        );
    };

    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('btnEditarCita')) {
            const id = e.target.getAttribute('data-id');
            editarCita(id);
        }
        if (e.target && e.target.classList.contains('btnEliminarCita')) {
            const id = e.target.getAttribute('data-id');
            eliminarCita(id);
        }
    });

    formCitas.addEventListener('submit', (e) => {
        e.preventDefault();
        const cita = {
            id: document.getElementById('citaId').value,
            fecha: document.getElementById('FechaCita').value,
            doctorId: document.getElementById('DoctorCita').value,
            especialidadId: document.getElementById('EspecialidadCita').value
        };

        if (cita.id) {
            actualizarCita(cita);
        } else {
            crearCita(cita);
        }
    });

    formFiltrarCitas.addEventListener('submit', (e) => {
        e.preventDefault();
        const filtros = {
            doctorId: document.getElementById('DoctorFiltrar').value,
            especialidadId: document.getElementById('EspecialidadFiltrar').value,
            fecha: document.getElementById('FechaFiltrar').value
        };
        filtrarCitas(filtros);
        modalFiltrarCitas.hide();
    });

    document.getElementById('btnCrearCita').addEventListener('click', () => {
        obtenerOpciones();
        mostrarModalCrear('crear');
    });

    obtenerCitas();
});
