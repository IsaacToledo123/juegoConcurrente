export function isOnPath(position) {
    const pathSegments = [
        { start: { x: 0, z: 0 }, end: { x: 20, z: 0 } },
        { start: { x: 20, z: 1 }, end: { x: 20, z: -11 } },
        { start: { x: 21, z: -10 }, end: { x: 9, z: -10 } },
        { start: { x: 10, z: -10 }, end: { x: 10, z: -19 } },
        { start: { x: 10, z: -18 }, end: { x: 18, z: -18 } }
      ];
  
    return pathSegments.some(segment => {
      const minX = Math.min(segment.start.x, segment.end.x) - 2.5 / 2;
      const maxX = Math.max(segment.start.x, segment.end.x) + 2.5 / 2;
      const minZ = Math.min(segment.start.z, segment.end.z) - 2.5 / 2;
      const maxZ = Math.max(segment.start.z, segment.end.z) + 2.5 / 2;
  
      return position.x >= minX && position.x <= maxX && position.z >= minZ && position.z <= maxZ;
    });
  }
  