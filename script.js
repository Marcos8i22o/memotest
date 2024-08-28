const $botonEmpezar = document.querySelector("#boton-empezar");
const $botonReiniciar = document.querySelector("#boton-reiniciar");
const $tablero = document.querySelector("#tablero");
const $imagenes = document.querySelectorAll("img");
const $cuadros = document.querySelectorAll(".cuadro");

const cartasSeleccionadas = [];
let cartasJugadas = 0;

bloquearTablero();

$botonEmpezar.onclick = function () {
  actualizarEstado(`Cartas ocultas: ${cartas.length - cartasJugadas}`);
  desbloquearTablero();
  deshabilitarBotonEmpezar();
  mezclarCartas($imagenes);
};

const cartas = Object.values($imagenes);

$botonReiniciar.onclick = reiniciarPartida;

function reiniciarPartida() {
  actualizarEstado(`Cartas ocultas: ${cartas.length}`);
  reiniciarJugada();
  cartasJugadas = 0;
  reiniciarTablero();
  mezclarCartas($imagenes);
}

$tablero.onclick = manejarRonda;

function mezclarCartas($imagenes) {
  const totalDeCartas = cartas.length;

  for (let i = totalDeCartas - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * totalDeCartas);
    [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
  }

  let i = 0;
  $imagenes.forEach(function (imagen) {
    imagen = cartas[i];
    $cuadros[i].appendChild(imagen);
    i++;
  });
}

function manejarRonda(e) {
  let cartaElegida = elegirCarta(e);
  if (cartaElegida !== "") {
    mostrarCarta(cartaElegida);
    const PAR = 2;
    if (cartasSeleccionadas.length === PAR) {
      const indiceUno = cartasSeleccionadas[cartasSeleccionadas.length - 2];
      const indiceDos = cartasSeleccionadas[cartasSeleccionadas.length - 1];

      const sonIguales = compararCartas(indiceUno, indiceDos);
      if (sonIguales) {
        setTimeout(deshabilitarPar(indiceUno), deshabilitarPar(indiceDos), 500);
        cartasJugadas += PAR;
        actualizarEstado(`Cartas ocultas: ${cartas.length - cartasJugadas}`);
      } else {
        setTimeout(function () {
          voltearCartas();
        }, 1000);
      }
      reiniciarJugada();
    }

    if (cartasJugadas === cartas.length) {
      actualizarEstado(
        "¡Felicitaciones! Ha ganado la partida. Para volver a jugar, presione REINICIAR."
      );
    }
  }
}

function reiniciarTablero() {
  cartas.forEach(function (carta) {
    if (carta.classList.contains("oculto")) {
      return "";
    } else if (carta.classList.contains("carta-jugada")) {
      carta.classList.remove("carta-jugada");
      carta.parentNode.classList.add("bg-secondary");
    }
    carta.classList.add("oculto");
  });
}

function elegirCarta(e) {
  if (e.target.tagName === "DIV") {
    const cartaElegida = e.target.querySelector("img");
    return cartaElegida;
  }
  return "";
}

function mostrarCarta(cartaElegida) {
  const indice = cartas.indexOf(cartaElegida);

  if (cartaElegida !== -1) {
    cartas[indice].classList.remove("oculto");
    cartasSeleccionadas.push(indice);
  }
}

function deshabilitarPar(indice) {
  cartas[`${indice}`].parentNode.classList.remove("bg-secondary");
  cartas[`${indice}`].classList.add("carta-jugada");
}

function bloquearTablero() {
  $tablero.style.pointerEvents = "none";
}

function desbloquearTablero() {
  $tablero.style.pointerEvents = "all";
}

function compararCartas(indiceUno, indiceDos) {
  let cartasIguales = true;

  if (cartas[indiceUno].alt != cartas[indiceDos].alt) {
    cartasIguales = false;
  }

  return cartasIguales;
}

function voltearCartas() {
  cartas.forEach(function (carta) {
    if (cartas.length === cartasJugadas) {
      carta.classList.remove("carta-jugada");
      carta.parentNode.classList.add("bg-secondary");
    }
    if (carta.classList.contains("carta-jugada")) {
      return "";
    }
    carta.classList.add("oculto");
  });
}

function reiniciarJugada() {
  return (cartasSeleccionadas.length = 0);
}

function deshabilitarBotonEmpezar() {
  $botonEmpezar.disabled = "true";
}

function actualizarEstado(mensaje) {
  document.querySelector("#info-jugador").textContent = mensaje;
}
