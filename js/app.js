// Array original del menu
const menu = [
  { nombre: 'Bruschetta Clásica',     descripcion: 'Pan tostado con tomate y albahaca fresca',   precio: 4500,  categoria: 'Entrada'       },
  { nombre: 'Tabla de Quesos',         descripcion: 'Selección de quesos importados con mermelada', precio: 7800,  categoria: 'Entrada'       },
  { nombre: 'Lomo al Vino Tinto',      descripcion: 'Lomo de res en reducción de vino tinto',      precio: 15500, categoria: 'Plato Fuerte'  },
  { nombre: 'Pasta Carbonara',         descripcion: 'Pasta con tocino, huevo y queso parmesano',    precio: 10200, categoria: 'Plato Fuerte'  },
  { nombre: 'Salmón a la Plancha',     descripcion: 'Filete de salmón con vegetales al vapor',      precio: 13800, categoria: 'Plato Fuerte'  },
  { nombre: 'Tiramisú',               descripcion: 'Postre italiano con café y mascarpone',         precio: 5200,  categoria: 'Postre'        },
  { nombre: 'Cheesecake de Maracuyá', descripcion: 'Cheesecake cremoso con coulis de maracuyá',    precio: 4800,  categoria: 'Postre'        },
];

// Array para guardar las reservas
const reservas = [];

// Categoria actual del filtro
let categoriaActiva = 'Todos';

// Mapa de imagenes segun el nombre del platillo
const imagenesPlatos = {
  'Bruschetta Clásica': './images/bruscheta.webp',
  'Tabla de Quesos': './images/tabla quesos.webp',
  'Lomo al Vino Tinto': './images/lomo.webp',
  'Pasta Carbonara': './images/pasta.webp',
  'Salmón a la Plancha': './images/salmon.webp',
  'Tiramisú': './images/tiramisu.webp',
  'Cheesecake de Maracuyá': './images/cheesecake.webp'
};

// 1. Seleccionar campos del formulario
let inputNombre;
let inputCorreo;
let inputFecha;
let inputHora;
let inputPersonas;
let inputComentarios;
let formulario;
let btnEnviar;

// 2. Seleccionar contenedor de errores
let errorNombre;
let errorCorreo;
let errorFecha;
let errorHora;
let errorPersonas;

// Al cargar el documento
document.addEventListener('DOMContentLoaded', function () {
  renderMenu();

  // Selectores
  inputNombre = document.getElementById("nombre");
  inputCorreo = document.getElementById("correo");
  inputFecha = document.getElementById("fecha");
  inputHora = document.getElementById("hora");
  inputPersonas = document.getElementById("personas");
  inputComentarios = document.getElementById("comentarios");
  formulario = document.getElementById("form-reserva");
  btnEnviar = document.getElementById("btn-submit");

  errorNombre = document.getElementById("errorNombre");
  errorCorreo = document.getElementById("errorCorreo");
  errorFecha = document.getElementById("errorFecha");
  errorHora = document.getElementById("errorHora");
  errorPersonas = document.getElementById("errorPersonas");

  // 8. Validación de cambios en tiempo real
  inputNombre.addEventListener("input", function () {
    validarNombre();
    validarFormulario();
  });

  inputCorreo.addEventListener("input", function () {
    validarCorreo();
    validarFormulario();
  });

  inputFecha.addEventListener("change", function () {
    validarFecha();
    validarFormulario();
  });

  inputHora.addEventListener("change", function () {
    validarHora();
    validarFormulario();
  });

  inputPersonas.addEventListener("input", function () {
    validarPersonas();
    validarFormulario();
  });

  // 10. Envío del formulario
  formulario.addEventListener("submit", function (event) {
    event.preventDefault();
    if (validarFormulario()) {
      agregarReserva();

      // Restablece colores de borde
      inputNombre.style.borderColor = "";
      inputCorreo.style.borderColor = "";
      inputFecha.style.borderColor = "";
      inputHora.style.borderColor = "";
      inputPersonas.style.borderColor = "";
    }
  });

  // Habilita botón inicialmente
  btnEnviar.disabled = true;
});

