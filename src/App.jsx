import React, { useEffect } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import './App.css';

function App() {
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    

    // Append renderer to the container
    const container = document.getElementById('canvas-container');
    if (!container) {
      console.error('Container not found');
      return;
    }
    container.appendChild(renderer.domElement);

    // Controls setup
    const controls = new PointerLockControls(camera, renderer.domElement);
    scene.add(controls.getObject());

    // Listen for the user to click to enable pointer lock
    document.addEventListener('click', () => controls.lock());

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(500, 500, 1, 1);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x224422 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true; //
    scene.add(ground);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 12, 100);
    pointLight.position.set(10,10, 5);
    pointLight.castShadow = true; // Enable shadows for this light
    scene.add(pointLight);
    
    // Adjustments for finer shadow details (optional)
    pointLight.shadow.mapSize.width = 512; // Default is 512; higher values for sharper shadows
    pointLight.shadow.mapSize.height = 512;
    pointLight.shadow.camera.near = 0.5;
    pointLight.shadow.camera.far = 500;

    // Platforms
    const platformGeometry = new THREE.BoxGeometry(10, 1, 10);
    const platformMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
    

    // Example platform
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.set(0, 5, 0);
    scene.add(platform);


    const platform1 = new THREE.Mesh(platformGeometry, platformMaterial);
    platform1.position.set(110, 20, 10);
    scene.add(platform1);

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshPhongMaterial({
  color: 0x00ff00, // Green base color
  emissive: 0x00ff00, // Make it glow green without external light
  specular: 0x009900,
  shininess: 100,
  flatShading: true,
});

// Create the cube mesh
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(10,10, 5); // Position it above the ground a bit and in front of the camera
cube.castShadow = true; // This mesh casts shadows
cube.receiveShadow = true; 
scene.add(cube);
const neonLight = new THREE.PointLight(0x00ff00, 1, 25);
neonLight.position.set(10,10, 5);
scene.add(neonLight);


    // Handle keyboard events
    const moveSpeed = 5;
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    let canJump = true;

    const onKeyDown = function (event) {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          direction.z = -10;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          direction.x = 10;
          break;
        case 'ArrowDown':
        case 'KeyS':
          direction.z = 10;
          break;
        case 'ArrowRight':
        case 'KeyD':
          direction.x = -10;
          break;
        case 'Space':
          if (canJump === true) velocity.y += 10;
          canJump = false;
          break;
      }
    };

    const onKeyUp = function (event) {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
        case 'ArrowDown':
        case 'KeyS':
          direction.z = 0;
          break;
        case 'ArrowLeft':
        case 'KeyA':
        case 'ArrowRight':
        case 'KeyD':
          direction.x = 0;
          break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    camera.position.y = 10; // Starting height

    // Animation loop
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta(); // Time since last call
      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;
      velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

      direction.normalize();
      if (direction.z !== 0) velocity.z = direction.z * moveSpeed;
      if (direction.x !== 0) velocity.x = direction.x * moveSpeed;

      controls.moveRight(-velocity.x * delta);
      controls.moveForward(-velocity.z * delta);
      controls.getObject().position.y += (velocity.y * delta); // New Y position

      if (controls.getObject().position.y < 10) {
        velocity.y = 0;
        controls.getObject().position.y = 10;
        canJump = true;
      }

      renderer.render(scene, camera);
    }
    animate();

    // Cleanup function
    return () => {
      container.removeChild(renderer.domElement);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return <div id="canvas-container" />;
}

export default App;
