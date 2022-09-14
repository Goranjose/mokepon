let btnMascotaJugador = document.getElementById("btn-mascota");
let sectionMascota = document.getElementById("mascota");

let sectionAtaque = document.getElementById("ataque");
sectionAtaque.style.display = "none";

let sectionReiniciar = document.getElementById("reiniciar");
sectionReiniciar.style.display = "none";

let mascotaJugador = document.getElementById("mascota-jugador");
let mascotaEnemigo = document.getElementById("mascota-enemigo");

const $ = (selector) => document.getElementById(selector);
let spanVidaJugador = $("vida-jugador");
let spanVidaEnemigo = $("vida-enemigo");

let sectionMensaje = $("resultado");
let nuevoContainer_1 = $("ataque-jugador");
let nuevoContainer_2 = $("ataque-enemigo");
let nuevoParrafo_1;
let nuevoParrafo_2;

const contenedorTarjetas = $("contenedor-tarjetas");

let btnAtaques = $("btn-ataques");

const sectionVerMapa = $("ver-mapa");
const mapa = $("mapa");
sectionVerMapa.style.display = "none";

let ataqueJugador;
let ataqueEnemigo;

let lienzo = mapa.getContext("2d");
let intervalo;
let mapaBackground = new Image();
mapaBackground.src = "../assets/mokemap.png";

let jugadorId = null;
let enemigoId = null;

// ELEMENTOS DE LOS MOKEPONES
let fuego = "🔥";
let agua = "💧";
let planta = "🌱";
let vidaJugador = ["💚", "💚", "💚"];
let vidaEnemigo = ["💚", "💚", "💚"];
let mokepones = [];
let mokeponesEnemigos = [];
let tarjetasMokepones;
let inputHipodoge;
let inputCapipepo;
let inputRatigueya;
let inputLangostelvis;
let inputTucapalma;
let inputPydos;
let mascotaIndex;
let mascotaElegidaJugador;
let mascotaElegidaEnemigo;
let victoriasJugador = 0;
let victoriasEnemigo = 0;

// ATAQUES
let botones = [];
let btnFuego;
let btnAgua;
let btnPlanta;
let secuenciaJugador = [];
let secuenciaEnemigo = [];
let indexAtaqueJugador;
let indexAtaqueEnemigo;
let colision = false;

// MAPA
let alturaQueBuscamos;
let anchoDelMapa = window.innerWidth - 20;
const anchoMaximoDelMapa = 560;

if (anchoDelMapa > anchoMaximoDelMapa) {
  anchoDelMapa = anchoMaximoDelMapa - 20;
}

alturaQueBuscamos = (anchoDelMapa * 600) / 800;

class Mokepon {
  constructor(nombre, imagen, fotoMapa, id = null) {
    this.id = id;
    this.nombre = nombre;
    this.imagen = imagen;
    this.ataques = [];
    this.ancho = 60;
    this.alto = 60;
    this.x = posicionAleatoria(0, anchoDelMapa - this.ancho);
    this.y = posicionAleatoria(0, alturaQueBuscamos - this.alto);
    this.mapaImagen = new Image();
    this.mapaImagen.src = fotoMapa;
    this.velocidadX = 0;
    this.velocidadY = 0;
  }
  pintarMokepon() {
    lienzo.drawImage(this.mapaImagen, this.x, this.y, this.ancho, this.alto);
  }
}

const posicionAleatoria = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// let posicionEnemigo = posicionAleatoria(100, 380);

let hipodoge = new Mokepon(
  "hipodoge",
  "./assets/mokepons_mokepon_hipodoge_attack.png",
  "./assets/hipodoge.png"
);

let capipepo = new Mokepon(
  "capipepo",
  "./assets/mokepons_mokepon_capipepo_attack.png",
  "./assets/capipepo.png"
);

let ratigueya = new Mokepon(
  "ratigueya",
  "./assets/mokepons_mokepon_ratigueya_attack.png",
  "./assets/ratigueya.png"
);

