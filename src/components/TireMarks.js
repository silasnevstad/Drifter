// import * as THREE from 'three';

// class TireMarks extends THREE.Mesh {
//   constructor() {
//     const geometry = new THREE.PlaneGeometry(5, 5);
//     const material = new THREE.MeshBasicMaterial({
//       map: new THREE.TextureLoader().load(require('../assets/textures/brown_mud_02_diff_4k.jpg')),
//       transparent: true,
//     });
//     super(geometry, material);
//     this.lifespan = 5; // lifespan in seconds
//     this.timer = 0;
//   }

//   update(deltaTime) {
//     this.timer += deltaTime;
//     if (this.timer > this.lifespan) {
//       this.parent.remove(this);
//     }
//   }
// }

// export default TireMarks;