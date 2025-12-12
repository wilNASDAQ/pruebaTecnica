const URL_CATEGORIAS = "/categorias";

const formCrearCat = document.getElementById("formCrearCat");
const tbodyCategorias = document.getElementById("tbodyCategorias");
const filterCat = document.getElementById("filterCat");

const modalCat = document.getElementById("modalCat");
const formEditarCat = document.getElementById("formEditarCat");
const btnCerrarModalCat = document.getElementById("btnCerrarModalCat");

const toastContainer = document.getElementById("toast-container");

/*
    PAGINACIÓN
 */
let currentPageCat = 1;
let rowsPerPageCat = 4;
let categorias = [];
let editingIdCat = null;

/*
   INIT
*/
document.addEventListener("DOMContentLoaded", () => {
    loadCategorias();
    formCrearCat.addEventListener("submit", onCrearCategoria);
    filterCat.addEventListener("input", () => {
        currentPageCat = 1;
        renderTableCategorias();
    });
    btnCerrarModalCat.addEventListener("click", closeModalCat);
    formEditarCat.addEventListener("submit", onSubmitEditarCat);
});

/*
   TOAST FUNCTION
*/
function showToast(msg, type = "error") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3500);
}

/*
   LOAD CATEGORIAS
*/
async function loadCategorias() {
    try {
        const res = await fetch(URL_CATEGORIAS);
        categorias = await res.json();
        renderTableCategorias();
    } catch {
        categorias = [];
        renderTableCategorias();
        showToast("ERROR");
    }
}

/*
   CREAR CATEGORIA
*/
async function onCrearCategoria(e) {
    e.preventDefault();

    const payload = {
        codigo: document.getElementById("crearCatCodigo").value.trim(),
        nombre: document.getElementById("crearCatNombre").value.trim(),
        descripcion: document.getElementById("crearCatDescripcion").value.trim(),
        activo: document.getElementById("crearCatActivo").value === "true"
    };

    try {
        const res = await fetch(URL_CATEGORIAS, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const msg = await res.text();
            showToast(msg || "ERROR");
            return;
        }

        formCrearCat.reset();
        currentPageCat = 1;
        await loadCategorias();
        showToast("CATEGORIA CREADA", "success");
    } catch {
        showToast("ERROR");
    }
}

/*
   RENDER TABLA + PAGINACION
*/
function renderTableCategorias() {
    const q = (filterCat.value || "").toLowerCase().trim();
    const filtered = categorias.filter(c => !q || c.codigo.toLowerCase().includes(q) || c.nombre.toLowerCase()
        .includes(q));

    const total = filtered.length;
    const pages = Math.ceil(total / rowsPerPageCat) || 1;
    if (currentPageCat > pages) currentPageCat = pages;

    const start = (currentPageCat - 1) * rowsPerPageCat;
    const end = start + rowsPerPageCat;
    const pageItems = filtered.slice(start, end);

    tbodyCategorias.innerHTML = "";
    if (pageItems.length === 0) {
        tbodyCategorias.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#666">No hay categorías</td></tr>`;
        renderPaginationCat(total);
        return;
    }

    pageItems.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.idCategoria}</td>
            <td>${c.codigo}</td>
            <td>${c.nombre}</td>
            <td>${c.descripcion || "-"}</td>
            <td>${c.activo ? "Sí" : "No"}</td>
            <td>
                <button class="action-btn edit" onclick="abrirEditarCat(${c.idCategoria})">Editar</button>
                <button class="action-btn del" onclick="eliminarCat(${c.idCategoria})">Eliminar</button>
            </td>
        `;
        tbodyCategorias.appendChild(tr);
    });

    renderPaginationCat(total);
}


/*
   PAGINACION
 */
function renderPaginationCat(total) {
    const container = document.getElementById("paginationCat");
    const pages = Math.ceil(total / rowsPerPageCat);
    if (pages <= 1) {
        container.innerHTML = "";
        return;
    }

    let html = `<button class="prevnext" ${currentPageCat === 1 ? "disabled" : ""} 
onclick="goPageCat(${currentPageCat - 1})">‹</button>`;
    for (let i = 1; i <= pages; i++) {
        const cls = i === currentPageCat ? 'active-page' : 'page-num';
        html += `<button class="${cls}" onclick="goPageCat(${i})">${i}</button>`;
    }
    html += `<button class="prevnext" ${currentPageCat === pages ? "disabled" : ""} 
onclick="goPageCat(${currentPageCat + 1})">›</button>`;
    container.innerHTML = html;
}

function goPageCat(n) {
    if (n < 1) n = 1;
    currentPageCat = n;
    renderTableCategorias();
}

/*
   MODAL EDITAR
*/
async function abrirEditarCat(id) {
    editingIdCat = id;

    try {
        const res = await fetch(`${URL_CATEGORIAS}/${id}`);
        if (!res.ok) {
            showToast(await res.text());
            return;
        }
        const c = await res.json();
        formEditarCat.codigo.value = c.codigo || "";
        formEditarCat.nombre.value = c.nombre || "";
        formEditarCat.descripcion.value = c.descripcion || "";
        formEditarCat.activo.value = c.activo ? "true" : "false";
        modalCat.classList.remove("hidden");
    } catch {
        showToast("ERROR");
    }
}

function closeModalCat() {
    modalCat.classList.add("hidden");
    editingIdCat = null;
    formEditarCat.reset();
}

/*
   EDITAR
*/
async function onSubmitEditarCat(e) {
    e.preventDefault();
    if (!editingIdCat) return showToast("ID NO VALIDO");

    const payload = {
        codigo: formEditarCat.codigo.value.trim(),
        nombre: formEditarCat.nombre.value.trim(),
        descripcion: formEditarCat.descripcion.value.trim(),
        activo: formEditarCat.activo.value === "true"
    };

    try {
        const res = await fetch(`${URL_CATEGORIAS}/${editingIdCat}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            const msg = await res.text();
            showToast(msg);
            return;
        }

        closeModalCat();
        await loadCategorias();
        showToast("CATEGORIA ACTUALIZADA", "success");
    } catch {
        showToast("ERROR");
    }
}

/*
   ELIMINAR
*/
async function eliminarCat(id) {
    if (!confirm("¿SEGURO QUE QUIERES ELIMINAR ESTA CATEGORIA?")) return;
    try {
        const res = await fetch(`${URL_CATEGORIAS}/${id}`, {method: "DELETE"});
        if (!res.ok) {
            showToast(await res.text());
            return;
        }
        showToast("CATEGORIA ELIMINADA", "success");
        await loadCategorias();
    } catch {
        showToast("ERROR");
    }
}