const HIPODOGE_ATAQUES = [
  { nombre: "💧", id: "btn-agua" },
  { nombre: "💧", id: "btn-agua" },
  { nombre: "🔥", id: "btn-fuego" },
  { nombre: "🌱", id: "btn-planta" },
];

hipodoge.ataques.push(...HIPODOGE_ATAQUES);

const CAPIPEPO_ATAQUES = [
  { nombre: "🌱", id: "btn-planta" },
  { nombre: "🌱", id: "btn-planta" },
  { nombre: "💧", id: "btn-agua" },
  { nombre: "🔥", id: "btn-fuego" },
];
capipepo.ataques.push(...CAPIPEPO_ATAQUES);

const RATIGUEYA_ATAQUES = [
  { nombre: "🔥", id: "btn-fuego" },
  { nombre: "🔥", id: "btn-fuego" },
  { nombre: "💧", id: "btn-agua" },
  { nombre: "🌱", id: "btn-planta" },
];

ratigueya.ataques.push(...RATIGUEYA_ATAQUES);

mokepones.push(hipodoge, capipepo, ratigueya);

// tucapalma.ataques.push(...AGUA);
// pydos.ataques.push(...PLANTA);
// langostelvis.ataques.push(...FUEGO);

mokepones.forEach((mokepon) => {
  tarjetasMokepones = `
  <input id=${mokepon.nombre} name="mascota" type="radio" />
  <label class="tarjeta-mascota" for=${mokepon.nombre}>
    <p>${mokepon.nombre.charAt(0).toUpperCase() + mokepon.nombre.slice(1)}</p>
    <img src=${mokepon.imagen} alt=${mokepon.nombre} />
  </label>
  `;

  contenedorTarjetas.innerHTML += tarjetasMokepones;

  inputHipodoge = $("hipodoge");
  inputCapipepo = $("capipepo");
  inputRatigueya = $("ratigueya");

  // inputLangostelvis = $("langostelvis");
  // inputTucapalma = $("tucapalma");
  // inputPydos = $("pydos");
});

let enemigoColision;

// const unirseAlJuego = () => {
//   fetch("http://localhost:8080/unirse").then((res) => {
//     if (res.ok) {
//       res.text().then((respuesta) => {
//         console.log(respuesta);
//         jugadorId = respuesta;
//       });
//     }
//   });
// };

unirseAlJuego();

function unirseAlJuego() {
  fetch("http://localhost:8080/unirse").then(function (res) {
    if (res.ok) {
      res.text().then(function (respuesta) {
        console.log(respuesta);
        jugadorId = respuesta;
      });
    }
  });
}

const seleccionarMascotaJugador = () => {
  let activarEnemigo = true;

  if (inputHipodoge.checked) {
    mascotaIndex = 0;
  } else if (inputCapipepo.checked) {
    mascotaIndex = 1;
  } else if (inputRatigueya.checked) {
    mascotaIndex = 2;
    // } else if (inputLangostelvis.checked) {
    //   mascotaIndex = 3;
    // } else if (inputTucapalma.checked) {
    //   mascotaIndex = 4;
    // } else if (inputPydos.checked) {
    //   mascotaIndex = 5;
  } else {
    alert("Por favor selecciona una mascota");
    activarEnemigo = false;
  }

  mascotaElegidaJugador = mokepones[mascotaIndex];

  if (activarEnemigo) {
    btnMascotaJugador.setAttribute("disabled", "");
    mostrar();
    extraerAtaque(mascotaElegidaJugador);
  }

  seleccionarMokepon(mascotaElegidaJugador.nombre);
};

