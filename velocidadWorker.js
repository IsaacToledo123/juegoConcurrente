let ballSpeed = 0.1;
setInterval(() => {
  ballSpeed += 0.2;
  postMessage(ballSpeed);
}, 5000);
