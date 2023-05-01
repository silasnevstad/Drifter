import React, { Component } from 'react';
import * as THREE from 'three';
import Car from './Car';
import World from './World';
import Camera from './Camera';
import InputHandler from './InputHandler';

class DriftGame extends Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }
  
  componentDidMount() {
    this.initScene();
    this.initLights();
    this.initObjects();
    this.initInputHandler();
    this.startAnimationLoop();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  
    // Append the renderer's DOM element to the container ref instead of the document body
    this.container.current.appendChild(this.renderer.domElement);
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 0);
    this.scene.add(directionalLight);
  }

  initObjects() {
    this.world = new World();
    this.scene.add(this.world.group);

    this.car = new Car();
    this.scene.add(this.car.group);
    
    this.camera = new Camera();
  }

  initInputHandler() {
    this.inputHandler = new InputHandler(this.car);
  }

  startAnimationLoop() {
    const animate = () => {
      requestAnimationFrame(animate);
  
      const deltaTime = this.clock.getDelta();
      this.inputHandler.update();
      this.car.update(deltaTime);
      this.camera.update(this.car);
  
      this.renderer.render(this.scene, this.camera.camera);
    };
  
    this.clock = new THREE.Clock();
    animate();
  }
  
  render() {
    return <div ref={this.container} />;
  }
}

export default DriftGame;




















// import React, { useRef, useEffect } from 'react';
// import Car from '../World/Car';
// import { renderMap, updateGroundTiles } from '../World/World';
// import * as THREE from 'three';
// import './Game.module.css';

// function Game() {
//   const canvasRef = useRef(null);

//   // Set up scene
//   const scene = new THREE.Scene();

//   // Set up car
//   const playerCar = new Car();
//   scene.add(playerCar.group);

//   // Set up lights
//   const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//   scene.add(ambientLight);

//   const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
//   directionalLight.position.set(100, -300, 400);
//   scene.add(directionalLight);

//   // Set up camera
//   const aspectRatio = window.innerWidth / window.innerHeight;
//   const cameraWidth = 960;
//   const cameraHeight = cameraWidth / aspectRatio;

//   const camera = new THREE.OrthographicCamera(
//     cameraWidth / -2, // left
//     cameraWidth / 2, // right
//     cameraHeight / 2, // top
//     cameraHeight / -2, // bottom
//     0, // near plane
//     1000 // far plane
//   );
//   camera.position.set(0, -110, 250);
//   camera.up.set(0, 0, 1);
//   camera.lookAt(0, 0, 0);

//   const groundTiles = renderMap(cameraWidth, cameraHeight * 2, scene);

//   // Handle keyboard input
//   const controls = {
//     accelerate: false,
//     decelerate: false,
//     turnLeft: false,
//     turnRight: false
//   };

//   function handleKeyDown(event) {
//     if (event.key === 'ArrowUp') {
//       controls.accelerate = true;
//     }
//     if (event.key === 'ArrowDown') {
//       controls.decelerate = true;
//     }
//     if (event.key === 'ArrowLeft') {
//       controls.turnLeft = true;
//     }
//     if (event.key === 'ArrowRight') {
//       controls.turnRight = true;
//     }
//   }

//   function handleKeyUp(event) {
//     if (event.key === 'ArrowUp') {
//       controls.accelerate = false;
//     }
//     if (event.key === 'ArrowDown') {
//       controls.decelerate = false;
//     }
//     if (event.key === 'ArrowLeft') {
//       controls.turnLeft = false;
//     }
//     if (event.key === 'ArrowRight') {
//       controls.turnRight = false;
//     }
//   }

//   useEffect(() => {
//     // Set up renderer
//     const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.render(scene, camera);

//     function animation() {
//       // Update car position and rotation
//       playerCar.update(controls);

//       // Update camera position
//       updateCameraPosition();
//       updateGroundTiles(groundTiles, playerCar.group);

//       renderer.render(scene, camera);

//       requestAnimationFrame(animation);
//     }

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     // Start the animation loop
//     requestAnimationFrame(animation);

//     // Clean up event listeners when the component is unmounted
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, []);

//   function updateCameraPosition() {
//     const cameraDistance = 250;
//     const cameraHeight = 250;
//     const cameraOffsetX = cameraDistance * Math.sin(playerCar.angle + Math.PI / 2);
//     const cameraOffsetY = cameraDistance * Math.cos(playerCar.angle + Math.PI / 2);

//     const targetPosition = new THREE.Vector3(
//       playerCar.group.position.x - cameraOffsetX,
//       playerCar.group.position.y - cameraOffsetY,
//       cameraHeight
//     );

//     const factor = 0.1;
//     camera.position.lerp(targetPosition, factor);
//     camera.lookAt(playerCar.group.position); // Set the camera to look at the car's position
//   }

//   return <canvas id="game" ref={canvasRef} className="GameCanvas"></canvas>;
// }

// export default Game;




// import React, { useRef, useEffect, useState } from 'react';
// import Car from '../World/Car';
// import { renderMap, updateGroundTiles } from '../World/World';
// import * as THREE from 'three';
// import './Game.module.css'

// function Game() {
//   const canvasRef = useRef(null);
//   let ready;
//   let playerAngle = 0;
//   const playerAngleInitial = 0;
//   let lateralVelocity = new THREE.Vector2();
//   let angularVelocity = 0;
//   let lastTimestamp = 0;
//   let speed = 0.0005;
//   let accelerate = false;
//   let decelerate = false;
//   let turnLeft = false;
//   let turnRight = false;

//   // Set up scene
//   const scene = new THREE.Scene();

//   // Set up car
//   const playerCar = new Car();
//   scene.add(playerCar);

