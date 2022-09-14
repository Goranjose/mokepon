const express = require("express");
const cors = require("cors");
const { request, application } = require("express");

const app = express();

app.use(express.static("public"));
app.use(cors());
app.use(express.json());

// const puerto = 8080;
const puerto = process.env.PORT || 8080;


const jugadores = [];

class Jugador {
  constructor(id) {
    this.id = id;
  }

  asignarMokepon(mokepon) {
    this.mokepon = mokepon;
  }

  actualiarPosicion(x, y) {
    this.x = x;
    this.y = y;
  }

  asignarAtaques(ataques) {
    this.ataques = ataques;
  }
}

class Mokepon {
  constructor(nombre) {
    this.nombre = nombre;
  }
}

app.get("/unirse", (req, res) => {
  const id = `${Math.random()}`;

  const jugador = new Jugador(id);

  jugadores.push(jugador);

  res.setHeader("Access-Control-Allow-Origin", "*");

  res.send(id);
});

app.post("/mokepon/:jugadorId", (req, res) => {
  const jugadorId = req.params.jugadorId || "";
  const nombre = req.body.mokepon || "";
  const mokepon = new Mokepon(nombre);

  const jugadorIndex = jugadores.findIndex(
    (jugador) => jugador.id === jugadorId
  );

  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].asignarMokepon(mokepon);
  }

  console.log(jugadores);
  console.log(jugadorId);
  res.end();
});

app.post("/mokepon/:jugadorId/posicion", (req, res) => {
  const jugadorId = req.params.jugadorId || "";
  const x = req.body.x || 0;
  const y = req.body.y || 0;

  const jugadorIndex = jugadores.findIndex(
    (jugador) => jugador.id === jugadorId
  );

  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].actualiarPosicion(x, y);
  }

  const enemigos = jugadores.filter((jugador) => jugador.id !== jugadorId);

  // res.end();
  res.send({ enemigos });
});

app.post("/mokepon/:jugadorId/ataques", (req, res) => {
  const jugadorId = req.params.jugadorId || "";
  const ataques = req.body.ataques || [];

  const jugadorIndex = jugadores.findIndex(
    (jugador) => jugador.id === jugadorId
  );

  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].asignarAtaques(ataques);
  }

  res.end();
});

app.get("/mokepon/:jugadorId/ataques", (req, res) => {
  const jugadorId = req.params.jugadorId || "";
  const jugador = jugadores.find((jugador) => jugador.id === jugadorId);

  res.send({
    ataques: jugador.ataques || [],
  });
});

// LIMPIAR JUEGO
// app.delete("/mokepon/:jugadorId/id", (req, res) => {
//   const jugadorId = req.params.jugadorId || "";
//   // const jugador = jugadores.find((jugador) => jugador.id === jugadorId);

//   res.end();

// });

app.listen(puerto, () => {
  console.log("El Puerto " + puerto + " esta activo");
});