// Dibuja las tarjetas del menu en la página
function renderMenu() {
  let contenedor = document.getElementById('menu-container');
  contenedor.innerHTML = ''; // Limpia el contenedor

  // Filtra platos segun categoría
  let platillosFiltrados = menu.filter(plato => {
    if (categoriaActiva === 'Todos') return true;
    return plato.categoria === categoriaActiva;
  });

  // Crea y agrega las columnas y tarjetas con createElement
  for (let i = 0; i < platillosFiltrados.length; i++) {
    let columna = document.createElement("div");
    columna.className = "col-md-6 col-sm-12 mb-4";

    let tarjeta = document.createElement("div");
    tarjeta.className = "card-plato";

    let imagenRuta = imagenesPlatos[platillosFiltrados[i].nombre] || './images/restaurante.jpg';
    let img = document.createElement("img");
    img.src = imagenRuta;
    img.alt = platillosFiltrados[i].nombre;
    img.className = "card-plato-img";

    let headerDiv = document.createElement("div");
    headerDiv.className = "card-plato-header";

    let titulo = document.createElement("h3");
    titulo.className = "card-plato-titulo";
    titulo.textContent = platillosFiltrados[i].nombre;

    let precioFormateado = '₡' + platillosFiltrados[i].precio.toLocaleString('es-CR');
    let precio = document.createElement("span");
    precio.className = "card-plato-precio";
    precio.textContent = precioFormateado;

    headerDiv.appendChild(titulo);
    headerDiv.appendChild(precio);

    let descripcion = document.createElement("p");
    descripcion.className = "card-plato-desc";
    descripcion.textContent = platillosFiltrados[i].descripcion;

    let tag = document.createElement("span");
    tag.className = "card-plato-tag";
    tag.textContent = platillosFiltrados[i].categoria;

    tarjeta.appendChild(img);
    tarjeta.appendChild(headerDiv);
    tarjeta.appendChild(descripcion);
    tarjeta.appendChild(tag);

    columna.appendChild(tarjeta);
    contenedor.appendChild(columna);
  }
}

// Filtra platos y marca botón activo
function filtrarCategoria(categoria) {
  categoriaActiva = categoria;
  renderMenu();

  // Cambia clase active en los botones
  let botones = document.querySelectorAll('#filtros-container button');
  for (let i = 0; i < botones.length; i++) {
    let onclickAttr = botones[i].getAttribute('onclick');
    if (onclickAttr && onclickAttr.includes(`'${categoria}'`)) {
      botones[i].classList.add('active');
    } else {
      botones[i].classList.remove('active');
    }
  }
}

// 3. Validación Nombre Completo
function validarNombre() {
  const nombreValor = inputNombre.value.trim();
  const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  if (nombreValor.length < 5) {
    errorNombre.innerText = "El nombre debe tener al menos 5 caracteres.";
    inputNombre.style.borderColor = "red";
    return false;
  } else if (!regexNombre.test(nombreValor)) {
    errorNombre.innerText = "El nombre solo puede contener letras y espacios.";
    inputNombre.style.borderColor = "red";
    return false;
  } else {
    errorNombre.innerText = "";
    inputNombre.style.borderColor = "green";
    return true;
  }
}

// 4. Validación Correo Electrónico
function validarCorreo() {
  const correoValor = inputCorreo.value.trim();
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regexCorreo.test(correoValor)) {
    errorCorreo.innerText = "El correo no es válido.";
    inputCorreo.style.borderColor = "red";
    return false;
  } else {
    errorCorreo.innerText = "";
    inputCorreo.style.borderColor = "green";
    return true;
  }
}

// 5. Validación Fecha
function validarFecha() {
  const fechaValor = inputFecha.value;

  if (fechaValor === '') {
    errorFecha.innerText = "La fecha de reserva es obligatoria.";
    inputFecha.style.borderColor = "red";
    return false;
  }

  let hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  let partesFecha = fechaValor.split('-');
  let fechaSeleccionada = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2]);

  if (fechaSeleccionada < hoy) {
    errorFecha.innerText = "La fecha no puede ser anterior al día de hoy.";
    inputFecha.style.borderColor = "red";
    return false;
  } else {
    errorFecha.innerText = "";
    inputFecha.style.borderColor = "green";
    return true;
  }
}

