// --- Obtener elementos del DOM ---
const lienzoJuego = document.getElementById("lienzoJuego");
const ctx = lienzoJuego.getContext("2d"); // Contexto 2D para dibujar en el canvas

const puntuacionDisplay = document.getElementById("puntuacionDisplay");
const botonIniciar = document.getElementById("botonIniciar");

// --- Configuración del Juego ---
const TAMANO_CELDA = 20; // Tamaño de cada segmento de la serpiente y la comida
const ANCHO_LIENZO = lienzoJuego.width;
const ALTO_LIENZO = lienzoJuego.height;

let serpiente = [
  { x: 10 * TAMANO_CELDA, y: 10 * TAMANO_CELDA }, // La cabeza de la serpiente
];
let comida = {}; // Objeto para la posición de la comida
let direccionX = TAMANO_CELDA; // Dirección inicial en X (moviéndose a la derecha)
let direccionY = 0; // Dirección inicial en Y (sin movimiento vertical)
let puntuacion = 0;
let juegoTerminado = false;
let juegoIniciado = false;
let intervaloJuego; // Para almacenar el ID del intervalo de tiempo del juego
let velocidad = 150; // Milisegundos, menor número = más rápido

// --- Funciones de Dibujo ---

// Función para dibujar una "celda" (cuadrado) en el lienzo
function dibujarCelda(x, y, color) {
  ctx.fillStyle = color; // Color de relleno
  ctx.strokeStyle = "darkgreen"; // Color del borde
  ctx.fillRect(x, y, TAMANO_CELDA, TAMANO_CELDA); // Dibuja el cuadrado
  ctx.strokeRect(x, y, TAMANO_CELDA, TAMANO_CELDA); // Dibuja el borde del cuadrado
}

// Función para dibujar toda la serpiente
function dibujarSerpiente() {
  serpiente.forEach((segmento) => {
    dibujarCelda(segmento.x, segmento.y, "lime"); // La serpiente es verde lima
  });
}

// Función para dibujar la comida
function dibujarComida() {
  dibujarCelda(comida.x, comida.y, "red"); // La comida es roja
}

// Función para limpiar el lienzo
function limpiarLienzo() {
  ctx.fillStyle = "#1a252f"; // El mismo color de fondo del lienzo
  ctx.fillRect(0, 0, ANCHO_LIENZO, ALTO_LIENZO); // Rellena todo el lienzo
}

// --- Lógica del Juego ---

// Genera una posición aleatoria para la comida
function generarComida() {
  let nuevaX, nuevaY;
  let colisionConSerpiente;

  do {
    // Genera coordenadas aleatorias que sean múltiplos de TAMANO_CELDA
    nuevaX =
      Math.floor(Math.random() * (ANCHO_LIENZO / TAMANO_CELDA)) * TAMANO_CELDA;
    nuevaY =
      Math.floor(Math.random() * (ALTO_LIENZO / TAMANO_CELDA)) * TAMANO_CELDA;

    // Comprueba si la nueva posición colisiona con algún segmento de la serpiente
    colisionConSerpiente = serpiente.some(
      (segmento) => segmento.x === nuevaX && segmento.y === nuevaY
    );
  } while (colisionConSerpiente); // Repite si la comida aparece dentro de la serpiente

  comida = { x: nuevaX, y: nuevaY };
}

// Mueve la serpiente un paso
function moverSerpiente() {
  // Crea la nueva cabeza de la serpiente
  const cabezaNueva = {
    x: serpiente[0].x + direccionX,
    y: serpiente[0].y + direccionY,
  };
  serpiente.unshift(cabezaNueva); // Añade la nueva cabeza al inicio del array

  // Comprueba si la serpiente comió
  if (cabezaNueva.x === comida.x && cabezaNueva.y === comida.y) {
    puntuacion += 10;
    puntuacionDisplay.textContent = `Puntuación: ${puntuacion}`;
    generarComida(); // Genera nueva comida
    // Opcional: Aumentar la velocidad del juego al comer
    // if (velocidad > 50) velocidad -= 5;
    // reiniciarIntervaloJuego();
  } else {
    serpiente.pop(); // Si no comió, quita el último segmento (para simular el movimiento)
  }
}