const seleccionarMokepon = (mascotaJugador) => {
  fetch(`http://localhost:8080/mokepon/${jugadorId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      mokepon: mascotaJugador,
    }),
  });
};

const extraerAtaque = (mokepon) => {
  let ataques = [];
  for (let i = 0; i < mokepones.length; i++) {
    if (mokepon.nombre === mokepones[i].nombre) {
      ataques = mokepones[i].ataques;
      console.log("mokepones[i]: ", mokepones[i]);
    }
  }

  console.log("ataques: ", ataques);
  mostrarAtaques(ataques);
};

const mostrarAtaques = (ataques) => {
  ataques.forEach((ataque) => {
    btnAtaques.innerHTML += `
    <button id=${ataque.id} class="boton-ataque">${ataque.nombre}</button>
    `;
  });

  btnFuego = document.getElementById("btn-fuego");
  btnAgua = document.getElementById("btn-agua");
  btnPlanta = document.getElementById("btn-planta");

  botones = document.querySelectorAll(".boton-ataque");

  secuenciaAtaque();
  // btnFuego.addEventListener("click", ataqueFuego);
  // btnAgua.addEventListener("click", ataqueAgua);
  // btnPlanta.addEventListener("click", ataquePlanta);
};

const secuenciaAtaque = () => {
  for (let boton of botones) {
    boton.addEventListener("click", (e) => {
      if (e.target.textContent === "🔥") {
        secuenciaJugador.push(fuego);
        boton.disabled = true;
      } else if (e.target.textContent === "💧") {
        secuenciaJugador.push(agua);
        boton.disabled = true;
      } else if (e.target.textContent === "🌱") {
        secuenciaJugador.push(planta);
        boton.disabled = true;
      }
      if (secuenciaJugador.length == 4) {
        enviarAtaques();
        console.log("Secuencia Jugador: ", secuenciaJugador);
      }
      // ataqueAleaotorioEnemigo();
    });
  }
};

const enviarAtaques = () => {
  fetch(`http://localhost:8080/mokepon/${jugadorId}/ataques`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      ataques: secuenciaJugador,
    }),
  });

  intervalo = setInterval(obtenerAtaques, 50);
};

const obtenerAtaques = () => {
  fetch(`http://localhost:8080/mokepon/${enemigoId}/ataques`).then((res) => {
    if (res.ok) {
      res.json().then((data) => {
        if (data.ataques.length === 4) {
          secuenciaEnemigo = data.ataques;
          console.log("Secuencia Enemigo: ", secuenciaEnemigo);
          combate();
        }
      });
    }
  });
};

const mostrar = () => {
  mapa.width = anchoDelMapa;
  mapa.height = alturaQueBuscamos;
  intervalo = setInterval(pintarCanvas, 50);

  sectionMascota.style.display = "none";
  sectionVerMapa.style.display = "flex";
  pintarCanvas();

  window.addEventListener("keydown", presionarTecla);
  window.addEventListener("keyup", detenerMovimiento);

  mascotaJugador.innerHTML = `
  <img class="mini-mokepon" src=${mascotaElegidaJugador.imagen} alt="${mascotaElegidaJugador.nombre}">
  <p>${mascotaElegidaJugador.nombre}</p>
  `;
};

const seleccionarMascotaEnemigo = (enemigo) => {
  // let mascotaAleatoria = aleatorio(0, mokepones.length - 1);

  // mascotaElegidaEnemigo = mokepones[mascotaAleatoria];
  mascotaElegidaEnemigo = enemigo;

  mascotaEnemigo.innerHTML = `
  <img class="mini-mokepon" src=${mascotaElegidaEnemigo.imagen} alt="${mascotaElegidaEnemigo.nombre}">
  <p>${mascotaElegidaEnemigo.nombre}</p>
  `;

  // if (mascotaAleatoria == 1) {
  //   spanMascotaEnemigo.textContent = "Hipodoge";
  // } else if (mascotaAleatoria == 2) {
  //   spanMascotaEnemigo.textContent = "Capipepo";
  // } else {
  //   spanMascotaEnemigo.textContent = "Ratigueya";
  // }
};

