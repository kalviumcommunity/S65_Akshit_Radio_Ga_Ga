import * as three from "three";

const blockGeometry = new three.BoxGeometry(1, 1, 1);
const blockMaterial = new three.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.8,
  metalness: 0.2,
});

interface WorldSize {
  renderDistance: number; // Distance in blocks from center (128 means 256x256 total area)
}

class World extends three.Group {
  size: WorldSize;

  constructor(size: WorldSize = { renderDistance: 128 }) {
    super();
    this.size = size;
  }

  generate() {
    // Create a massive plane using instanced cubes
    // Total area: (2 * renderDistance) x (2 * renderDistance) blocks
    const totalBlocks = (this.size.renderDistance * 2) ** 2;

    const instancedMesh = new three.InstancedMesh(
      blockGeometry,
      blockMaterial,
      totalBlocks
    );

    const matrix = new three.Matrix4();345
    let instanceIndex = 0;
    999;
    // Generate a flat plane of blocks
    for (let x = -this.size.renderDistance; x < this.size.renderDistance; x++) {
      for (
        let z = -this.size.renderDistance;
        z < this.size.renderDistance;
        z++
      ) {
        // Position blocks at y = -0.5 so the top surface is at y = 0
        matrix.setPosition(x, -0.5, z);
        instancedMesh.setMatrixAt(instanceIndex++, matrix);
      }
    }

    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;
    instancedMesh.count = instanceIndex;

    this.add(instancedMesh);
  }
}

export default World;