// Reinicia el intervalo de juego (útil si la velocidad cambia)
function reiniciarIntervaloJuego() {
  clearInterval(intervaloJuego);
  intervaloJuego = setInterval(buclePrincipalJuego, velocidad);
}

// Comprueba si la serpiente colisionó
function verificarColision() {
  const cabeza = serpiente[0];

  // Colisión con las paredes
  const colisionPared =
    cabeza.x < 0 ||
    cabeza.x >= ANCHO_LIENZO ||
    cabeza.y < 0 ||
    cabeza.y >= ALTO_LIENZO;

  // Colisión con el propio cuerpo (empezamos desde el 4to segmento para evitar colisión con la cabeza misma)
  const colisionCuerpo = serpiente
    .slice(1)
    .some((segmento) => segmento.x === cabeza.x && segmento.y === cabeza.y);

  if (colisionPared || colisionCuerpo) {
    juegoTerminado = true;
    clearInterval(intervaloJuego); // Detiene el juego
    alert(`¡Juego Terminado! Tu puntuación final fue: ${puntuacion}`);
    juegoIniciado = false; // Desactivar el estado de juego iniciado
    botonIniciar.textContent = "Iniciar Juego"; // Cambiar texto del botón
  }
}

// Bucle principal del juego
function buclePrincipalJuego() {
  if (juegoTerminado) return; // Si el juego terminó, no hacer nada

  limpiarLienzo();
  moverSerpiente();
  dibujarSerpiente();
  dibujarComida();
  verificarColision();
}

// --- Manejo de Eventos ---

// Maneja los eventos de teclado para cambiar la dirección de la serpiente
function cambiarDireccion(evento) {
  const TECLA_A = 65; // Tecla 'A'
  const TECLA_W = 87; // Tecla 'W'
  const TECLA_D = 68; // Tecla 'D'
  const TECLA_S = 83; // Tecla 'S'

  const teclaPresionada = evento.keyCode;

  // Evita que la serpiente se mueva en la dirección opuesta instantáneamente
  const yendoArriba = direccionY === -TAMANO_CELDA;
  const yendoAbajo = direccionY === TAMANO_CELDA;
  const yendoIzquierda = direccionX === -TAMANO_CELDA;
  const yendoDerecha = direccionX === TAMANO_CELDA;

  switch (teclaPresionada) {
    case TECLA_A: // Izquierda
      if (!yendoDerecha) {
        direccionX = -TAMANO_CELDA;
        direccionY = 0;
      }
      break;
    case TECLA_W: // Arriba
      if (!yendoAbajo) {
        direccionX = 0;
        direccionY = -TAMANO_CELDA;
      }
      break;
    case TECLA_D: // Derecha
      if (!yendoIzquierda) {
        direccionX = TAMANO_CELDA;
        direccionY = 0;
      }
      break;
    case TECLA_S: // Abajo
      if (!yendoArriba) {
        direccionX = 0;
        direccionY = TAMANO_CELDA;
      }
      break;
  }
}

// --- Inicialización del Juego ---

// Función para reiniciar todos los valores del juego
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

// Función para iniciar o pausar el juego
function toggleJuego() {
  if (!juegoIniciado) {
    reiniciarJuego(); // Prepara el tablero para un nuevo juego
    intervaloJuego = setInterval(buclePrincipalJuego, velocidad); // Inicia el bucle
    juegoIniciado = true;
    botonIniciar.textContent = "Pausar Juego"; // Cambiar texto del botón
    document.addEventListener("keydown", cambiarDireccion); // Habilita controles de teclado
  } else {
    clearInterval(intervaloJuego); // Pausa el juego
    juegoIniciado = false;
    botonIniciar.textContent = "Reanudar Juego"; // Cambiar texto del botón
    document.removeEventListener("keydown", cambiarDireccion); // Deshabilita controles de teclado
  }
}

// --- Event Listeners ---
botonIniciar.addEventListener("click", toggleJuego);

// --- Inicialización al cargar la página ---
// Muestra el tablero limpio y la comida al cargar la página por primera vez
reiniciarJuego();
