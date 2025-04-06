
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Car3DModel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.background = null; // Transparent background
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(300, 300);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x3498db, 2, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);
    
    // Create a stylized car shape
    const carGroup = new THREE.Group();
    
    // Car body
    const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 4);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x3498db,
      specular: 0x111111,
      shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.25;
    carGroup.add(body);
    
    // Car roof
    const roofGeometry = new THREE.BoxGeometry(1.5, 0.5, 2);
    const roofMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x2980b9,
      specular: 0x111111,
      shininess: 100 
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 0.75;
    roof.position.z = -0.2;
    carGroup.add(roof);
    
    // Car windows (simplified)
    const windowMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xadd8e6,
      specular: 0xffffff,
      shininess: 100,
      transparent: true,
      opacity: 0.7
    });
    
    // Windshield
    const windshieldGeometry = new THREE.BoxGeometry(1.4, 0.4, 0.1);
    const windshield = new THREE.Mesh(windshieldGeometry, windowMaterial);
    windshield.position.set(0, 0.75, 0.9);
    windshield.rotation.x = Math.PI * 0.1;
    carGroup.add(windshield);
    
    // Rear window
    const rearWindowGeometry = new THREE.BoxGeometry(1.4, 0.4, 0.1);
    const rearWindow = new THREE.Mesh(rearWindowGeometry, windowMaterial);
    rearWindow.position.set(0, 0.75, -1.3);
    rearWindow.rotation.x = -Math.PI * 0.1;
    carGroup.add(rearWindow);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 24);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    // Front left wheel
    const wheelFL = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelFL.position.set(-1.1, 0, 1.2);
    wheelFL.rotation.z = Math.PI / 2;
    carGroup.add(wheelFL);
    
    // Front right wheel
    const wheelFR = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelFR.position.set(1.1, 0, 1.2);
    wheelFR.rotation.z = Math.PI / 2;
    carGroup.add(wheelFR);
    
    // Rear left wheel
    const wheelRL = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelRL.position.set(-1.1, 0, -1.2);
    wheelRL.rotation.z = Math.PI / 2;
    carGroup.add(wheelRL);
    
    // Rear right wheel
    const wheelRR = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelRR.position.set(1.1, 0, -1.2);
    wheelRR.rotation.z = Math.PI / 2;
    carGroup.add(wheelRR);
    
    // Headlights
    const headlightGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const headlightMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      emissive: 0xffffcc
    });
    
    // Left headlight
    const headlightL = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlightL.position.set(-0.6, 0.3, 2);
    headlightL.scale.z = 0.5;
    carGroup.add(headlightL);
    
    // Right headlight
    const headlightR = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlightR.position.set(0.6, 0.3, 2);
    headlightR.scale.z = 0.5;
    carGroup.add(headlightR);
    
    // Add car to scene
    carGroup.rotation.y = Math.PI;
    scene.add(carGroup);
    
    // Orbit controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 3;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    // Handle resize
    const handleResize = () => {
      const width = containerRef.current?.clientWidth || 300;
      const height = containerRef.current?.clientHeight || 300;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    // Initial size adjustment
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      controls.dispose();
      renderer.dispose();
    };
  }, []);
  
  return (
    <div className="car-3d-container h-64 w-64 mx-auto perspective-1000 animate-float">
      <div 
        ref={containerRef} 
        className="w-full h-full transform-style-3d relative"
        style={{ transformStyle: 'preserve-3d' }}
      />
    </div>
  );
};

export default Car3DModel;
