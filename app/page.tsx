"use client";
import React, { useEffect } from "react";
import { useRef } from "react";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import World from "./world/world";
import { array, color } from "three/tsl";
import Stats from "three/examples/jsm/libs/stats.module.js";

const page = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const renderer = new three.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const camera = new three.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    renderer.shadowMap.enabled = true;

    const stats = new Stats();
    document.body.appendChild(stats.dom);

    const world = new World();
    world.generate();

    const scene = new three.Scene();

    scene.add(world);

    const light = new three.PointLight(0xffffff, 100, 1000, 0);
    light.position.set(10, 10, 10);
    light.castShadow = true;
    scene.add(light);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.1;

    camera.position.set(10, 10, 10);

    let id: number;

    const animate = () => {
      id = requestAnimationFrame(animate);
      renderer.render(scene, camera);
      orbit.update();
      stats.update();
    };
    animate();

    return () => {
      orbit.dispose();
      renderer.dispose();

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

  return <canvas className="h-screen w-screen" ref={canvasRef}></canvas>;
};

export default page;
