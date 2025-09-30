"use client";
import React, { useEffect } from "react";
import { useRef } from "react";
import * as three from "three";
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
    const scene = new three.Scene();

    const axeshelper = new three.AxesHelper(5);
    axeshelper.position.set(0, 0, 0);
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    scene.add(axeshelper);

    let id: number;

    const animate = () => {
      id = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => cancelAnimationFrame(id);
  }, []);

  return <canvas className="h-screen w-screen" ref={canvasRef}></canvas>;
};

export default page;
