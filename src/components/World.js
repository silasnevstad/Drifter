import * as THREE from 'three';

class World {

    constructor() {
        this.group = new THREE.Group();
        this.terrainSize = 10000;
        this.visibleTerrainBuffer = 1;
        this.currentTerrain = new THREE.Vector2(0, 0);
        this.texture = this.getRandomTexture();

        this.generateInitialTerrain();
    }

    getRandomTexture() {
        const textures = [
            // require('../assets/textures/coast_sand_01_diff_4k.jpg'),
            // require('../assets/textures/brown_mud_02_diff_4k.jpg'),
            // require('../assets/textures/dry_mud_field_001_diff_4k.jpg'),
            require('../assets/textures/Stylized_Grass_002_basecolor.jpg'),
            // require('../assets/textures/mud_forest_diff_4k.jpg'),
        ];
        
        const texture = new THREE.TextureLoader().load(textures[Math.floor(Math.random() * textures.length)]);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(150, 150);

        return texture;
    }

    generateTerrain(x, y) {
        const geometry = new THREE.PlaneGeometry(this.terrainSize, this.terrainSize);
        const material = new THREE.MeshLambertMaterial({ map: this.texture });

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

    terrainIsVisible(x, y, carPosition) {
        const isVisible = (
            carPosition.x - this.terrainSize * this.visibleTerrainBuffer <= x &&
            carPosition.x + this.terrainSize * this.visibleTerrainBuffer >= x &&
            carPosition.y - this.terrainSize * this.visibleTerrainBuffer <= y &&
            carPosition.y + this.terrainSize * this.visibleTerrainBuffer >= y
        );

        return isVisible;
    }

    update(carPosition) {
        const terrainX = Math.floor(carPosition.x / this.terrainSize) * this.terrainSize;
        const terrainY = Math.floor(carPosition.y / this.terrainSize) * this.terrainSize;

        if (this.currentTerrain.x !== terrainX || this.currentTerrain.y !== terrainY) {

            this.currentTerrain.set(terrainX, terrainY);

            const newTerrainMeshes = [];

            for (let x = terrainX - this.terrainSize * this.visibleTerrainBuffer; x <= terrainX + this.terrainSize * this.visibleTerrainBuffer; x += this.terrainSize) {
                for (let y = terrainY - this.terrainSize * this.visibleTerrainBuffer; y <= terrainY + this.terrainSize * this.visibleTerrainBuffer; y += this.terrainSize) {
                    if (!this.terrainIsVisible(x, y, carPosition)) {
                        const newTerrain = this.generateTerrain(x, y);
                        newTerrainMeshes.push(newTerrain);
                    }
                }
            }

            this.group.children = this.group.children.filter(child => {
                const isVisible = this.terrainIsVisible(child.position.x, child.position.y, carPosition);
                return isVisible;
            });

            this.group.children = this.group.children.concat(newTerrainMeshes);
        }
    }
}

export default World;

    






















// import * as THREE from 'three';

// class World {
//   constructor() {
//     this.group = new THREE.Group();

//     this.planeSize = 100;
//     this.visiblePlanes = 5;

//     this.initTextures();
//     this.initPlanes();
//   }

//   initTextures() {
//     const textureLoader = new THREE.TextureLoader();

//     this.grassTexture = textureLoader.load(require('../assets/textures/Stylized_Grass_002_basecolor.jpg'));
//     this.grassTexture.repeat.set(500, 500); // Adjust the texture repeat to control the grass size
//     this.grassTexture.wrapS = this.grassTexture.wrapT = THREE.RepeatWrapping;

//     this.grassNormalMap = textureLoader.load(require('../assets/textures/Stylized_Grass_002_normal.jpg'));
//     this.grassNormalMap.repeat.set(100, 100);
//     this.grassNormalMap.wrapS = this.grassNormalMap.wrapT = THREE.RepeatWrapping;

//     this.grassHeightMap = textureLoader.load(require('../assets/textures/Stylized_Grass_002_height.png'));
//     this.grassHeightMap.repeat.set(100, 100);
//     this.grassHeightMap.wrapS = this.grassHeightMap.wrapT = THREE.RepeatWrapping;

//     this.grassOcclusionMap = textureLoader.load(require('../assets/textures/Stylized_Grass_002_ambientOcclusion.jpg'));
//     this.grassOcclusionMap.repeat.set(100, 100);
//     this.grassOcclusionMap.wrapS = this.grassOcclusionMap.wrapT = THREE.RepeatWrapping;

//     this.grassRoughnessMap = textureLoader.load(require('../assets/textures/Stylized_Grass_002_roughness.jpg'));
//     this.grassRoughnessMap.repeat.set(100, 100);
//     this.grassRoughnessMap.wrapS = this.grassRoughnessMap.wrapT = THREE.RepeatWrapping;

//     this.tireMarkTexture = textureLoader.load(require('../assets/textures/brown_mud_02_diff_4k.jpg'));
//     this.tireMarkTexture.wrapS = this.tireMarkTexture.wrapT = THREE.ClampToEdgeWrapping;

//     this.material = new THREE.ShaderMaterial({
//         uniforms: {
//           baseColor: { value: this.grassTexture },
//           normalMap: { value: this.grassNormalMap },
//           heightMap: { value: this.grassHeightMap },
//           occlusionMap: { value: this.grassOcclusionMap },
//           roughnessMap: { value: this.grassRoughnessMap },
//           tireMarkTexture: { value: this.tireMarkTexture },
//           displacementScale: { value: 1.2 }, // Increase displacementScale for a more 3D effect
//           displacementBias: { value: 0 },
//           tireMarkOpacity: { value: 0.5 }, // Adjust tire mark opacity as needed
//         },
//         vertexShader: `
//           varying vec2 vUv;
//           uniform sampler2D heightMap;
//           uniform float displacementScale;
//           uniform float displacementBias;
      
//           void main() {
//             vUv = uv;
//             vec4 heightData = texture2D(heightMap, uv);
//             float displacement = (heightData.r * displacementScale) + displacementBias;
//             vec3 newPosition = position + (normal * displacement);
//             gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
//           }
//         `,
//         fragmentShader: `
//           varying vec2 vUv;
//           uniform sampler2D baseColor;
//           uniform sampler2D normalMap;
//           uniform sampler2D occlusionMap;
//           uniform sampler2D roughnessMap;
//           uniform sampler2D tireMarkTexture;
//           uniform float tireMarkOpacity;
      
//           void main() {
//             vec4 grassColor = texture2D(baseColor, vUv);
//             vec4 tireMarkColor = texture2D(tireMarkTexture, vUv);
//             float occlusion = texture2D(occlusionMap, vUv).r;
//             float roughness = texture2D(roughnessMap, vUv).r;
//             vec3 normal = texture2D(normalMap, vUv).rgb * 2.0 - 1.0;
//             vec3 outgoingLight = mix(grassColor.rgb, tireMarkColor.rgb, tireMarkOpacity * tireMarkColor.a);
      
//             gl_FragColor = vec4(outgoingLight, 1.0);
//           }
//         `,
//     });
//   }

//   initPlanes() {
//     const geometry = new THREE.PlaneBufferGeometry(this.planeSize, this.planeSize, this.visiblePlanes * 2, this.visiblePlanes * 2);
//     const positions = geometry.attributes.position.array;
//     const normals = geometry.attributes.normal.array;
//     const uvs = geometry.attributes.uv.array;
//     const indices = geometry.index.array;

//     for (let x = -this.visiblePlanes; x <= this.visiblePlanes; x++) {
//     for (let z = -this.visiblePlanes; z <= this.visiblePlanes; z++) {
//         const indexOffset = (x + this.visiblePlanes) * (this.visiblePlanes * 2 + 1) + z + this.visiblePlanes;

//         for (let i = 0; i < positions.length; i += 3) {
//             positions[i] += x * this.planeSize;
//             positions[i + 2] += z * this.planeSize;
//         }

//         for (let i = 0; i < normals.length; i += 3) {
//             const normal = new THREE.Vector3(normals[i], normals[i + 1], normals[i + 2]);
//             normal.normalize();
//             normals[i] = normal.x;
//             normals[i + 1] = normal.y;
//             normals[i + 2] = normal.z;
//         }

//         for (let i = 0; i < uvs.length; i += 2) {
//             uvs[i] *= 50;
//             uvs[i + 1] *= 50;
//         }

//         for (let i = 0; i < indices.length; i++) {
//             indices[i] += indexOffset * ((this.visiblePlanes * 2 + 1) * (this.visiblePlanes * 2 + 1));
//         }

//         const mesh = new THREE.Mesh(geometry, this.material);
//         this.group.add(mesh);
//     }
//     }
//   }

//   addPlane(x, z) {
//     const geometry = new THREE.PlaneGeometry(this.planeSize, this.planeSize, 1, 1);
//     const material = new THREE.ShaderMaterial({
//       uniforms: {
//         baseColor: { value: this.grassTexture },
//         normalMap: { value: this.grassNormalMap },
//         heightMap: { value: this.grassHeightMap },
//         occlusionMap: { value: this.grassOcclusionMap },
//         roughnessMap: { value: this.grassRoughnessMap },
//         tireMarkTexture: { value: this.tireMarkTexture },
//         displacementScale: { value: 1.2 }, // Increase displacementScale for a more 3D effect
//         displacementBias: { value: 0 },
//         tireMarkOpacity: { value: 0.5 }, // Adjust tire mark opacity as needed
//       },
//       vertexShader: `
//         varying vec2 vUv;
//         uniform sampler2D heightMap;
//         uniform float displacementScale;
//         uniform float displacementBias;

//         void main() {
//           vUv = uv;
//           vec4 heightData = texture2D(heightMap, uv);
//           float displacement = (heightData.r * displacementScale) + displacementBias;
//           vec3 newPosition = position + (normal * displacement);
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
//         }
//       `,
//       fragmentShader: `
//         varying vec2 vUv;
//         uniform sampler2D baseColor;
//         uniform sampler2D normalMap;
//         uniform sampler2D occlusionMap;
//         uniform sampler2D roughnessMap;
//         uniform sampler2D tireMarkTexture;
//         uniform float tireMarkOpacity;

//         void main() {
//           vec4 grassColor = texture2D(baseColor, vUv);
//           vec4 tireMarkColor = texture2D(tireMarkTexture, vUv);
//           float occlusion = texture2D(occlusionMap, vUv).r;
//           float roughness = texture2D(roughnessMap, vUv).r;
//           vec3 normal = texture2D(normalMap, vUv).rgb * 2.0 - 1.0;
//           vec3 outgoingLight = mix(grassColor.rgb, tireMarkColor.rgb, tireMarkOpacity * tireMarkColor.a);

//           gl_FragColor = vec4(outgoingLight, 1.0);
//         }
//       `,
//     });

//     const plane = new THREE.Mesh(geometry, material);
//     plane.position.set(x * this.planeSize, 0, z * this.planeSize);
//     plane.rotation.x = -Math.PI / 2;
//     this.group.add(plane);

//     return plane;
//   }

//   update(car) {
//     const carPosition = car.group.position.clone();
//     carPosition.divideScalar(this.planeSize).floor();

//     for (let x = carPosition.x - this.visiblePlanes; x <= carPosition.x + this.visiblePlanes; x++) {
//       for (let z = carPosition.z - this.visiblePlanes; z <= carPosition.z + this.visiblePlanes; z++) {
//         const planeKey = `${x},${z}`;

//         if (!this.group.getObjectByName(planeKey)) {
//           const newPlane = this.addPlane(x, z);
//           newPlane.name = planeKey;
//         }
//       }
//     }

//     this.removeOutOfViewPlanes(carPosition);
    
//     // this.createTireMark(car);
//   }

//   removeOutOfViewPlanes(carPosition) {
//     const toRemove = [];
//     this.group.children.forEach(child => {
//       const [x, z] = child.name.split(',').map(Number);
//       if (
//         x < carPosition.x - this.visiblePlanes ||
//         x > carPosition.x + this.visiblePlanes ||
//         z < carPosition.z - this.visiblePlanes ||
//         z > carPosition.z + this.visiblePlanes
//       ) {
//         toRemove.push(child);
//       }
//     });

//     toRemove.forEach(child => {
//       this.group.remove(child);
//     });
//   }

//   createTireMark(car) {
//     const tirePositions = car.getTirePositions();
//     this.group.children.forEach(plane => {
//       const planeWorldPosition = plane.getWorldPosition(new THREE.Vector3());
//       const planeBounds = {
//         minX: planeWorldPosition.x - this.planeSize / 2,
//         maxX: planeWorldPosition.x + this.planeSize / 2,
//         minZ: planeWorldPosition.z - this.planeSize / 2,
//         maxZ: planeWorldPosition.z + this.planeSize / 2,
//       };

//       tirePositions.forEach(tirePosition => {
//         if (
//           tirePosition.x > planeBounds.minX &&
//           tirePosition.x < planeBounds.maxX &&
//           tirePosition.z > planeBounds.minZ &&
//           tirePosition.z < planeBounds.maxZ
//         ) {
//           // Calculate tire mark UV coordinates on the plane
//           const u = (tirePosition.x - planeBounds.minX) / this.planeSize;
//           const v = (tirePosition.z - planeBounds.minZ) / this.planeSize;

//           // Create a canvas to draw the tire mark on
//           const canvas = document.createElement('canvas');
//           canvas.width = this.tireMarkTexture.image.width;
//           canvas.height = this.tireMarkTexture.image.height;
//           const context = canvas.getContext('2d');

//           // Draw the tire mark on the canvas
//           const size = 64; // Size of the tire mark
//           context.drawImage(this.tireMarkTexture.image, u * canvas.width - size / 2, v * canvas.height - size / 2, size, size);

//           // Create a new texture from the canvas
//           const texture = new THREE.CanvasTexture(canvas);

//           // Update the material of the plane mesh with the new texture
//           plane.material.uniforms.tireMarkTexture.value = texture;
//         }
//       });
//     });
//   }
// }

// export default World;

