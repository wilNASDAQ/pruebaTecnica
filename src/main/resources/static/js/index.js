// Rutas
const URL_PRODUCTOS = "/productos";
const URL_CATEGORIAS = "/categorias";

/* DOM */
const formCrear = document.getElementById("formCrear");
const msgCrear = document.getElementById("msgCrear");
const tbodyProductos = document.getElementById("tbodyProductos");
const filterText = document.getElementById("filterText");
const btnReset = document.getElementById("btnReset");

const modal = document.getElementById("modal");
const formEditar = document.getElementById("formEditar");
const msgEditar = document.getElementById("msgEditar");
const selectEditarCategoria = document.getElementById("selectEditarCategoria");
const btnCerrarModal = document.getElementById("btnCerrarModal");

let productos = [];
let categorias = [];
let editingId = null;

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
    loadCategorias().then(populateSelects);
    loadProductos();

    formCrear.addEventListener("submit", onCrearProducto);
    filterText.addEventListener("input", renderTable);
    btnReset.addEventListener("click", () => { filterText.value=""; renderTable(); });

    btnCerrarModal.addEventListener("click", closeModal);
    formEditar.addEventListener("submit", onSubmitEditar);

    initLiveValidation();
});

/* ============================
   VALIDACIÓN EN TIEMPO REAL
============================ */

const rules = {
    codigo: v => v.length >= 4 && !v.includes(" "),
    nombre: v => v.length >= 4,
    precio: v => !isNaN(v) && parseFloat(v) > 0
};

function showError(input, msg){
    let box = input.parentElement.querySelector(".input-error");
    if(!box){
        box = document.createElement("div");
        box.className = "input-error";
        input.parentElement.appendChild(box);
    }
    box.textContent = msg;
    input.classList.add("invalid");
}

function clearError(input){
    let box = input.parentElement.querySelector(".input-error");
    if(box) box.textContent = "";
    input.classList.remove("invalid");
}

function initLiveValidation(){
    ["crearCodigo","crearNombre","crearPrecio"].forEach(id => {
        const input = document.getElementById(id);
        const key = id.replace("crear","").toLowerCase();

        input.addEventListener("input", () => {
            const v = input.value.trim();

            if(!rules[key](v)){
                if(key==="codigo") showError(input, "Mínimo 4 caracteres, sin espacios");
                if(key==="nombre") showError(input, "Mínimo 4 caracteres");
                if(key==="precio") showError(input, "Debe ser un número mayor a 0");
            } else {
                clearError(input);
            }
        });
    });
}

function validateCrear(){
    let ok = true;

    const codigo = document.getElementById("crearCodigo");
    const nombre = document.getElementById("crearNombre");
    const precio = document.getElementById("crearPrecio");

    if(!rules.codigo(codigo.value.trim())){ showError(codigo, "Código inválido"); ok=false; }
    if(!rules.nombre(nombre.value.trim())){ showError(nombre, "Nombre inválido"); ok=false; }
    if(!rules.precio(precio.value.trim())){ showError(precio, "Precio inválido"); ok=false; }

    return ok;
}

/* ============================
        CATEGORÍAS
============================ */
async function loadCategorias(){
    try {
        const res = await fetch(URL_CATEGORIAS);
        categorias = await res.json();
    } catch {
        categorias = [];
    }
}

function populateSelects(){
    const crear = document.getElementById("crearCategoria");
    crear.innerHTML = `<option value="">-- Sin categoría --</option>`;
    selectEditarCategoria.innerHTML = crear.innerHTML;

    categorias.forEach(c => {
        crear.innerHTML += `<option value="${c.idCategoria}">${c.nombre}</option>`;
        selectEditarCategoria.innerHTML += `<option value="${c.idCategoria}">${c.nombre}</option>`;
    });
}

/* ============================
          PRODUCTOS
============================ */
async function loadProductos(){
    try {
        const res = await fetch(URL_PRODUCTOS);
        productos = await res.json();
        renderTable();
    } catch {
        productos = [];
        renderTable();
    }
}

function renderTable(){
    const q = filterText.value.toLowerCase().trim();
    const list = productos.filter(p =>
        (!q) || p.codigo.toLowerCase().includes(q) || p.nombre.toLowerCase().includes(q)
    );

    tbodyProductos.innerHTML = list.length === 0
        ? `<tr><td colspan="7" style="text-align:center;">Sin productos</td></tr>`
        : list.map(p => `
            <tr>
                <td>${p.idProducto}</td>
                <td>${p.codigo}</td>
                <td>${p.nombre}</td>
                <td>${p.marca || "-"}</td>
                <td>${p.categoria?.nombre || "-"}</td>
                <td>${p.precio}</td>
                <td>
                    <button class="btn primary" onclick="abrirEditar(${p.idProducto})">Editar</button>
                    <button class="btn ghost" onclick="eliminarProducto(${p.idProducto})">Eliminar</button>
                </td>
            </tr>
        `).join("");
}

/* ---------------------------
        CREAR PRODUCTO
---------------------------- */
async function onCrearProducto(e){
    e.preventDefault();

    if(!validateCrear()){
        msgCrear.textContent = "Corrige los campos antes de continuar.";
        return;
    }

    const payload = {
        codigo: crearCodigo.value.trim(),
        nombre: crearNombre.value.trim(),
        marca: crearMarca.value.trim(),
        descripcion: crearDescripcion.value.trim(),
        precio: parseFloat(crearPrecio.value),
        categoria: crearCategoria.value ? { idCategoria: parseInt(crearCategoria.value) } : null
    };

    try {
        const res = await fetch(URL_PRODUCTOS, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(payload)
        });

        if(!res.ok){
            msgCrear.textContent = await res.text();
            return;
        }

        formCrear.reset();
        await loadProductos();
    } catch {
        msgCrear.textContent = "Error de conexión";
    }
}

/* ---------------------------
        MODAL EDITAR
---------------------------- */
async function abrirEditar(id){
    editingId = id;
    msgEditar.textContent = "";

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

function closeModal(){
    modal.classList.add("hidden");
    editingId = null;
}

/* EDITAR */
async function onSubmitEditar(e){
    e.preventDefault();

    const payload = {
        codigo: formEditar.codigo.value.trim(),
        nombre: formEditar.nombre.value.trim(),
        marca: formEditar.marca.value.trim(),
        descripcion: formEditar.descripcion.value.trim(),
        precio: parseFloat(formEditar.precio.value),
        categoria: formEditar.categoria.value ? { idCategoria: parseInt(formEditar.categoria.value) } : null
    };

    const res = await fetch(`${URL_PRODUCTOS}/${editingId}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(payload)
    });

    if(!res.ok){
        msgEditar.textContent = await res.text();
        return;
    }

    closeModal();
    await loadProductos();
}

/* ---------------------------
        ELIMINAR
---------------------------- */
async function eliminarProducto(id){
    if(!confirm("¿Seguro que deseas eliminar este producto?")) return;

    const res = await fetch(`${URL_PRODUCTOS}/${id}`, { method:"DELETE" });
    await loadProductos();
}
