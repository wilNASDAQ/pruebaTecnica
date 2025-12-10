// Configuración
const API_URL = 'http://localhost:8080';

// Estado de la aplicación
let tabActual = 'productos';
let productos = [];
let categorias = [];
let modalTipo = 'create';
let itemEditando = null;
let itemAEliminar = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();
    cargarProductos();
});

// Cambiar entre tabs
function cambiarTab(tab) {
    tabActual = tab;

    // Actualizar botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Mostrar tabla correspondiente
    if (tab === 'productos') {
        document.getElementById('tablaProductos').classList.remove('hidden');
        document.getElementById('tablaCategorias').classList.add('hidden');
    } else {
        document.getElementById('tablaProductos').classList.add('hidden');
        document.getElementById('tablaCategorias').classList.remove('hidden');
    }

    document.getElementById('searchInput').value = '';
}

// Cargar Productos
async function cargarProductos() {
    try {
        const response = await fetch(`${API_URL}/productos`);
        if (!response.ok) throw new Error('Error al cargar productos');

        productos = await response.json();
        renderizarProductos(productos);
    } catch (error) {
        mostrarAlerta('Error al cargar productos: ' + error.message, 'error');
        document.getElementById('productosBody').innerHTML =
            '<tr><td colspan="7" class="text-center">Error al cargar datos</td></tr>';
    }
}

