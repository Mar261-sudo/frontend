/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("Luna Boutique lista ");

  // Ejemplo para probar conexión con el backend
  fetch("http://localhost:8080/api/productos")
    .then((res) => res.json())
    .then((data) => console.log("Productos del backend:", data))
    .catch(() => console.log("️ No se pudo conectar al backend todavía"));
});


    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const toggleRegister = document.getElementById("toggleRegister");
    const resultado = document.getElementById("resultado");

    // Alternar entre login y registro
    toggleRegister.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.classList.toggle("d-none");
      registerForm.classList.toggle("d-none");
      toggleRegister.textContent = loginForm.classList.contains("d-none")
        ? "Ya tengo una cuenta"
        : "Regístrate";
      resultado.textContent = "";
    });

    // Enviar login simulado
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
          resultado.innerHTML = "<p class='text-success'>Inicio de sesión exitoso </p>";
          setTimeout(() => (window.location.href = "../index.html"), 1500);
        } else {
          resultado.innerHTML = "<p class='text-danger'>Credenciales incorrectas </p>";
        }
      } catch (err) {
        resultado.innerHTML = "<p class='text-danger'>Error de conexión️</p>";
      }
    });

    // Enviar registro simulado
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
          resultado.innerHTML = "<p class='text-success'>Registro exitoso </p>";
          registerForm.classList.add("d-none");
          loginForm.classList.remove("d-none");
        } else {
          resultado.innerHTML = "<p class='text-danger'>No se pudo registrar el usuario </p>";
        }
      } catch (err) {
        resultado.innerHTML = "<p class='text-danger'>Error de conexión️</p>";
      }
    });

    // Simular productos en carrito (esto luego se reemplaza con datos del backend)
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [
      { nombre: 'Blusa Rosa', precio: 59000, cantidad: 1 },
      { nombre: 'Jeans Azul', precio: 89000, cantidad: 2 }
    ];

    const contenedor = document.getElementById('carrito');

    function renderCarrito() {
      if (carrito.length === 0) {
        contenedor.innerHTML = "<p class='text-center text-muted'>Tu carrito está vacío </p>";
        return;
      }

      let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

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
            ${carrito.map(p => `
              <tr>
                <td>${p.nombre}</td>
                <td>$${p.precio.toLocaleString()}</td>
                <td>${p.cantidad}</td>
                <td>$${(p.precio * p.cantidad).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <h4 class="text-end mt-3">Total: $${total.toLocaleString()}</h4>
      `;
    }

    renderCarrito();

    document.getElementById('vaciarCarrito').addEventListener('click', () => {
      localStorage.removeItem('carrito');
      location.reload();
    });

    document.getElementById('comprar').addEventListener('click', () => {
      alert('¡Gracias por tu compra!');
      localStorage.removeItem('carrito');
      location.reload();
    });
    // Cargar productos desde el backend
    fetch("http://localhost:8080/api/productos")
      .then(res => res.json())
      .then(productos => {
        const contenedor = document.getElementById("productos");
        contenedor.innerHTML = productos.map(p => `
          <div class="col-md-3">
            <div class="card h-100 shadow-sm">
              <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
              <div class="card-body text-center">
                <h5>${p.nombre}</h5>
                <p class="text-muted">$${p.precio}</p>
              </div>
            </div>
          </div>
        `).join('');
      })
      .catch(err => {
        document.getElementById("productos").innerHTML =
          "<p class='text-center text-danger'>No se pudieron cargar los productos.</p>";
      });