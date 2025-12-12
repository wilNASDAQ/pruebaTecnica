const URL_PRODUCTOS = "/productos";
const URL_CATEGORIAS = "/categorias";

const formCrear = document.getElementById("formCrear");
const tbodyProductos = document.getElementById("tbodyProductos");
const filterText = document.getElementById("filterText");
const btnReset = document.getElementById("btnReset");

const modal = document.getElementById("modal");
const formEditar = document.getElementById("formEditar");
const selectEditarCategoria = document.getElementById("selectEditarCategoria");
const btnCerrarModal = document.getElementById("btnCerrarModal");

const toastContainer = document.getElementById("toastContainer");

let currentPage = 1;
let rowsPerPage = 5;

let productos = [];
let categorias = [];
let editingId = null;

/*
   FUNCIÓN PARA FORMATEAR NÚMEROS
*/
function formatearNumero(numero) {
    return numero.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/*
   INIT
*/
document.addEventListener("DOMContentLoaded", () => {
    loadCategorias().then(populateSelects);
    loadProductos();

    formCrear.addEventListener("submit", onCrearProducto);
    filterText.addEventListener("input", () => {
        currentPage = 1;
        renderTable();
    });
    btnReset.addEventListener("click", () => {
        filterText.value = "";
        currentPage = 1;
        renderTable();
    });

    btnCerrarModal.addEventListener("click", closeModal);
    formEditar.addEventListener("submit", onSubmitEditar);
});

/*
          TOAST
*/
function showToast(message, type = "error") {
    const div = document.createElement("div");
    div.className = `toast ${type}`;
    div.textContent = message;
    toastContainer.appendChild(div);
    setTimeout(() => div.remove(), 4000);
}

/*
        CATEGORÍAS
*/
async function loadCategorias() {
    try {
        const res = await fetch(URL_CATEGORIAS);
        categorias = await res.json();
    } catch {
        categorias = [];
        showToast("Error cargando categorías");
    }
}

function populateSelects() {
    const crear = document.getElementById("crearCategoria");
    crear.innerHTML = `<option value="">-- Sin categoría --</option>`;
    selectEditarCategoria.innerHTML = crear.innerHTML;

    categorias.forEach(c => {
        crear.innerHTML += `<option value="${c.idCategoria}">${c.nombre}</option>`;
        selectEditarCategoria.innerHTML += `<option value="${c.idCategoria}">${c.nombre}</option>`;
    });
}

/*
          PRODUCTOS
*/
async function loadProductos() {
    try {
        const res = await fetch(URL_PRODUCTOS);
        productos = await res.json();
        renderTable();
    } catch {
        productos = [];
        showToast("Error cargando productos");
        renderTable();
    }
}

function renderTable() {
    const q = filterText.value.toLowerCase().trim();
    const list = productos.filter(p =>
        (!q) || p.codigo.toLowerCase().includes(q) || p.nombre.toLowerCase().includes(q)
    );

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageItems = list.slice(start, end);

    tbodyProductos.innerHTML = pageItems.length === 0
        ? `<tr><td colspan="7" style="text-align:center;">Sin productos</td></tr>`
        : pageItems.map(p => `
            <tr>
                <td>${p.idProducto}</td>
                <td>${p.codigo}</td>
                <td>${p.nombre}</td>
                <td>${p.marca || "-"}</td>
                <td>${p.categoria?.nombre || "-"}</td>
                <td>$${formatearNumero(p.precio)}</td>
                <td>
                    <button class="action-btn edit" onclick="abrirEditar(${p.idProducto})">Editar</button>
                    <button class="action-btn del" onclick="eliminarProducto(${p.idProducto})">Eliminar</button>
                </td>
            </tr>
        `).join("");

    renderPagination(list.length);
}

function renderPagination(total) {
    const container = document.getElementById("pagination");
    const pages = Math.ceil(total / rowsPerPage);

    if (pages <= 1) {
        container.innerHTML = "";
        return;
    }

    let html = '';
    html += `<button ${currentPage === 1 ? "disabled" : ""} onclick="goPage(${currentPage - 1})">‹</button>`;

    for (let i = 1; i <= pages; i++) {
        html += `<button class="${i === currentPage ? 'active-page' : ''}" onclick="goPage(${i})">${i}</button>`;
    }

    html += `<button ${currentPage === pages ? "disabled" : ""} onclick="goPage(${currentPage + 1})">›</button>`;
    container.innerHTML = html;
}

function goPage(n) {
    if (n < 1) n = 1;
    currentPage = n;
    renderTable();
}

/*
        CREAR PRODUCTO
*/
async function onCrearProducto(e) {
    e.preventDefault();

    const payload = {
        codigo: document.getElementById("crearCodigo").value.trim(),
        nombre: document.getElementById("crearNombre").value.trim(),
        marca: document.getElementById("crearMarca").value.trim(),
        descripcion: document.getElementById("crearDescripcion").value.trim(),
        precio: parseFloat(document.getElementById("crearPrecio").value),
        categoria: document.getElementById("crearCategoria").value ? {idCategoria: parseInt(document.getElementById("crearCategoria").value)} : null
    };

    try {
        const res = await fetch(URL_PRODUCTOS, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const text = await res.text();
            showToast(text);
            return;
        }

        formCrear.reset();
        await loadProductos();
        showToast("Producto creado con éxito", "success");
    } catch {
        showToast("Error de conexión");
    }
}

/*
   MODAL EDITAR
*/
async function abrirEditar(id) {
    editingId = id;

    const res = await fetch(`${URL_PRODUCTOS}/id/${id}`);
    const p = await res.json();

    formEditar.codigo.value = p.codigo;
    formEditar.nombre.value = p.nombre;
    formEditar.marca.value = p.marca;
    formEditar.descripcion.value = p.descripcion;
    formEditar.precio.value = p.precio;
    formEditar.categoria.value = p.categoria?.idCategoria || "";

    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
    editingId = null;
}

/*
   EDITAR
*/
async function onSubmitEditar(e) {
    e.preventDefault();

    const payload = {
        codigo: formEditar.codigo.value.trim(),
        nombre: formEditar.nombre.value.trim(),
        marca: formEditar.marca.value.trim(),
        descripcion: formEditar.descripcion.value.trim(),
        precio: parseFloat(formEditar.precio.value),
        categoria: formEditar.categoria.value ? {idCategoria: parseInt(formEditar.categoria.value)} : null
    };

    const res = await fetch(`${URL_PRODUCTOS}/${editingId}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const text = await res.text();
        showToast(text);
        return;
    }

    closeModal();
    await loadProductos();
    showToast("Producto editado con éxito", "success");
}

/*
   ELIMINAR
*/
async function eliminarProducto(id) {
    if (!confirm("SEGURO QUE QUIERES ELIMINAR ESTE PRODUCTO?")) return;

    const res = await fetch(`${URL_PRODUCTOS}/${id}`, {method: "DELETE"});
    if (!res.ok) {
        const text = await res.text();
        showToast(text);
        return;
    }
    await loadProductos();
    showToast("Producto eliminado", "success");
}