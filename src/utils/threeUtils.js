// Utility to recursively dispose Three.js scene objects, geometries, and materials
export function disposeThreeScene(scene, renderer) {
  if (!scene) return;

  scene.traverse((obj) => {
    if (obj.geometry) {
      obj.geometry.dispose();
    }
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach((mat) => {
          disposeMaterial(mat);
        });
      } else {
        disposeMaterial(obj.material);
      }
    }
  });

  if (renderer) {
    renderer.dispose();
  }
}

function disposeMaterial(mat) {
  if (!mat) return;
  // Dispose all associated textures
  for (const key of Object.keys(mat)) {
    const value = mat[key];
    if (value && typeof value === 'object' && 'minFilter' in value) {
      value.dispose();
    }
  }
  mat.dispose();
}

