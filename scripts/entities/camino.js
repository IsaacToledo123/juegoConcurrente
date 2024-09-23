let pathSegments = [];
export function createPath() {
    const pathMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  
    
    pathSegments = [
      { start: { x: -20, z: 0 }, end: { x: 20, z: 0 } },
      { start: { x: 20, z: 1 }, end: { x: 20, z: -11 } },
      { start: { x: 21, z: -10 }, end: { x: 9, z: -10 } },
      { start: { x: -10, z: -9 }, end: { x: -10, z: -20 } },
      { start: { x: -10, z: -18 }, end: { x: 18, z: -18 } },
      { start: { x: -10, z: -10 }, end: { x: 10, z: -10 } },
  
    ];
  
    // Crear los segmentos del camino
    pathSegments.forEach(segment => {
      createPathSegment(segment.start.x, segment.start.z, segment.end.x, segment.end.z, pathMaterial);
    });
  }
  