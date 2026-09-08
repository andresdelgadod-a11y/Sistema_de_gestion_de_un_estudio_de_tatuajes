const CLAVE_STORAGE_CITAS = 'citas_estudio';
const CLAVE_STORAGE_CLIENTES = 'clientes_estudio';
const CLAVE_STORAGE_TATUADORES = 'tatuadores_estudio';
const CLAVE_STORAGE_DISENOS = 'disenos_tatuajes';

const formCita = document.getElementById('form-cita');
const idCitaInput = document.getElementById('id-cita');
const clienteSelect = document.getElementById('cliente');
const tatuadorSelect = document.getElementById('tatuador');
const disenoSelect = document.getElementById('diseno');
const fechaInput = document.getElementById('fecha');
const horaInput = document.getElementById('hora');
const estadoInput = document.getElementById('estado');
const notasInput = document.getElementById('notas');
const listaCitasDiv = document.getElementById('lista-citas');
const tituloFormCita = document.getElementById('titulo-form-cita');
const btnCancelarCita = document.getElementById('btn-cancelar-cita');

document.addEventListener('DOMContentLoaded', function() {
    cargarSelects();
    cargarCitas();
});

function cargarSelects() {
    const clientes = leerDeLocalStorage(CLAVE_STORAGE_CLIENTES);
    const tatuadores = leerDeLocalStorage(CLAVE_STORAGE_TATUADORES);
    const disenos = leerDeLocalStorage(CLAVE_STORAGE_DISENOS);

    clienteSelect.innerHTML = '<option value="">Selecciona un cliente</option>' +
        clientes.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');

    tatuadorSelect.innerHTML = '<option value="">Selecciona un tatuador</option>' +
        tatuadores.map(t => `<option value="${t.id}">${t.nombre}</option>`).join('');

    disenoSelect.innerHTML = '<option value="">Sin diseño asociado</option>' +
        disenos.map(d => `<option value="${d.id}">${d.nombre}</option>`).join('');

    if (clientes.length === 0) {
        clienteSelect.innerHTML = '<option value="">No hay clientes registrados</option>';
    }
    if (tatuadores.length === 0) {
        tatuadorSelect.innerHTML = '<option value="">No hay tatuadores registrados</option>';
    }
}

formCita.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!clienteSelect.value || !tatuadorSelect.value) {
        alert('Debes registrar al menos un cliente y un tatuador antes de agendar una cita.');
        return;
    }

    const id = idCitaInput.value;
    const cita = {
        id: id || generarId(),
        clienteId: clienteSelect.value,
        tatuadorId: tatuadorSelect.value,
        disenoId: disenoSelect.value || null,
        fecha: fechaInput.value,
        hora: horaInput.value,
        estado: estadoInput.value,
        notas: notasInput.value.trim()
    };

    let citas = leerDeLocalStorage(CLAVE_STORAGE_CITAS);
    if (id) {
        citas = citas.map(c => c.id === id ? cita : c);
    } else {
        citas.push(cita);
    }

    guardarEnLocalStorage(CLAVE_STORAGE_CITAS, citas);
    reiniciarFormularioCita();
    cargarCitas();
});

btnCancelarCita.addEventListener('click', reiniciarFormularioCita);

function obtenerNombreCliente(id) {
    const clientes = leerDeLocalStorage(CLAVE_STORAGE_CLIENTES);
    const cliente = clientes.find(c => c.id === id);
    return cliente ? cliente.nombre : 'Cliente no encontrado';
}

function obtenerNombreTatuador(id) {
    const tatuadores = leerDeLocalStorage(CLAVE_STORAGE_TATUADORES);
    const tatuador = tatuadores.find(t => t.id === id);
    return tatuador ? tatuador.nombre : 'Tatuador no encontrado';
}

function obtenerNombreDiseno(id) {
    if (!id) return 'Sin diseño asociado';
    const disenos = leerDeLocalStorage(CLAVE_STORAGE_DISENOS);
    const diseno = disenos.find(d => d.id === id);
    return diseno ? diseno.nombre : 'Diseño no encontrado';
}

function claseEstado(estado) {
    switch (estado) {
        case 'Confirmada': return 'estado-confirmada';
        case 'Completada': return 'estado-completada';
        case 'Cancelada': return 'estado-cancelada';
        default: return 'estado-pendiente';
    }
}

function cargarCitas() {
    let citas = leerDeLocalStorage(CLAVE_STORAGE_CITAS);
    listaCitasDiv.innerHTML = '';

    if (citas.length === 0) {
        listaCitasDiv.innerHTML = '<p class="sin-datos">No hay citas agendadas.</p>';
        return;
    }

    citas = citas.slice().sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));

    citas.forEach(c => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'item';
        tarjeta.innerHTML = `
            <h3>${obtenerNombreCliente(c.clienteId)} <span class="badge-estado ${claseEstado(c.estado)}">${c.estado}</span></h3>
            <p><strong>Tatuador:</strong> ${obtenerNombreTatuador(c.tatuadorId)}</p>
            <p><strong>Diseño:</strong> ${obtenerNombreDiseno(c.disenoId)}</p>
            <p><strong>Fecha:</strong> ${c.fecha} &nbsp; <strong>Hora:</strong> ${c.hora}</p>
            <p><strong>Notas:</strong> ${c.notas || 'Sin notas'}</p>
            <button class="boton boton-editar" onclick="editarCita('${c.id}')">✏️ Editar</button>
            <button class="boton boton-eliminar" onclick="eliminarCita('${c.id}')">🗑️ Eliminar</button>
        `;
        listaCitasDiv.appendChild(tarjeta);
    });
}

window.editarCita = function(id) {
    const citas = leerDeLocalStorage(CLAVE_STORAGE_CITAS);
    const cita = citas.find(c => c.id === id);
    if (!cita) return;
    cargarSelects();
    idCitaInput.value = cita.id;
    clienteSelect.value = cita.clienteId;
    tatuadorSelect.value = cita.tatuadorId;
    disenoSelect.value = cita.disenoId || '';
    fechaInput.value = cita.fecha;
    horaInput.value = cita.hora;
    estadoInput.value = cita.estado;
    notasInput.value = cita.notas || '';
    tituloFormCita.textContent = 'Editar Cita';
    btnCancelarCita.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.eliminarCita = function(id) {
    if (!confirm('¿Seguro que deseas eliminar esta cita?')) return;
    let citas = leerDeLocalStorage(CLAVE_STORAGE_CITAS);
    citas = citas.filter(c => c.id !== id);
    guardarEnLocalStorage(CLAVE_STORAGE_CITAS, citas);
    cargarCitas();
};

function reiniciarFormularioCita() {
    formCita.reset();
    idCitaInput.value = '';
    cargarSelects();
    tituloFormCita.textContent = 'Agendar Nueva Cita';
    btnCancelarCita.style.display = 'none';
}