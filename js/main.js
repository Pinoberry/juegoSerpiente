const lienzoJuego = document.getElementById("lienzoJuego");
const ctx = lienzoJuego.getContext("2d");
const puntuacionDisplay = document.getElementById("puntuacionDisplay");
const botonIniciar = document.getElementById("botonIniciar");

const TAMANO_CELDA = 20;
const ANCHO_LIENZO = lienzoJuego.width;
const ALTO_LIENZO = lienzoJuego.height;

let serpiente = [{ x: 10 * TAMANO_CELDA, y: 10 * TAMANO_CELDA }];
let comida = {};
let direccionX = TAMANO_CELDA;
let direccionY = 0;
let puntuacion = 0;
let juegoTerminado = false;
let juegoIniciado = false;
let intervaloJuego;
let velocidad = 150;

function dibujarCelda(x, y, color) {
  ctx.fillStyle = color;
  ctx.strokeStyle = "darkgreen";
  ctx.fillRect(x, y, TAMANO_CELDA, TAMANO_CELDA);
  ctx.strokeRect(x, y, TAMANO_CELDA, TAMANO_CELDA);
}

function dibujarSerpiente() {
  serpiente.forEach((segmento) => {
    dibujarCelda(segmento.x, segmento.y, "lime");
  });
}

function dibujarComida() {
  dibujarCelda(comida.x, comida.y, "red");
}

function limpiarLienzo() {
  ctx.fillStyle = "#1a252f";
  ctx.fillRect(0, 0, ANCHO_LIENZO, ALTO_LIENZO);
}

function generarComida() {
  let nuevaX, nuevaY;
  let colisionConSerpiente;

  do {
    nuevaX =
      Math.floor(Math.random() * (ANCHO_LIENZO / TAMANO_CELDA)) * TAMANO_CELDA;
    nuevaY =
      Math.floor(Math.random() * (ALTO_LIENZO / TAMANO_CELDA)) * TAMANO_CELDA;

    colisionConSerpiente = serpiente.some(
      (segmento) => segmento.x === nuevaX && segmento.y === nuevaY
    );
  } while (colisionConSerpiente);

  comida = { x: nuevaX, y: nuevaY };
}

function moverSerpiente() {
  const cabezaNueva = {
    x: serpiente[0].x + direccionX,
    y: serpiente[0].y + direccionY,
  };
  serpiente.unshift(cabezaNueva);

  if (cabezaNueva.x === comida.x && cabezaNueva.y === comida.y) {
    puntuacion += 10;
    puntuacionDisplay.textContent = `Puntuación: ${puntuacion}`;
    generarComida();
  } else {
    serpiente.pop();
  }
}

function reiniciarIntervaloJuego() {
  clearInterval(intervaloJuego);
  intervaloJuego = setInterval(buclePrincipalJuego, velocidad);
}

function verificarColision() {
  const cabeza = serpiente[0];

  const colisionPared =
    cabeza.x < 0 ||
    cabeza.x >= ANCHO_LIENZO ||
    cabeza.y < 0 ||
    cabeza.y >= ALTO_LIENZO;

  const colisionCuerpo = serpiente
    .slice(1)
    .some((segmento) => segmento.x === cabeza.x && segmento.y === cabeza.y);

  if (colisionPared || colisionCuerpo) {
    juegoTerminado = true;
    clearInterval(intervaloJuego);
    alert(`¡Juego Terminado! Tu puntuación final fue: ${puntuacion}`);
    juegoIniciado = false;
    botonIniciar.textContent = "Iniciar Juego";
  }
}

function buclePrincipalJuego() {
  if (juegoTerminado) return;

  limpiarLienzo();
  moverSerpiente();
  dibujarSerpiente();
  dibujarComida();
  verificarColision();
}

function cambiarDireccion(evento) {
  const TECLA_A = 65;
  const TECLA_W = 87;
  const TECLA_D = 68;
  const TECLA_S = 83;

  const teclaPresionada = evento.keyCode;

  const yendoArriba = direccionY === -TAMANO_CELDA;
  const yendoAbajo = direccionY === TAMANO_CELDA;
  const yendoIzquierda = direccionX === -TAMANO_CELDA;
  const yendoDerecha = direccionX === TAMANO_CELDA;

  switch (teclaPresionada) {
    case TECLA_A:
      if (!yendoDerecha) {
        direccionX = -TAMANO_CELDA;
        direccionY = 0;
      }
      break;
    case TECLA_W:
      if (!yendoAbajo) {
        direccionX = 0;
        direccionY = -TAMANO_CELDA;
      }
      break;
    case TECLA_D:
      if (!yendoIzquierda) {
        direccionX = TAMANO_CELDA;
        direccionY = 0;
      }
      break;
    case TECLA_S:
      if (!yendoArriba) {
        direccionX = 0;
        direccionY = TAMANO_CELDA;
      }
      break;
  }
}

function reiniciarJuego() {
  serpiente = [{ x: 10 * TAMANO_CELDA, y: 10 * TAMANO_CELDA }];
  direccionX = TAMANO_CELDA;
  direccionY = 0;
  puntuacion = 0;
  puntuacionDisplay.textContent = `Puntuación: ${puntuacion}`;
  juegoTerminado = false;

  limpiarLienzo();
  generarComida();
  dibujarSerpiente();
  dibujarComida();
}

function toggleJuego() {
  if (!juegoIniciado) {
    reiniciarJuego();
    intervaloJuego = setInterval(buclePrincipalJuego, velocidad);
    juegoIniciado = true;
    botonIniciar.textContent = "Pausar Juego";
    document.addEventListener("keydown", cambiarDireccion);
  } else {
    clearInterval(intervaloJuego);
    juegoIniciado = false;
    botonIniciar.textContent = "Reanudar Juego";
    document.removeEventListener("keydown", cambiarDireccion);
  }
}

botonIniciar.addEventListener("click", toggleJuego);

reiniciarJuego();
