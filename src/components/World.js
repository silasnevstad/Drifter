import * as THREE from 'three';

class World {
    constructor() {
        this.group = new THREE.Group();
        this.terrainSize = 10000;
        this.visibleTerrainBuffer = 10;
        this.currentTerrain = new THREE.Vector2(0, 0);
        this.texture = new THREE.TextureLoader().load(require('../assets/textures/coast_sand_01_diff_4k.jpg'));
        // Adjust the texture wrap mode and repeat settings
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set(10, 10);

        this.generateInitialTerrain();
    }

    generateTerrain(x, y) {
        const geometry = new THREE.PlaneGeometry(this.terrainSize, this.terrainSize);
        const material = new THREE.MeshLambertMaterial({ map: this.texture });
        // const material = new THREE.MeshLambertMaterial({ color: 0xAAAAAA });

        const terrain = new THREE.Mesh(geometry, material);
        terrain.position.set(x, y, 0);
        terrain.rotation.x = -Math.PI / 2;

        return terrain;
    }

    generateInitialTerrain() {
        for (let x = -this.visibleTerrainBuffer; x <= this.visibleTerrainBuffer; x++) {
            for (let y = -this.visibleTerrainBuffer; y <= this.visibleTerrainBuffer; y++) {
              const terrain = this.generateTerrain(x * this.terrainSize, y * this.terrainSize);
              this.group.add(terrain);
            }
        }
    }

    update(carPosition) {
        const terrainX = Math.floor(carPosition.x / this.terrainSize) * this.terrainSize;
        const terrainY = Math.floor(carPosition.y / this.terrainSize) * this.terrainSize;

        if (this.currentTerrain.x !== terrainX || this.currentTerrain.y !== terrainY) {
            this.currentTerrain.set(terrainX, terrainY);

            for (let x = terrainX - this.terrainSize * this.visibleTerrainBuffer; x <= terrainX + this.terrainSize * this.visibleTerrainBuffer; x += this.terrainSize) {
                for (let y = terrainY - this.terrainSize * this.visibleTerrainBuffer; y <= terrainY + this.terrainSize * this.visibleTerrainBuffer; y += this.terrainSize) {
                    let found = false;

                    this.group.traverse(child => {
                        if (child.position.x === x && child.position.y === y) {
                            found = true;
                        }
                    });

                    if (!found) {
                        const newTerrain = this.generateTerrain(x, y);
                        this.group.add(newTerrain);
                    }
                }
            }
        }
    }
}

export default World;
