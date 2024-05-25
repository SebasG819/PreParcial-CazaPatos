// Establece la conexión del socket
const socket = io("");

// Declaración de variables para imágenes de los patos y el cursor del juego
let duck, duck2;
let ducks = [];
let spawnInterval = 1500; // Intervalo de tiempo para generar patos normales
let proSpawnInterval = 5000; // Intervalo de tiempo para generar patos especiales
let lastSpawnTime = 0;
let lastProSpawnTime = 0;
let positionX = [0, 264, 528, 792, 1056, 1320]; // Posiciones posibles en el eje X para los patos

// Variables para el temporizador del juego
let count = 60;
let countInterval = 1000;
let lastCountUpdate = 0;

// Variables para la posición del cursor
let cursorX;
let cursorY;
let game_cursor;

// Variables para la puntuación y el estado del juego
let score = 0;
let isGameOver = false

// Clase para los patos
class Duck{
  constructor(img, speed){
    this.x = random(positionX); // Posición inicial aleatoria en el eje X
    this.y = 0; // Posición inicial en el eje Y
    this.speed = speed; // Velocidad de movimiento del pato
    this.img = img; // Imagen del pato
  }

  update(){
    this.y += this.speed; // Actualiza la posición Y del pato
  }

  show(){
    image(this.img, this.x, this.y, 100, 100); // Dibuja el pato en el lienzo
  }
}

// Cargar imágenes
function preload() {
  duck = loadImage('img/pato.png'); 
  duck2 = loadImage('img/PatoEspecial.png');
  game_cursor = loadImage('img/mira.png');
}

// Configuración inicial
function setup() {
    frameRate(60) // Establece la tasa de fotogramas a 60 fps
    createCanvas(1320, 650); // Crea el lienzo del juego
    cursor(game_cursor); // Establece el cursor personalizado
    noCursor(); // Oculta el cursor predeterminado

    // Configuración de los eventos del socket
    socket.on('derecho', moveRight);
    socket.on('izquierdo', moveLeft);
    socket.on('disparo', Shoot);
}

// Función principal de dibujo
function draw() {
  background(220); // Fondo gris claro

  // Actualización del temporizador si el juego no ha terminado
  if (!isGameOver && millis() - lastCountUpdate > countInterval && count > 0) {
    count--;
    lastCountUpdate = millis();
  }

  // Mostrar el temporizador y la puntuación
  textSize(24);
  fill(0);
  stroke(10);
  text(`Time: ${count} `, 1100, 30);
  text(`Score: ${score}`, 1100, 70);

  // Verificar si el tiempo ha llegado a cero para finalizar el juego
  if(count == 0){
    isGameOver = true
  }

  // Actualizar la posición del cursor
  cursorX = mouseX;
  cursorY = mouseY;
  image(game_cursor, cursorX, cursorY, 40, 40);

  // Generar patos normales a intervalos regulares
  if(!isGameOver && millis() - lastSpawnTime > spawnInterval){
    let newDuck = new Duck(duck, 1);
    ducks.push(newDuck);
    lastSpawnTime = millis();
  }

  // Generar patos especiales a intervalos regulares
  if(!isGameOver && millis() - lastProSpawnTime > proSpawnInterval){
    let newDuck2 = new Duck(duck2, 4);
    ducks.push(newDuck2);
    lastProSpawnTime = millis();
  }

  // Actualizar y mostrar todos los patos en el lienzo
  for (let i = ducks.length - 1; i >= 0; i--) {
    ducks[i].update();
    ducks[i].show();

    // Eliminar los patos que hayan salido de la pantalla
    if (ducks[i].x < -50) {
        ducks.splice(i, 1); 
    }
  }

  // Mostrar pantalla de Game Over
  if(isGameOver){
    fill(0, 100);
    rect(0, 0, width, height);

    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);
    text(`Score: ${score}`, width / 2, height / 2+20)
  }
}

// Función para disparar a los patos
function Shoot(){
  if (!isGameOver && mouseIsPressed) {
    for (let i = ducks.length - 1; i >= 0; i--) {
      const duck = ducks[i];
      const duckX = duck.x;
      const duckY = duck.y;
      const duckWidth = 100;  
      const duckHeight = 100;

      // Verificar si el disparo golpea un pato
      if (
        mouseX >= duckX &&
        mouseX <= duckX + duckWidth &&
        mouseY >= duckY &&
        mouseY <= duckY + duckHeight
      ) {
        // Incrementar la puntuación según el tipo de pato
        if(duck.img === duck2){
          score += 30;
        } else {
          score += 10;
        }

        ducks.splice(i, 1); // Eliminar el pato golpeado
      }
    }
  } 
}

// Funciones para mover el cursor hacia la derecha
function moveRight() {
  cursorX += 5;
}

// Funciones para mover el cursor hacia la izquierda
function moveLeft() {
  cursorX -= 5;
}
