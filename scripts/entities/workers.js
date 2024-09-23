let cronometroWorker = new Worker('cronometroWorker.js');
let velocidadWorker = new Worker('velocidadWorker.js');
let muertesWorker = new Worker('muertesWorker.js');

export function setupWorkers() {
  cronometroWorker.onmessage = function(event) {
    if (event.data === "end") {
      endGame("¡Tiempo agotado!");
    } else {
      document.getElementById('timer').innerText = "Tiempo: " + event.data;
    }
  };

  velocidadWorker.onmessage = function(event) {
    ballSpeed = event.data;
  };

  muertesWorker.onmessage = function(event) {
    document.getElementById('deathCounter').innerText = event.data;
  };
}