// Renderizar productos
function renderizarProductos(listaProductos) {
    const tbody = document.getElementById('productosBody');

    if (listaProductos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay productos para mostrar</td></tr>';
        return;
    }

    tbody.innerHTML = listaProductos.map(p => `
        <tr>
            <td>${p.codigo}</td>
            <td>${p.nombre}</td>
            <td>${p.descripcion}</td>
            <td>${p.marca}</td>
            <td>${p.categoria?.nombre || 'N/A'}</td>
            <td>$${p.precio?.toFixed(2)}</td>
            <td>
                <button class="btn btn-edit" onclick="editarProducto(${p.id})">Editar</button>
                <button class="btn btn-delete" onclick="abrirConfirmEliminar(${p.id}, 'producto')">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// Cargar Categorías
async function cargarCategorias() {
    try {
        const response = await fetch(`${API_URL}/categorias`);
        if (!response.ok) throw new Error('Error al cargar categorías');

        categorias = await response.json();
        renderizarCategorias(categorias);
        actualizarSelectCategorias();
    } catch (error) {
        mostrarAlerta('Error al cargar categorías: ' + error.message, 'error');
        document.getElementById('categoriasBody').innerHTML =
            '<tr><td colspan="5" class="text-center">Error al cargar datos</td></tr>';
    }
}

// Renderizar categorías
function renderizarCategorias(listaCategorias) {
    const tbody = document.getElementById('categoriasBody');

    if (listaCategorias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay categorías para mostrar</td></tr>';
        return;
    }

    tbody.innerHTML = listaCategorias.map(c => `
        <tr>
            <td>${c.codigo}</td>
            <td>${c.nombre}</td>
            <td>${c.descripcion}</td>
            <td>
                <span class="badge ${c.activo ? 'badge-success' : 'badge-danger'}">
                    ${c.activo ? '✓ Activo' : '✗ Inactivo'}
                </span>
            </td>
            <td>
                <button class="btn btn-edit" onclick="editarCategoria(${c.id})">Editar</button>
                <button class="btn btn-delete" onclick="abrirConfirmEliminar(${c.id}, 'categoria')">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// Actualizar select de categorías
function actualizarSelectCategorias() {
    const select = document.getElementById('prodCategoria');
    const categoriasActivas = categorias.filter(c => c.activo);

    select.innerHTML = '<option value="">Seleccione una categoría</option>' +
        categoriasActivas.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
}

// Buscar
function buscar() {
    const termino = document.getElementById('searchInput').value.toLowerCase();

    if (tabActual === 'productos') {
        const filtrados = productos.filter(p =>
            p.nombre.toLowerCase().includes(termino) ||
            p.codigo.toLowerCase().includes(termino)
        );
        renderizarProductos(filtrados);
    } else {
        const filtrados = categorias.filter(c =>
            c.nombre.toLowerCase().includes(termino) ||
            c.codigo.toLowerCase().includes(termino)
        );
        renderizarCategorias(filtrados);
    }
}

// Abrir modal
function abrirModal(tipo) {
    modalTipo = tipo;
    itemEditando = null;

    const modal = document.getElementById('modal');
    const title = document.getElementById('modalTitle');
    const formProducto = document.getElementById('formProducto');
    const formCategoria = document.getElementById('formCategoria');

    // Limpiar formularios
    limpiarFormularios();

    if (tabActual === 'productos') {
        title.textContent = tipo === 'create' ? 'Crear Producto' : 'Editar Producto';
        formProducto.classList.remove('hidden');
        formCategoria.classList.add('hidden');
    } else {
        title.textContent = tipo === 'create' ? 'Crear Categoría' : 'Editar Categoría';
        formProducto.classList.add('hidden');
        formCategoria.classList.remove('hidden');
    }

    modal.classList.remove('hidden');
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modal').classList.add('hidden');
    limpiarFormularios();
    itemEditando = null;
}

// Limpiar formularios
function limpiarFormularios() {
    // Producto
    document.getElementById('prodCodigo').value = '';
    document.getElementById('prodNombre').value = '';
    document.getElementById('prodDescripcion').value = '';
    document.getElementById('prodMarca').value = '';
    document.getElementById('prodCategoria').value = '';
    document.getElementById('prodPrecio').value = '';

    // Categoría
    document.getElementById('catCodigo').value = '';
    document.getElementById('catNombre').value = '';
    document.getElementById('catDescripcion').value = '';
    document.getElementById('catActivo').checked = true;
}

// Editar producto
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    itemEditando = producto;
    modalTipo = 'edit';

    document.getElementById('prodCodigo').value = producto.codigo;
    document.getElementById('prodNombre').value = producto.nombre;
    document.getElementById('prodDescripcion').value = producto.descripcion;
    document.getElementById('prodMarca').value = producto.marca;
    document.getElementById('prodCategoria').value = producto.categoria?.id || '';
    document.getElementById('prodPrecio').value = producto.precio;

    abrirModal('edit');
}

// Editar categoría
function editarCategoria(id) {
    const categoria = categorias.find(c => c.id === id);
    if (!categoria) return;

    itemEditando = categoria;
    modalTipo = 'edit';

    document.getElementById('catCodigo').value = categoria.codigo;
    document.getElementById('catNombre').value = categoria.nombre;
    document.getElementById('catDescripcion').value = categoria.descripcion;
    document.getElementById('catActivo').checked = categoria.activo;

    abrirModal('edit');
}

// Guardar
async function guardar() {
    if (tabActual === 'productos') {
        await guardarProducto();
    } else {
        await guardarCategoria();
    }
}

// Guardar producto
async function guardarProducto() {
    const codigo = document.getElementById('prodCodigo').value.trim();
    const nombre = document.getElementById('prodNombre').value.trim();
    const descripcion = document.getElementById('prodDescripcion').value.trim();
    const marca = document.getElementById('prodMarca').value.trim();
    const categoriaId = document.getElementById('prodCategoria').value;
    const precio = parseFloat(document.getElementById('prodPrecio').value);

    // Validaciones
    if (!codigo || !nombre || !descripcion || !marca || !categoriaId || !precio) {
        mostrarAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if (!/^[A-Za-z0-9]+$/.test(codigo)) {
        mostrarAlerta('El código no puede contener espacios ni caracteres especiales', 'error');
        return;
    }

    if (codigo.length < 4 || codigo.length > 10) {
        mostrarAlerta('El código debe tener entre 4 y 10 caracteres', 'error');
        return;
    }

    if (nombre.length < 4) {
        mostrarAlerta('El nombre debe tener mínimo 4 caracteres', 'error');
        return;
    }

    const producto = {
        codigo,
        nombre,
        descripcion,
        marca,
        precio,
        categoria: { id: parseInt(categoriaId) }
    };

    try {
        const url = modalTipo === 'create'
            ? `${API_URL}/productos`
            : `${API_URL}/productos/${itemEditando.id}`;

        const response = await fetch(url, {
            method: modalTipo === 'create' ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        mostrarAlerta(
            modalTipo === 'create' ? 'Producto creado exitosamente' : 'Producto actualizado exitosamente',
            'success'
        );

        cerrarModal();
        await cargarProductos();
    } catch (error) {
        mostrarAlerta('Error: ' + error.message, 'error');
    }
}

// Guardar categoría
async function guardarCategoria() {
    const codigo = document.getElementById('catCodigo').value.trim();
    const nombre = document.getElementById('catNombre').value.trim();
    const descripcion = document.getElementById('catDescripcion').value.trim();
    const activo = document.getElementById('catActivo').checked;

    // Validaciones
    if (!codigo || !nombre || !descripcion) {
        mostrarAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if (!/^[A-Za-z0-9]+$/.test(codigo)) {
        mostrarAlerta('El código no puede contener espacios ni caracteres especiales', 'error');
        return;
    }

    if (nombre.length < 2) {
        mostrarAlerta('El nombre debe tener mínimo 2 caracteres', 'error');
        return;
    }

    const categoria = { codigo, nombre, descripcion, activo };

    try {
        const url = modalTipo === 'create'
            ? `${API_URL}/categorias`
            : `${API_URL}/categorias/${itemEditando.id}`;

        const response = await fetch(url, {
            method: modalTipo === 'create' ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoria)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        mostrarAlerta(
            modalTipo === 'create' ? 'Categoría creada exitosamente' : 'Categoría actualizada exitosamente',
            'success'
        );

        cerrarModal();
        await cargarCategorias();
    } catch (error) {
        mostrarAlerta('Error: ' + error.message, 'error');
    }
}

// Abrir confirmación de eliminación
function abrirConfirmEliminar(id, tipo) {
    itemAEliminar = { id, tipo };
    document.getElementById('confirmModal').classList.remove('hidden');
}

// Cerrar confirmación
function cerrarConfirmModal() {
    document.getElementById('confirmModal').classList.add('hidden');
    itemAEliminar = null;
}

// Confirmar eliminación
async function confirmarEliminar() {
    if (!itemAEliminar) return;

    const { id, tipo } = itemAEliminar;

    try {
        const url = tipo === 'producto'
            ? `${API_URL}/productos/${id}`
            : `${API_URL}/categorias/${id}`;

        const response = await fetch(url, { method: 'DELETE' });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        mostrarAlerta(`${tipo === 'producto' ? 'Producto' : 'Categoría'} eliminado exitosamente`, 'success');

        cerrarConfirmModal();

        if (tipo === 'producto') {
            await cargarProductos();
        } else {
            await cargarCategorias();
        }
    } catch (error) {
        mostrarAlerta('Error al eliminar: ' + error.message, 'error');
    }
}

// Mostrar alerta
function mostrarAlerta(mensaje, tipo) {
    const alert = document.getElementById('alert');
    const alertMessage = document.getElementById('alertMessage');

    alert.className = `alert ${tipo}`;
    alertMessage.textContent = mensaje;

    setTimeout(() => {
        alert.classList.add('hidden');
    }, 5000);
}

// Cerrar alerta
function closeAlert() {
    document.getElementById('alert').classList.add('hidden');
}