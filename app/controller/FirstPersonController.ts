import * as three from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { CharacterPhysics } from "../physics/CharacterPhysics";

export interface FirstPersonControllerConfig {
  camera: three.PerspectiveCamera;
  domElement: HTMLElement;
  physics?: CharacterPhysics;
  eyeHeight?: number;
}

export class FirstPersonController {
  private camera: three.PerspectiveCamera;
  private controls: PointerLockControls;
  private physics: CharacterPhysics;
  private eyeHeight: number;

  private position: three.Vector3;
  private moveState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false,
  };

  private raycaster: three.Raycaster;
  private groundCheckDistance: number = 1.9; // Slightly less than eye height

  constructor(config: FirstPersonControllerConfig) {
    this.camera = config.camera;
    this.controls = new PointerLockControls(config.camera, config.domElement);
    this.physics = config.physics ?? new CharacterPhysics();
    // 6 feet 2 inches = 1.88 meters
    this.eyeHeight = config.eyeHeight ?? 1.88;

    this.position = new three.Vector3(0, this.eyeHeight, 0);
    this.camera.position.copy(this.position);

    this.raycaster = new three.Raycaster();

    this.setupEventListeners();
  }

  private setupEventListeners() {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
          this.moveState.forward = true;
          break;
        case "KeyS":
          this.moveState.backward = true;
          break;
        case "KeyA":
          this.moveState.left = true;
          break;
        case "KeyD":
          this.moveState.right = true;
          break;
        case "Space":
          this.moveState.jump = true;
          event.preventDefault();
          break;
        case "ShiftLeft":
        case "ShiftRight":
          this.moveState.sprint = true;
          break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) { 
        case "KeyW":
          this.moveState.forward = false;
          break;
        case "KeyS":
          this.moveState.backward = false;
          break;
        case "KeyA":
          this.moveState.left = false;
          break;
        case "KeyD":
          this.moveState.right = false;
          break;
        case "Space":
          this.moveState.jump = false;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          this.moveState.sprint = false;
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    // document.addEventListener("keypress")
    // Store cleanup function
    this.cleanup = () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      this.controls.dispose();
    };
  }

  private getMovementDirection(): three.Vector3 {
    const direction = new three.Vector3();
    const forward = new three.Vector3();
    const right = new three.Vector3();

    // Get camera forward direction (XZ plane only)
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    // Get camera right direction
    right.crossVectors(forward, new three.Vector3(0, 1, 0)).normalize();

    if (this.moveState.forward) direction.add(forward);
    if (this.moveState.backward) direction.sub(forward);
    if (this.moveState.right) direction.add(right);
    
    if (this.moveState.left) direction.sub(right); 
    
    return direction;
  } 

  checkGroundCollision(scene: three.Scene): boolean {
    // Cast ray downward from character position
    this.raycaster.set(this.position, new three.Vector3(0, -1, 0));


    const intersects = this.raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const distance = intersects[0].distance;
      return distance <= this.groundCheckDistance;
    }

    return false;
  }

  update(delta: number, scene: three.Scene) {
    if (!this.controls.isLocked) return;

    // Check if grounded
    const grounded = this.checkGroundCollision(scene);
    this.physics.setGrounded(grounded);

    // Handle jump
    if (this.moveState.jump && grounded) {
      this.physics.jump();
    }

    // Get movement direction and apply to physics
    const moveDirection = this.getMovementDirection();
    this.physics.applyMovement(moveDirection, delta, this.moveState.sprint);

    // Update physics
    this.physics.update(delta);

    // Apply velocity to position
    const velocity = this.physics.getVelocity();
    this.position.add(velocity.clone().multiplyScalar(delta));

    // Prevent falling through the ground
    if (grounded && this.position.y < this.eyeHeight) {
      this.position.y = this.eyeHeight;
      if (velocity.y < 0) {
        velocity.y = 0;
      }
    }

    // Update camera position
    this.camera.position.copy(this.position);
  }

  lock() {
    this.controls.lock();
  }

  unlock() {
    this.controls.unlock();
  }

  getControls(): PointerLockControls {
    return this.controls;
  }

  getPosition(): three.Vector3 {
    return this.position.clone();
  }

  setPosition(position: three.Vector3) {
    this.position.copy(position);
    this.camera.position.copy(this.position);
  }

  private cleanup: () => void = () => {};

  dispose() {
    this.cleanup();
  }
}
