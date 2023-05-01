import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Car {
  constructor() {
    this.group = new THREE.Group();

    this.speed = 0;
    this.accelerationForce = 0;
    this.brakingForce = 0;
    this.maxSpeed = 420;
    this.accelerationRate = 50.8;
    this.brakingRate = 101.2;
    this.turningRate = 0.03;

    // Load car model using GLTFLoader
    const loader = new GLTFLoader();
    loader.load(require('../assets/models/cartoonCar.gltf'), gltf => {
      this.carModel = gltf.scene;
      this.group.add(this.carModel);
    });

    this.group.scale.set(5, 5, 5);
    this.group.position.y = 12;
  }

  accelerate() {
    this.accelerationForce = this.accelerationRate;
  }

  brake() {
    this.brakingForce = this.brakingRate;
  }

  turn(direction) {
    this.group.rotation.y += this.turningRate * direction;
  }

  update(deltaTime) {
    // Apply acceleration and braking forces
    this.speed += this.accelerationForce * deltaTime;
    this.speed -= this.brakingForce * deltaTime;

    // Limit the speed between 0 and maxSpeed
    this.speed = THREE.MathUtils.clamp(this.speed, 0, this.maxSpeed);

    // Calculate the forward direction
    const forwardDirection = new THREE.Vector3(1, 0, 0);
    forwardDirection.applyQuaternion(this.group.quaternion);

    // Update the car's position based on the speed
    this.group.position.add(forwardDirection.multiplyScalar(this.speed * deltaTime));

    // Reset acceleration and braking forces
    this.accelerationForce = 0;
    this.brakingForce = 0;
  }
}

export default Car;





// createCar(color) {
//     const main = new THREE.Mesh(
//     new THREE.BoxGeometry(60, 30, 15),
//     new THREE.MeshLambertMaterial({ color: color })
//     );
//     main.position.z = 12;
//     this.group.add(main);

//     const cabin = new THREE.Mesh(
//     new THREE.BoxGeometry(33, 24, 12),
//     new THREE.MeshLambertMaterial({ color: 0xffffff })
//     );
//     cabin.position.x = -6;
//     cabin.position.z = 25.5;
//     this.group.add(cabin);

//     const backWheel = this.createWheel();
//     backWheel.position.z = 6;
//     backWheel.position.x = -18;
//     this.group.add(backWheel);

//     const frontWheel = this.createWheel();
//     frontWheel.position.z = 6;
//     frontWheel.position.x = 18;
//     this.group.add(frontWheel);

//     this.group.rotation.z = (Math.PI / 2) * 3;
//     this.group.rotation.y = Math.PI;
//     this.group.rotation.x = Math.PI /2;
// }

// createWheel() {
//     const wheel = new THREE.Mesh(
//     new THREE.BoxGeometry(12, 33, 12),
//     new THREE.MeshLambertMaterial({ color: 0x333333 })
//     );
//     wheel.position.z = 6;
//     return wheel;
// }

// randomColor() {
//     const colors = [0x00ff00, 0xff0000, 0x0000ff];
//     return colors[Math.floor(Math.random() * colors.length)];
// }