const pintarCanvas = () => {
  mascotaElegidaJugador.x =
    mascotaElegidaJugador.x + mascotaElegidaJugador.velocidadX;
  mascotaElegidaJugador.y =
    mascotaElegidaJugador.y + mascotaElegidaJugador.velocidadY;

  lienzo.clearRect(0, 0, mapa.width, mapa.height);
  lienzo.drawImage(mapaBackground, 0, 0, mapa.width, mapa.height);
  mascotaElegidaJugador.pintarMokepon();

  enviarPosicion(mascotaElegidaJugador.x, mascotaElegidaJugador.y);

  mokeponesEnemigos.forEach((mokepon) => {
    mokepon.pintarMokepon();
    revisarColision(mokepon);
  });

  // if (colision) {
  //   pintarEnemigo(enemigoColision);
  // }

  // langostelvis.pintarMokepon();
  // tucapalma.pintarMokepon();
  // pydos.pintarMokepon();

  // if (
  //   mascotaElegidaJugador.velocidadX !== 0 ||
  //   mascotaElegidaJugador.velocidadY !== 0
  // ) {
  //   revisarColision(langostelvis);
  //   revisarColision(tucapalma);
  //   revisarColision(pydos);
  // }
};

const enviarPosicion = (x, y) => {
  fetch(`http://localhost:8080/mokepon/${jugadorId}/posicion`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      x, // cuando la clave y valor son el mismo ( x : x), se puede enviar solo uno
      y,
    }),
  }).then((res) => {
    if (res.ok) {
      res.json().then(({ enemigos }) => {
        console.log("enemigos: ", enemigos);
        mokeponesEnemigos = enemigos.map((enemigo) => {
          let otroJugador = null;
          const mokeponNombre = enemigo.mokepon.nombre || "";
          console.log("mokeponNombre: ", mokeponNombre);
          if (mokeponNombre === "hipodoge") {
            otroJugador = new Mokepon(
              "hipodoge",
              "./assets/mokepons_mokepon_hipodoge_attack.png",
              "./assets/hipodoge.png",
              enemigo.id
            );
          } else if (mokeponNombre === "capipepo") {
            otroJugador = new Mokepon(
              "capipepo",
              "./assets/mokepons_mokepon_capipepo_attack.png",
              "./assets/capipepo.png",
              enemigo.id
            );
          } else if (mokeponNombre === "ratigueya") {
            otroJugador = new Mokepon(
              "ratigueya",
              "./assets/mokepons_mokepon_ratigueya_attack.png",
              "./assets/ratigueya.png",
              enemigo.id
            );
          }
          // switch (mokeponNombre) {
          //   case "hipodoge":
          //     otroJugador = new Mokepon(
          //       "hipodoge",
          //       "./assets/mokepons_mokepon_hipodoge_attack.png",
          //       "./assets/hipodoge.png",
          //       enemigoId
          //     );
          //     break;
          //   case "capipepo":
          //     otroJugador = new Mokepon(
          //       "capipepo",
          //       "./assets/mokepons_mokepon_capipepo_attack.png",
          //       "./assets/capipepo.png",
          //       enemigoId
          //     );
          //     break;
          //   case "ratigueya":
          //     otroJugador = new Mokepon(
          //       "ratigueya",
          //       "./assets/mokepons_mokepon_ratigueya_attack.png",
          //       "./assets/ratigueya.png",
          //       enemigoId
          //     );
          //     break;
          // }
          otroJugador.x = enemigo.x;
          otroJugador.y = enemigo.y;

          return otroJugador;
        });
      });
    }
  });
};

const moverHorizontalIzquierda = () => {
  mascotaElegidaJugador.velocidadX = -4;
};

const moverHorizontalDerecha = () => {
  mascotaElegidaJugador.velocidadX = 4;
};

const moverVerticalArriba = () => {
  mascotaElegidaJugador.velocidadY = -4;
};

const moverVerticalAbajo = () => {
  mascotaElegidaJugador.velocidadY = 4;
};

const moverIzquierda = $("mover-x-izquierda");
const moverDerecha = $("mover-x-derecha");

const moverArriba = $("mover-y-arriba");
const moverAbajo = $("mover-y-abajo");

moverIzquierda.addEventListener("touchstart", moverHorizontalIzquierda);
moverDerecha.addEventListener("touchstart", moverHorizontalDerecha);

