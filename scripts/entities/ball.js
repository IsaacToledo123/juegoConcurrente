import { isOnPath } from './utils.js';

let ball;
let ballSpeed = 0.1;
let gameOver = false;
let keyState = {};

export function initBall(scene) {
  const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(0, 0.3, 0);
  scene.add(ball);
}

export function updateBall(camera) {
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
    setTimeout(restartGame, 5000);
  }

  camera.position.x = ball.position.x;
  camera.position.z = ball.position.z + 15;
  camera.lookAt(ball.position);
}

function endGame(message) {
  gameOver = true;
  document.getElementById('message').innerText = message;
  document.getElementById('message').style.display = 'block';
}

function restartGame() {
  gameOver = false;
  ball.position.set(0, 0.3, 0);
  document.getElementById('message').style.display = 'none';
}
