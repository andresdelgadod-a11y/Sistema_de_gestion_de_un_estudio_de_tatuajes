const CLAVE_STORAGE_CLIENTES = 'clientes_estudio';

const formCliente = document.getElementById('form-cliente');
const idClienteInput = document.getElementById('id-cliente');
const nombreClienteInput = document.getElementById('nombre');
const telefonoInput = document.getElementById('telefono');
const correoInput = document.getElementById('correo');
const fechaNacimientoInput = document.getElementById('fechaNacimiento');
const notasInput = document.getElementById('notas');
const listaClientesDiv = document.getElementById('lista-clientes');
const tituloFormCliente = document.getElementById('titulo-form-cliente');
const btnCancelarCliente = document.getElementById('btn-cancelar-cliente');

document.addEventListener('DOMContentLoaded', cargarClientes);

formCliente.addEventListener('submit', function(e) {
    e.preventDefault();
    const id = idClienteInput.value;
    const cliente = {
        id: id || generarId(),
        nombre: nombreClienteInput.value.trim(),
        telefono: telefonoInput.value.trim(),
        correo: correoInput.value.trim(),
        fechaNacimiento: fechaNacimientoInput.value,
        notas: notasInput.value.trim()
    };

    let clientes = leerDeLocalStorage(CLAVE_STORAGE_CLIENTES);
    if (id) {
        clientes = clientes.map(c => c.id === id ? cliente : c);
    } else {
        clientes.push(cliente);
    }

    guardarEnLocalStorage(CLAVE_STORAGE_CLIENTES, clientes);
    reiniciarFormularioCliente();
    cargarClientes();
});

btnCancelarCliente.addEventListener('click', reiniciarFormularioCliente);

function cargarClientes() {
    const clientes = leerDeLocalStorage(CLAVE_STORAGE_CLIENTES);
    listaClientesDiv.innerHTML = '';
    if (clientes.length === 0) {
        listaClientesDiv.innerHTML = '<p class="sin-datos">No hay clientes registrados.</p>';
        return;
    }
    clientes.forEach(c => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'item';
        tarjeta.innerHTML = `
            <h3>${c.nombre}</h3>
            <p><strong>Teléfono:</strong> ${c.telefono}</p>
            <p><strong>Correo:</strong> ${c.correo}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${c.fechaNacimiento || 'No registrada'}</p>
            <p><strong>Notas:</strong> ${c.notas || 'Sin notas'}</p>
            <button class="boton boton-editar" onclick="editarCliente('${c.id}')">✏️ Editar</button>
            <button class="boton boton-eliminar" onclick="eliminarCliente('${c.id}')">🗑️ Eliminar</button>
        `;
        listaClientesDiv.appendChild(tarjeta);
    });
}

window.editarCliente = function(id) {
    const clientes = leerDeLocalStorage(CLAVE_STORAGE_CLIENTES);
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return;
    idClienteInput.value = cliente.id;
    nombreClienteInput.value = cliente.nombre;
    telefonoInput.value = cliente.telefono;
    correoInput.value = cliente.correo;
    fechaNacimientoInput.value = cliente.fechaNacimiento || '';
    notasInput.value = cliente.notas || '';
    tituloFormCliente.textContent = 'Editar Cliente';
    btnCancelarCliente.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.eliminarCliente = function(id) {
    if (!confirm('¿Seguro que deseas eliminar este cliente?')) return;
    let clientes = leerDeLocalStorage(CLAVE_STORAGE_CLIENTES);
    clientes = clientes.filter(c => c.id !== id);
    guardarEnLocalStorage(CLAVE_STORAGE_CLIENTES, clientes);
    cargarClientes();
};

function reiniciarFormularioCliente() {
    formCliente.reset();
    idClienteInput.value = '';
    tituloFormCliente.textContent = 'Agregar Nuevo Cliente';
    btnCancelarCliente.style.display = 'none';
}