moverArriba.addEventListener("touchstart", moverVerticalArriba);
moverAbajo.addEventListener("touchstart", moverVerticalAbajo);

// const detenerMokepon = document.querySelectorAll(".btn-movimiento");
// detenerMokepon.addEventListener("mouseup", detenerMovimiento);

const presionarTecla = (event) => {
  switch (event.key) {
    case "ArrowLeft":
      moverHorizontalIzquierda();
      break;
    case "ArrowRight":
      moverHorizontalDerecha();
      break;
    case "ArrowUp":
      moverVerticalArriba();
      break;
    case "ArrowDown":
      moverVerticalAbajo();
      break;
    default:
      break;
  }
};

const detenerMovimiento = () => {
  mascotaElegidaJugador.velocidadX = 0;
  mascotaElegidaJugador.velocidadY = 0;
};

const aleatorio = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// const ataqueFuego = () => {
//   ataqueJugador = fuego;
//   ataqueAleaotorioEnemigo();
// };

// const ataqueAgua = () => {
//   ataqueJugador = agua;
//   ataqueAleaotorioEnemigo();
// };

// const ataquePlanta = () => {
//   ataqueJugador = planta;
//   ataqueAleaotorioEnemigo();
// };

const ataqueAleaotorioEnemigo = () => {
  let ataqueAleatorio = aleatorio(0, mascotaElegidaEnemigo.ataques.length - 1);

  secuenciaEnemigo.push(mascotaElegidaEnemigo.ataques[ataqueAleatorio].nombre);

  mascotaElegidaEnemigo.ataques.splice(ataqueAleatorio, 1);

  console.log("Secuencia Enemigo", secuenciaEnemigo);

  // if (ataqueAleatorio == 1) {
  //   ataqueEnemigo = fuego;
  // } else if (ataqueAleatorio == 2) {
  //   ataqueEnemigo = agua;
  // } else {
  //   ataqueEnemigo = planta;
  // }

  // debugger ---> se usa para encontrar y solucionar errores
  if (secuenciaJugador.length === mascotaElegidaJugador.ataques.length) {
    combate();
  }
};

const indexAmbosOponentes = (jugador, enemigo) => {
  indexAtaqueJugador = secuenciaJugador[jugador];
  indexAtaqueEnemigo = secuenciaEnemigo[enemigo];
};

const combate = () => {
  clearInterval(intervalo);

  for (let i = 0; i < secuenciaJugador.length + 1; i++) {
    if (secuenciaJugador[i] == secuenciaEnemigo[i]) {
      indexAmbosOponentes(i, i);
      crearMensaje();
    } else if (
      (secuenciaJugador[i] == fuego && secuenciaEnemigo[i] == planta) ||
      (secuenciaJugador[i] == agua && secuenciaEnemigo[i] == fuego) ||
      (secuenciaJugador[i] == planta && secuenciaEnemigo[i] == agua)
    ) {
      victoriasJugador++;
      spanVidaJugador.textContent = victoriasJugador;
      indexAmbosOponentes(i, i);
      crearMensaje();
    } else {
      victoriasEnemigo++;
      spanVidaEnemigo.textContent = victoriasEnemigo;
      indexAmbosOponentes(i, i);
      crearMensaje();
    }
  }
  revisarVidas();
  // if (ataqueJugador == ataqueEnemigo) {
  //   crearMensaje("EMPATE");
  // } else if (
  //   (ataqueJugador == fuego && ataqueEnemigo == planta) ||
  //   (ataqueJugador == agua && ataqueEnemigo == fuego) ||
  //   (ataqueJugador == planta && ataqueEnemigo == agua)
  // ) {
  //   crearMensaje("GANASTE");
  //   vidaEnemigo.pop();
  //   spanVidaEnemigo.textContent =
  //     vidaEnemigo.join("") === "" ? "💀" : vidaEnemigo.join("");
  // } else {
  //   crearMensaje("PERDISTE");
  //   vidaJugador.pop();
  //   spanVidaJugador.textContent =
  //     vidaJugador.join("") === "" ? "💀" : vidaJugador.join("");
  // }
};

