export function setupEvents() {
    document.addEventListener('keydown', onDocumentKeyDown, false);
    document.addEventListener('keyup', onDocumentKeyUp, false);
  }
  
  function onDocumentKeyDown(event) {
    keyState[event.code] = true;
  }
  
  function onDocumentKeyUp(event) {
    keyState[event.code] = false;
  }
  