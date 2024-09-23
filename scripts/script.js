let scene, camera, renderer, ball, goal;
let ballSpeed = 0.1;
let keyState = {};
let gameOver = false;
let messageDiv = document.getElementById('message');
let timerDiv = document.getElementById('timer');
let deathCounterDiv = document.getElementById('deathCounter');
let velocidadDiv = document.getElementById('velocidad');

let pathWidth = 2;
let pathSegments = [];
let deaths = 0;

let startButton = document.getElementById('startButton');
let startScreen = document.getElementById('startScreen');

const cronometroWorker = new Worker('cronometroWorker.js');
const velocidadWorker = new Worker('velocidadWorker.js');
const muertesWorker = new Worker('muertesWorker.js');

cronometroWorker.onmessage = function(event) {
  if (event.data === "end") {
    endGame("¡Tiempo agotado!");
  } else {
    timerDiv.innerText = "Tiempo: " + event.data;
  }
};

velocidadWorker.onmessage = function(event) {
  ballSpeed = event.data;
  velocidadDiv.innerText = "Velocidad: " + event.data;
};

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87CEEB);

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(50, 15, 25);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  createPath();

  const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(-20, 0.3, 0);
  scene.add(ball);

  const goalGeometry = new THREE.BoxGeometry(1, 1, 1);
  const goalMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  goal = new THREE.Mesh(goalGeometry, goalMaterial);
  goal.position.set(18, 1, -18);
  scene.add(goal);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  document.addEventListener('keydown', onDocumentKeyDown, false);
  document.addEventListener('keyup', onDocumentKeyUp, false);
}

startButton.addEventListener('click', function () {
  startScreen.style.display = 'none';  
  startGame(); 
});

function startGame() {
  cronometroWorker.postMessage("start");  
  animate(); 
}

function createPath() {
  const pathMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });

  pathSegments = [
    { start: { x: -20, z: 0 }, end: { x: 20, z: 0 } },
    { start: { x: 20, z: 1 }, end: { x: 20, z: -11 } },
    { start: { x: 21, z: -10 }, end: { x: 9, z: -10 } },
    { start: { x: -10, z: -9 }, end: { x: -10, z: -20 } },
    { start: { x: -10, z: -18 }, end: { x: 18, z: -18 } },
    { start: { x: -10, z: -10 }, end: { x: 10, z: -10 } },
  ];


  pathSegments.forEach(segment => {
    createPathSegment(segment.start.x, segment.start.z, segment.end.x, segment.end.z, pathMaterial);
  });
}

function createPathSegment(x1, z1, x2, z2, material) {
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
  const pathGeometry = new THREE.BoxGeometry(length, 0.1, pathWidth);
  const pathSegment = new THREE.Mesh(pathGeometry, material);

  pathSegment.position.set((x1 + x2) / 2, 0.05, (z1 + z2) / 2);  
  pathSegment.rotation.y = Math.atan2(z2 - z1, x2 - x1);

  scene.add(pathSegment);
}

function onDocumentKeyDown(event) {
  keyState[event.code] = true;
}

function onDocumentKeyUp(event) {
  keyState[event.code] = false;
}

function updateBall() {
  if (gameOver) return;

  const newPosition = ball.position.clone();

  if (keyState['ArrowUp']) newPosition.z -= ballSpeed;
  if (keyState['ArrowDown']) newPosition.z += ballSpeed;
  if (keyState['ArrowLeft']) newPosition.x -= ballSpeed;
  if (keyState['ArrowRight']) newPosition.x += ballSpeed;

  if (isOnPath(newPosition)) {
    ball.position.copy(newPosition);
  } else {
    endGame("¡Perdiste! Te saliste del camino.");
    muertesWorker.postMessage("death");
    setTimeout(restartGame, 3000);
  }

  if (ball.position.distanceTo(goal.position) < 1) {
    endGame("¡Ganaste! Llegaste a la meta.");
  }

  camera.position.x = ball.position.x;
  camera.position.z = ball.position.z + 15;
  camera.lookAt(ball.position);
}

muertesWorker.onmessage = function(event) {
  deathCounterDiv.innerText = event.data;
  console.log("Muertes: " + event.data);
};

function isOnPath(position) {
  return pathSegments.some(segment => {
    const minX = Math.min(segment.start.x, segment.end.x) - pathWidth / 2;
    const maxX = Math.max(segment.start.x, segment.end.x) + pathWidth / 2;
    const minZ = Math.min(segment.start.z, segment.end.z) - pathWidth / 2;
    const maxZ = Math.max(segment.start.z, segment.end.z) + pathWidth / 2;

    return position.x >= minX && position.x <= maxX && position.z >= minZ && position.z <= maxZ;
  });
}

function endGame(message) {
  gameOver = true;
  messageDiv.innerText = message;
  messageDiv.style.display = 'block';
}

function restartGame() {
  gameOver = false;
  messageDiv.style.display = 'none';
  ball.position.set(-20, 0.3, 0);
  cronometroWorker.postMessage("start");
}

function animate() {
  goal.rotation.x += 0.01;
  goal.rotation.y += 0.01;
  requestAnimationFrame(animate);
  updateBall();
  renderer.render(scene, camera);
}

init();
