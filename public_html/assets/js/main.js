document.addEventListener("DOMContentLoaded", () => {
  console.log("Luna Boutique lista");

  // --- Detectar página actual ---
  const path = window.location.pathname;

  if (path.includes("login.html")) inicializarLogin();
  if (path.includes("carrito.html")) renderCarrito();
  if (path.includes("productos.html")) cargarProductos();
});


function inicializarLogin() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const toggleRegister = document.getElementById("toggleRegister");
  const resultado = document.getElementById("resultado");

  if (!loginForm || !registerForm || !toggleRegister) return;

  // cambiar entre login y registro
  toggleRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.toggle("d-none");
    registerForm.classList.toggle("d-none");
    toggleRegister.textContent = loginForm.classList.contains("d-none")
      ? "Ya tengo una cuenta"
      : "Regístrate";
    resultado.textContent = "";
  });


  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        resultado.innerHTML =
          "<p class='text-success'>Inicio de sesión exitoso 🩵</p>";
        setTimeout(() => (window.location.href = "../index.html"), 1500);
      } else {
        resultado.innerHTML =
          "<p class='text-danger'>Credenciales incorrectas ⚠️</p>";
      }
    } catch (err) {
      resultado.innerHTML =
        "<p class='text-danger'>Error de conexión con el servidor</p>";
    }
  });


  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombreReg").value;
    const email = document.getElementById("emailReg").value;
    const password = document.getElementById("passwordReg").value;

    try {
      const res = await fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      if (res.ok) {
        resultado.innerHTML =
          "<p class='text-success'>Registro exitoso 🎉</p>";
        registerForm.classList.add("d-none");
        loginForm.classList.remove("d-none");
      } else {
        resultado.innerHTML =
          "<p class='text-danger'>No se pudo registrar el usuario</p>";
      }
    } catch (err) {
      resultado.innerHTML =
        "<p class='text-danger'>Error de conexión con el servidor</p>";
    }
  });
}

function cargarProductos() {
  const contenedor = document.getElementById("productos");
  if (!contenedor) return;

  const productosLocales = [
    { id: 1, nombre: "Blusa Floral", precio: 59000, imagen: "../assets/img/default.jpg" },
    { id: 2, nombre: "Jeans Skinny", precio: 89000, imagen: "../assets/img/default.jpg" },
    { id: 3, nombre: "Vestido Elegante", precio: 129000, imagen: "../assets/img/default.jpg" },
    { id: 4, nombre: "Chaqueta Casual", precio: 110000, imagen: "../assets/img/default.jpg" }
  ];

  fetch("http://localhost:8080/api/productos")
    .then((res) => (res.ok ? res.json() : Promise.reject()))
    .then(mostrarProductos)
    .catch(() => {
      console.warn("productos locales.");
      mostrarProductos(productosLocales);
    });

  function mostrarProductos(productos) {
    contenedor.innerHTML = productos
      .map(
        (p) => `
        <div class="col-sm-6 col-md-4 col-lg-3">
          <div class="card h-100 shadow-sm border-0">
            <img src="${p.imagen || "../assets/img/default.jpg"}" class="card-img-top" alt="${p.nombre}" style="height:250px;object-fit:cover;">
            <div class="card-body text-center">
              <h5 class="card-title">${p.nombre}</h5>
              <p class="text-muted fw-semibold">$${p.precio.toLocaleString()}</p>
              <button class="btn btn-primary btn-sm" onclick="agregarAlCarrito(${p.id}, '${p.nombre}', ${p.precio})">
                ️ Agregar al carrito
              </button>
            </div>
          </div>
        </div>`
      )
      .join("");
  }
}


function agregarAlCarrito(id, nombre, precio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const existente = carrito.find((p) => p.id === id);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`${nombre} agregado al carrito`);
}

function renderCarrito() {
  const contenedor = document.getElementById("carrito");
  if (!contenedor) return;

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
    contenedor.innerHTML =
      "<p class='text-center text-muted'>Tu carrito está vacío</p>";
    return;
  }

  let total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  contenedor.innerHTML = `
    <table class="table table-striped align-middle">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${carrito
          .map(
            (p) => `
          <tr>
            <td>${p.nombre}</td>
            <td>$${p.precio.toLocaleString()}</td>
            <td>${p.cantidad}</td>
            <td>$${(p.precio * p.cantidad).toLocaleString()}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>
    <h4 class="text-end mt-3">Total: $${total.toLocaleString()}</h4>
    <div class="text-end mt-3">
      <button class="btn btn-outline-danger me-2" id="vaciarCarrito">Vaciar carrito</button>
      <button class="btn btn-success" id="comprar">Finalizar compra</button>
    </div>
  `;

  document.getElementById("vaciarCarrito").addEventListener("click", () => {
    localStorage.removeItem("carrito");
    location.reload();
  });

  document.getElementById("comprar").addEventListener("click", () => {
    alert(" ¡Gracias por tu compra!");
    localStorage.removeItem("carrito");
    location.reload();
  });
}
