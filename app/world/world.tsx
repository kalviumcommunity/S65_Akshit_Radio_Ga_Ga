import * as three from "three";

const blockGeometry = new three.BoxGeometry(1, 1, 1);
const blockMaterial = new three.MeshPhysicalMaterial({
  metalness: 0,
  roughness: 1,
  color: 0xffffff,
});
// const blockMaterial = new three.MeshBasicMaterial({
//   color: 0xffffff,
// });
class World extends three.Group {
  size;
  constructor(size = { length: 16, width: 16, height: 128 }) {
    super();
    this.size = size;
  }
  generate() {
    const maxCount = this.size.length * this.size.width * this.size.height;
    const mesh = new three.InstancedMesh(
      blockGeometry,
      blockMaterial,
      maxCount
    );
    const matrix = new three.Matrix4();
    mesh.count = 0;
    for (let x = 0; x < this.size.length; x++) {
      for (let y = 0; y < this.size.height; y++) {
        for (let z = 0; z < this.size.width; z++) {
          matrix.setPosition(1.5 * x + 0.5, 0 - (1.5 * y + 0.5), 1.5 * z + 0.5);
          mesh.setMatrixAt(mesh.count++, matrix);
        }
      }
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.add(mesh);
  }
}

export default World;
