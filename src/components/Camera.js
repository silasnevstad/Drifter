import * as THREE from 'three';

class Camera {
  constructor() {
    const fov = 90;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.cameraOffset = new THREE.Vector3(0, 250, 150);
  }

  update(car) {
    // Set a fixed camera offset
    const cameraOffset = new THREE.Vector3(-270, 200, 0);

    // Create a matrix to apply the car's rotation to the camera offset
    const matrix = new THREE.Matrix4();
    matrix.extractRotation(car.group.matrix);

    // Apply the car's rotation to the camera offset
    const rotatedOffset = cameraOffset.clone();
    rotatedOffset.applyMatrix4(matrix);

    // Set the desired camera position based on the car's position and the rotated camera offset
    const desiredPosition = car.group.position.clone().add(rotatedOffset);

    // Use lerp function to smoothly interpolate between the current camera position and the desired camera position
    const lerpFactor = 0.05;
    this.camera.position.lerp(desiredPosition, lerpFactor);

    // Look at the car's position
    this.camera.lookAt(car.group.position);
  }
}

export default Camera;