// 6. Validación Hora
function validarHora() {
  if (inputHora.value === '') {
    errorHora.innerText = "Debe seleccionar una hora.";
    inputHora.style.borderColor = "red";
    return false;
  } else {
    errorHora.innerText = "";
    inputHora.style.borderColor = "green";
    return true;
  }
}

// 7. Validación Personas
function validarPersonas() {
  const personasValor = parseInt(inputPersonas.value, 10);

  if (inputPersonas.value === '') {
    errorPersonas.innerText = "El número de personas es obligatorio.";
    inputPersonas.style.borderColor = "red";
    return false;
  } else if (isNaN(personasValor) || personasValor < 1 || personasValor > 20) {
    errorPersonas.innerText = "El número de personas debe estar entre 1 y 20.";
    inputPersonas.style.borderColor = "red";
    return false;
  } else {
    errorPersonas.innerText = "";
    inputPersonas.style.borderColor = "green";
    return true;
  }
}

// 9. Habilitar botón de envío (validarFormulario obligatoria)
function validarFormulario() {
  const nombreValido = inputNombre.value.trim().length >= 5 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(inputNombre.value.trim());
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputCorreo.value.trim());
  
  let fechaValido = false;
  if (inputFecha.value !== '') {
    let hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    let partes = inputFecha.value.split('-');
    let fechaSel = new Date(partes[0], partes[1] - 1, partes[2]);
    fechaValido = (fechaSel >= hoy);
  }

  const horaValido = inputHora.value !== '';
  const personasVal = parseInt(inputPersonas.value, 10);
  const personasValido = !isNaN(personasVal) && personasVal >= 1 && personasVal <= 20;

  if (nombreValido && correoValido && fechaValido && horaValido && personasValido) {
    btnEnviar.disabled = false;
    return true;
  } else {
    btnEnviar.disabled = true;
    return false;
  }
}

// Guarda la reserva en la lista y la agrega a la tabla (agregarReserva obligatoria)
function agregarReserva() {
  let nuevaReserva = {
    nombre: inputNombre.value.trim(),
    correo: inputCorreo.value.trim(),
    fecha: inputFecha.value,
    hora: inputHora.value,
    personas: parseInt(inputPersonas.value, 10),
    comentarios: inputComentarios.value.trim()
  };

  reservas.push(nuevaReserva);

  let tbody = document.getElementById('tabla-reservas-body');
  let tr = document.createElement('tr');
  tr.className = 'fila-reserva';

  // Si son 6 o mas personas se marca como VIP
  if (nuevaReserva.personas >= 6) {
    tr.classList.add('reserva-vip');
  }

  let partes = nuevaReserva.fecha.split('-');
  let fechaFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`;

  tr.innerHTML = `
    <td>${nuevaReserva.nombre}</td>
    <td>${nuevaReserva.correo}</td>
    <td>${fechaFormateada}</td>
    <td>${nuevaReserva.hora}</td>
    <td>${nuevaReserva.personas}</td>
  `;

  tbody.appendChild(tr);

  // Limpiar formulario y restablecer boton
  formulario.reset();
  btnEnviar.disabled = true;

  actualizarResumen();
}

// Recalcula los totales y la reserva mayor (actualizarResumen obligatoria)
function actualizarResumen() {
  let totalReservas = reservas.length;
  let totalPersonas = 0;
  let maxPersonas = 0;
  let reservaMayor = 'Ninguna';

  for (let i = 0; i < reservas.length; i++) {
    totalPersonas += reservas[i].personas;
    if (reservas[i].personas > maxPersonas) {
      maxPersonas = reservas[i].personas;
      reservaMayor = `${reservas[i].nombre} (${reservas[i].personas} personas)`;
    }
  }

  document.getElementById('resumen-total-reservas').textContent = totalReservas;
  document.getElementById('resumen-total-personas').textContent = totalPersonas;
  document.getElementById('resumen-reserva-mayor').textContent = reservaMayor;
}
