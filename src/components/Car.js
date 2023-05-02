import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Car {
    constructor() {
        this.group = new THREE.Group();

        this.speed = 0;
        this.velocity = new THREE.Vector3();
        this.accelerationForce = 0;
        this.brakingForce = 0;
        this.maxSpeed = 100;
        this.maxReverseSpeed = -200;
        this.accelerationRate = 40;
        this.brakingRate = 150;
        this.turningRate = 0.03; // Decreased turning rate for smoother turns
        this.currentTurningRate = this.turningRate;
        this.driftControl = 0.9; // Drift control factor
        this.handbrakeForce = 0;
        this.handbrakeRate = 180;
        this.handbrakeTurningMultiplier = .5;
        this.handbrakeLateralFactor = 0;
        this.handbrakeStrength = 1.2;
        this.handbrakeReleaseSpeed = 0.05;
        this.driftForce = 0;
        this.slip_speed = 1.0;
        this.traction_slow = 0.75;
        this.traction_fast = 0.015;
        this.drifting = false;

        this.pivot = new THREE.Object3D();
        this.group.add(this.pivot);

        const loader = new GLTFLoader();
        loader.load(require('../assets/models/cartoonCar.gltf'), gltf => {
            this.carModel = gltf.scene;
            this.carModel.position.set(0, 0, 1);
            this.pivot.add(this.carModel);
        });

        this.group.scale.set(1, 1, 1);
        this.group.position.y = 2;
    }

    accelerate() {
        this.accelerationForce = this.accelerationRate;
    }

    brake() {
        if (this.speed > 0) {
            this.brakingForce = this.brakingRate;
        } else {
            this.accelerationForce = -this.accelerationRate;
        }
    }

    handbrake() {
        if (this.speed > 0.1) { // Make sure the car is moving before applying handbrake
            this.handbrakeForce = this.handbrakeRate;
        }
    }

    turn(direction) {
        if (this.speed <= 0.1) return; // Don't turn if the car is not moving
        this.turningDirection = direction; // Store the turning direction
        const turningMultiplier = this.handbrakeForce ? this.handbrakeTurningMultiplier : 1;

        // Calculate the speed factor for turning arc adjustment
        const speedFactor = 1 + (this.maxSpeed - this.speed) / this.maxSpeed;

        // Clamp the speed factor to a range to prevent extreme turning behavior
        const clampedSpeedFactor = Math.min(Math.max(speedFactor, 0.9), 1);

        // Adjust the turning rate based on the clamped speed factor (balanced turns at different speeds)
        const rotation = this.currentTurningRate * direction * clampedSpeedFactor * turningMultiplier;
        this.pivot.rotation.y += rotation;

        if (this.handbrakeForce) {
            this.driftForce = direction * this.speed * this.handbrakeLateralFactor * this.driftControl;
        } else {
            this.driftForce = 0;
        }
    }

    calculateLateralVelocity() {
        const forwardDirection = new THREE.Vector3(1, 0, 0);
        forwardDirection.applyQuaternion(this.pivot.quaternion);
        const lateralDirection = forwardDirection.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
        return this.velocity.clone().projectOnVector(lateralDirection);
    }

    update(deltaTime) {
        this.speed += this.accelerationForce * deltaTime;
        this.speed -= this.brakingForce * deltaTime;

        if (!this.accelerationForce && !this.brakingForce) {
            this.speed *= 0.995;
        }

        // Calculate the forward direction based on the car's rotation
        const forwardDirection = new THREE.Vector3(1, 0, 0);
        forwardDirection.applyQuaternion(this.pivot.quaternion);

        // Check if the car is drifting and update the drifting state
        if (!this.drifting && this.speed > this.slip_speed && this.handbrakeForce) {
            this.drifting = true;
        }
        if (this.drifting && (this.speed < this.slip_speed || this.turningDirection === 0)) {
            this.drifting = false;
        }

        // Choose the appropriate traction value based on the drifting state
        const traction = this.drifting ? this.traction_fast : this.traction_slow;

        // Update the car's velocity based on the new traction value and forward direction
        this.velocity.lerp(forwardDirection.clone().multiplyScalar(this.speed), traction);

        // Update the car's position based on the updated velocity
        this.group.position.add(this.velocity.clone().multiplyScalar(deltaTime));

        // Calculate lateral velocity and apply drift force
        const lateralVelocity = this.calculateLateralVelocity();
        this.group.position.add(lateralVelocity.clone().multiplyScalar(-this.driftForce * deltaTime));

        // Update the car's rotation based on the handbrake state
        if (this.handbrakeForce && this.speed > 0.1) {
            this.handbrakeEngaged = true;
            this.pivot.rotation.y += this.handbrakeStrength * deltaTime * this.turningDirection;
            this.handbrakeLateralFactor = Math.max(0, this.handbrakeLateralFactor - this.handbrakeReleaseSpeed * deltaTime);
        } else {
            this.handbrakeEngaged = false;
            this.handbrakeLateralFactor = Math.min(1, this.handbrakeLateralFactor + this.handbrakeReleaseSpeed * deltaTime);
        }

        // Reset acceleration, braking, handbrake forces, and drift force
        this.accelerationForce = 0;
        this.brakingForce = 0;
        this.handbrakeForce = 0;
        this.driftForce = 0;
    }

    getTirePositions() {
        const leftTireOffset = new THREE.Vector3(2.5, 0, -3); // Adjust these values according to your car model
        const rightTireOffset = new THREE.Vector3(2.5, 0, 3); // Adjust these values according to your car model
        const leftTirePosition = leftTireOffset.clone().applyQuaternion(this.pivot.quaternion).add(this.group.position);
        const rightTirePosition = rightTireOffset.clone().applyQuaternion(this.pivot.quaternion).add(this.group.position);
        return [leftTirePosition, rightTirePosition];
    }
}

export default Car;

