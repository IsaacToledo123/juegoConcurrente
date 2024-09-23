let timeLeft = 60;
setInterval(() => {
  timeLeft--;
  postMessage(timeLeft); 
  if (timeLeft <= 0) {
    postMessage("end");  
  }
}, 1000);