const crearMensaje = (resultado) => {
  sectionMensaje.textContent = resultado;

  nuevoParrafo_1 = document.createElement("p");
  nuevoParrafo_2 = document.createElement("p");

  nuevoParrafo_1.textContent = indexAtaqueJugador;
  nuevoParrafo_2.textContent = indexAtaqueEnemigo;

  nuevoContainer_1.appendChild(nuevoParrafo_1);
  nuevoContainer_2.appendChild(nuevoParrafo_2);
};

const revisarVidas = () => {
  if (victoriasJugador === victoriasEnemigo) {
    crearMensajeFinal("EMPATADOS");
  } else if (victoriasJugador > victoriasEnemigo) {
    crearMensajeFinal("Tu mascota gano. Felicidades 🎉");
  } else {
    crearMensajeFinal("Tu mascota perdio, vuelve a intentar");
  }

  // if (vidaJugador.length === 0) {
  //   crearMensajeFinal("Tu mascota perdio, vuelve a intentar");
  // } else if (vidaEnemigo.length === 0) {
  //   crearMensajeFinal("Tu mascota gano. Felicidades 🎉");
  // }
};

const crearMensajeFinal = (resultadoFinal) => {
  sectionMensaje.classList.remove("tamaño-mensaje");
  sectionMensaje.textContent = `${resultadoFinal}`;
  // btnFuego.disabled = true;
  // btnAgua.disabled = true;
  // btnPlanta.disabled = true;
  sectionReiniciar.style.display = "block";
  activarBtnReiniciar();
};

const reiniciarJuego = () => {
  location.reload();
};

const revisarColision = (enemigo) => {
  const arribaEnemigo = enemigo.y + 20;
  const abajoEnemigo = enemigo.y + enemigo.alto - 20;
  const izquierdaEnemigo = enemigo.x + 20;
  const derechaEnemigo = enemigo.x + enemigo.ancho - 20;

  const arribaMascota = mascotaElegidaJugador.y;
  const abajoMascota = mascotaElegidaJugador.y + mascotaElegidaJugador.alto;
  const izquierdaMascota = mascotaElegidaJugador.x;
  const derechaMascota = mascotaElegidaJugador.x + mascotaElegidaJugador.ancho;

  if (arribaMascota < 0) {
    moverArriba = $("mover-y-arriba");
    // window.addEventListener("keydown", presionarTecla);
    // window.addEventListener("keyup", detenerMovimiento);
    detenerMovimiento();
  }

  if (
    abajoMascota < arribaEnemigo ||
    arribaMascota > abajoEnemigo ||
    derechaMascota < izquierdaEnemigo ||
    izquierdaMascota > derechaEnemigo
  ) {
    return;
  }
  detenerMovimiento();
  colision = true;
  enemigoColision = enemigo.nombre;
  // alert("Hay colision con " + enemigo.nombre);
  clearInterval(intervalo);
  seleccionarMascotaEnemigo(enemigo);

  console.log("Colision");
  enemigoId = enemigo.id;

  mostarBatalla();
};

const mostarBatalla = () => {
  sectionAtaque.style.display = "flex";
  sectionVerMapa.style.display = "none";
};

// const pintarEnemigo = (enemigoColision) => {
//   switch (enemigoColision) {
//     case "langostelvis":
//       langostelvis.pintarMokepon();
//       break;
//     case "tucapalma":
//       tucapalma.pintarMokepon();
//       break;
//     case "pydos":
//       pydos.pintarMokepon();
//       break;
//   }
// };

btnMascotaJugador.addEventListener("click", seleccionarMascotaJugador);

const activarBtnReiniciar = () => {
  let btnReiniciar = document.getElementById("mensaje");
  btnReiniciar.style.cursor = "pointer";
  btnReiniciar.addEventListener("click", reiniciarJuego);
};
