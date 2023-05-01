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
