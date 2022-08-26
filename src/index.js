let ataqueJugador;
let ataqueEnemigo;
let fuego = "FUEGO 🔥";
let agua = "AGUA 💧";
let planta = "PLANTA 🌱";
let vidaJugador = ["💚", "💚", "💚"];
let vidaEnemigo = ["💚", "💚", "💚"];

let btnMascotaJugador = document.getElementById("btn-mascota");

let sectionMascota = document.getElementById("mascota");

let sectionAtaque = document.getElementById("ataque");
sectionAtaque.style.display = "none";

let sectionReiniciar = document.getElementById("reiniciar");
sectionReiniciar.style.display = "none";

let btnFuego = document.getElementById("btn-fuego");
let btnAgua = document.getElementById("btn-agua");
let btnPlanta = document.getElementById("btn-planta");

const seleccionarMascotaJugador = () => {
  let activarEnemigo = true;
  const $ = (selector) => document.getElementById(selector);

  let inputHipodoge = $("hipodoge");
  let inputCapipepo = $("capipepo");
  let inputRatigueya = $("ratigueya");
  let spanMascotaJugador = $("mascota-jugador");

  if (inputHipodoge.checked) {
    spanMascotaJugador.innerText = "Hipodoge";
  } else if (inputCapipepo.checked) {
    spanMascotaJugador.innerText = "Capipepo";
  } else if (inputRatigueya.checked) {
    spanMascotaJugador.innerText = "Ratigueya";
  } else {
    alert("Por favor selecciona una mascota");
    activarEnemigo = false;
  }
  if (activarEnemigo) {
    seleccionarMascotaEnemigo();
    btnMascotaJugador.setAttribute("disabled", "");
    mostrar();
  }
};

const mostrar = () => {
  sectionAtaque.style.display = "flex";
  sectionMascota.style.display = "none";
};

const seleccionarMascotaEnemigo = () => {
  let mascotaAleatoria = aleatorio(1, 3);
  let spanMascotaEnemigo = document.getElementById("mascota-enemigo");

  if (mascotaAleatoria == 1) {
    spanMascotaEnemigo.textContent = "Hipodoge";
  } else if (mascotaAleatoria == 2) {
    spanMascotaEnemigo.textContent = "Capipepo";
  } else {
    spanMascotaEnemigo.textContent = "Ratigueya";
  }
};

const aleatorio = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const ataqueFuego = () => {
  ataqueJugador = fuego;
  ataqueAleaotorioEnemigo();
};

const ataqueAgua = () => {
  ataqueJugador = agua;
  ataqueAleaotorioEnemigo();
};

const ataquePlanta = () => {
  ataqueJugador = planta;
  ataqueAleaotorioEnemigo();
};

const ataqueAleaotorioEnemigo = () => {
  let ataqueAleatorio = aleatorio(1, 3);
  if (ataqueAleatorio == 1) {
    ataqueEnemigo = fuego;
  } else if (ataqueAleatorio == 2) {
    ataqueEnemigo = agua;
  } else {
    ataqueEnemigo = planta;
  }
  // debugger ---> esto se usa para encontrar y solucionar errores
  combate();
};

const combate = () => {
  let spanVidaJugador = document.getElementById("vida-jugador");
  let spanVidaEnemigo = document.getElementById("vida-enemigo");

  if (ataqueJugador == ataqueEnemigo) {
    crearMensaje("EMPATE");
  } else if (
    (ataqueJugador == fuego && ataqueEnemigo == planta) ||
    (ataqueJugador == agua && ataqueEnemigo == fuego) ||
    (ataqueJugador == planta && ataqueEnemigo == agua)
  ) {
    crearMensaje("GANASTE");
    vidaEnemigo.pop();
    spanVidaEnemigo.textContent = vidaEnemigo.join("") === "" ? "💀" : vidaEnemigo.join("");
  } else {
    crearMensaje("PERDISTE");
    vidaJugador.pop();
    spanVidaJugador.textContent = vidaJugador.join("") === "" ? "💀" : vidaJugador.join("");
  }
  revisarVidas();
};

const crearMensaje = (resultado) => {
  let sectionMensaje = document.getElementById("resultado");
  sectionMensaje.textContent = resultado;
  let sectionAtaqueJugador = document.getElementById("ataque-jugador");
  let sectionAtaqueEnemigo = document.getElementById("ataque-enemigo");

  let nuevoParrafo_1 = document.getElementById("elemento-jugador");
  nuevoParrafo_1.textContent = ataqueJugador

  let nuevoParrafo_2 = document.getElementById("elemento-enemigo");
  nuevoParrafo_2.textContent = ataqueEnemigo
};

const revisarVidas = () => {
  if (vidaJugador.length === 0) {
    crearMensajeFinal("Tu mascota perdio, vuelve a intentar");
  } else if (vidaEnemigo.length === 0) {
    crearMensajeFinal("Tu mascota gano. Felicidades 🎉");
  }
};

const crearMensajeFinal = (resultadoFinal) => {
  let sectionMensaje = document.getElementById("resultado");
  sectionMensaje.classList.remove("tamaño-mensaje");
  sectionMensaje.textContent = `${resultadoFinal}`;
  btnFuego.disabled = true;
  btnAgua.disabled = true;
  btnPlanta.disabled = true;
  sectionReiniciar.style.display = "block";
  activarBtnReiniciar();
};

const reiniciarJuego = () => {
  location.reload();
};

btnMascotaJugador.addEventListener("click", seleccionarMascotaJugador);

btnFuego.addEventListener("click", ataqueFuego);

btnAgua.addEventListener("click", ataqueAgua);

btnPlanta.addEventListener("click", ataquePlanta);

const activarBtnReiniciar = () => {
  let btnReiniciar = document.getElementById("mensaje");
    btnReiniciar.style.cursor = "pointer";
    btnReiniciar.addEventListener("click", reiniciarJuego);
};