//   // Set up lights
//   const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//   scene.add(ambientLight);

//   const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
//   directionalLight.position.set(100, -300, 400);
//   scene.add(directionalLight);

//   // Set up camera
//   const aspectRatio = window.innerWidth / window.innerHeight;
//   const cameraWidth = 960;
//   const cameraHeight = cameraWidth / aspectRatio;

//   const camera = new THREE.OrthographicCamera(
//     cameraWidth / -2, // left
//     cameraWidth / 2, // right
//     cameraHeight / 2, // top
//     cameraHeight / -2, // bottom
//     0, // near plane
//     1000 // far plane
//   );
//   camera.position.set(0, -110, 250);
//   camera.up.set(0, 0, 1);
//   camera.lookAt(0, 0, 0);

//   const groundTiles = renderMap(cameraWidth, cameraHeight * 2, scene);

//   function movePlayerCar() {
//     const maxSpeed = 0.1;
//     const acceleration = accelerate ? 0.05 : 0;
//     const deceleration = decelerate ? 0.002 : 0;
//     const velocity = Math.min(Math.max(0, speed + acceleration - deceleration), maxSpeed);
//     const turnSpeed = 0.0005;
//     const driftFactor = 0.95;
  
//     // Apply damping to the angular velocity
//     angularVelocity *= 0.95;
  
//     // Update the angular velocity based on the turn direction
//     if (turnLeft) {
//       angularVelocity -= turnSpeed;
//       // lateralVelocity.x -= turnSpeed * 3000;
//     }
//     if (turnRight) {
//       angularVelocity += turnSpeed;
//       // lateralVelocity.y += turnSpeed * 3000;
//     }
  
//     // Compute the car's rotation
//     playerAngle += angularVelocity;
//     playerCar.rotation.z = -playerAngle;
  
//     // Compute the car's direction
//     const direction = new THREE.Vector2(
//       Math.cos(playerAngle + playerAngleInitial),
//       Math.sin(playerAngle + playerAngleInitial)
//     );

//     // draw an arrow to show the direction, locked onto the car
//     const origin = new THREE.Vector3(playerCar.position.x, playerCar.position.y, 0);
//     const length = 100;
//     const hex = 0xffff00;
//     const arrowHelper = new THREE.ArrowHelper(direction, origin, length, hex);
//     scene.add(arrowHelper);
  
//     // Update lateralVelocity with respect to the direction and velocity
//     lateralVelocity.x += direction.x * velocity;
//     lateralVelocity.y += direction.y * velocity;
  
//     // Add drift effect
//     if (!turnLeft && !turnRight) {
//       lateralVelocity.x *= driftFactor;
//       lateralVelocity.y *= driftFactor;
//     }

//     // 
  
//     // Update car position
//     playerCar.position.x += lateralVelocity.x ;
//     playerCar.position.y += lateralVelocity.y ;
  
//     // Update speed
//     speed = velocity;
  
//     // Update camera position
//     updateCameraPosition();
//     updateGroundTiles(groundTiles, playerCar);
//   } 

//   function updateCameraPosition() {
//     const cameraDistance = 250;
//     const cameraHeight = 250;
//     const cameraOffsetX = cameraDistance * Math.sin(playerAngle + Math.PI / 2);
//     const cameraOffsetY = cameraDistance * Math.cos(playerAngle + Math.PI / 2);
  
//     const targetPosition = new THREE.Vector3(
//       playerCar.position.x - cameraOffsetX,
//       playerCar.position.y - cameraOffsetY,
//       cameraHeight
//     );
  
//     const factor = 0.1;
//     camera.position.lerp(targetPosition, factor);
//     camera.lookAt(playerCar.position); // Set the camera to look at the car's position
//   }  
  
//   function handleKeyDown(event) {
//     if (event.key === 'ArrowUp') {
//       accelerate = true;
//       return;
//     }
//     if (event.key === 'ArrowDown') {
//       decelerate = true;
//       return;
//     }
//     if (event.key === 'ArrowLeft') {
//       turnLeft = true;
//       return;
//     }
//     if (event.key === 'ArrowRight') {
//       turnRight = true;
//       return;
//     }
//     if (event.key === "R" || event.key === "r") {
//       // reset();
//       return;
//     }
//   }

//   function handleKeyUp(event) {
//     if (event.key === 'ArrowUp') {
//       accelerate = false;
//       return;
//     }
//     if (event.key === 'ArrowDown') {
//       decelerate = false;
//       return;
//     }
//     if (event.key === 'ArrowLeft') {
//       turnLeft = false;
//       return;
//     }
//     if (event.key === 'ArrowRight') {
//       turnRight = false;
//       return;
//     }
//   }

//   useEffect(() => {
//     // Set up renderer
//     const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.render(scene, camera);

//     reset();

//     function reset() {
//       // reset position
//       playerAngle = 0;
//       lastTimestamp = 0;
  
//       renderer.render(scene, camera);
//       ready = true;
//     }

//     function animation(timestamp) {
//       if (!lastTimestamp) {
//         lastTimestamp = timestamp;
//         return;
//       }

//       let timeDelta = (timestamp - lastTimestamp);

//       // max timeDelta to avoid strange behaviour
//       if (timeDelta > 100) {
//         timeDelta = 100;
//       }

//       movePlayerCar();

//       renderer.render(scene, camera);

//       requestAnimationFrame(animation);
//     }

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     // Start the animation loop
//     requestAnimationFrame(animation);

//     // Clean up event listeners when the component is unmounted
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, []);

//   return <canvas id="game" ref={canvasRef} className="GameCanvas"></canvas>;
// }

// export default Game;