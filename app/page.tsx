"use client";
import React, { useEffect } from "react";
import { useRef } from "react";
import * as three from "three";
import World from "./world/world";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { FirstPersonController } from "./controller/FirstPersonController";
import Hud from "./components/Hud";

const page = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const renderer = new three.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = three.PCFSoftShadowMap;

    const camera = new three.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      500,
    );

    const stats = new Stats();
    document.body.appendChild(stats.dom);

    const scene = new three.Scene();
    scene.background = new three.Color(0x87ceeb); // Sky blue
    scene.fog = new three.Fog(0x87ceeb, 50, 400);

    // Create world

    const world = new World({ renderDistance: 128 });
    world.generate();
    scene.add(world);

    // Add lighting
    const ambientLight = new three.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new three.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create first-person controller
    const controller = new FirstPersonController({
      camera,
      domElement: renderer.domElement,

      eyeHeight: 1.88,
    });

    // Set initial position above the ground
    controller.setPosition(new three.Vector3(0, 1.88, 5));

    // Handle pointer lock
    const onPointerLockChange = () => {
      if (document.pointerLockElement === renderer.domElement) {
        console.log("Pointer locked");
      } else {
        console.log("Pointer unlocked");
      }
    };

    document.addEventListener("pointerlockchange", onPointerLockChange);

    // Click to lock pointers
    renderer.domElement.addEventListener("click", () => {
      controller.lock();
    });

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onWindowResize);

    // Animation loop
    let id: number;
    const clock = new three.Clock();

    const animate = () => {
      id = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Update controller
      controller.update(delta, scene);

      renderer.render(scene, camera);
      stats.update();
    };
    animate();

    // Cleanup
    return () => {
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      window.removeEventListener("resize", onWindowResize);
      controller.dispose();
      renderer.dispose();
      document.body.removeChild(stats.dom);

      scene.traverse((obj) => {
        if (obj instanceof three.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      cancelAnimationFrame(id);
    };
  }, []);

  return (
    <div className="relative h-screen w-screen">
      <canvas className="h-screen w-screen" ref={canvasRef}></canvas>

      <Hud />

      <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 p-4 rounded">
        <p className="text-sm">Click to start</p>
        <p className="text-sm">WASD - Move</p>
        <p className="text-sm">Mouse - Look around</p>
        <p className="text-sm">Space - Jump</p>
        <p className="text-sm">Shift - Sprint</p>
        <p className="text-sm">ESC - Unlock mouse</p>
      </div>
    </div>
  );
};

export default page;
