let deaths = 0;
onmessage = function(event) {
  if (event.data === "death") {
    deaths++;
    postMessage(deaths); 
  }
};
