import * as three from "three";

export interface CharacterPhysicsConfig {
  walkSpeed?: number;
  sprintSpeed?: number;
  friction?: number;
  gravity?: number;
  jumpVelocity?: number;
  mass?: number;
}

export class CharacterPhysics {
  velocity: three.Vector3;
  private walkSpeed: number;
  private sprintSpeed: number;
  private friction: number;
  private gravity: number;
  private jumpVelocity: number;
  private mass: number;

  private grounded: boolean = false;

  constructor(config: CharacterPhysicsConfig = {}) {
    this.velocity = new three.Vector3();
    this.walkSpeed = config.walkSpeed ?? 5.0;
    this.sprintSpeed = config.sprintSpeed ?? 8.0;
    this.friction = config.friction ?? 0.85;
    this.gravity = config.gravity ?? 9.8;
    this.jumpVelocity = config.jumpVelocity ?? 5.0;
    this.mass = config.mass ?? 70;
  }

  setGrounded(grounded: boolean) {
    this.grounded = grounded;
  }

  isGrounded(): boolean {
    return this.grounded;
  }

  applyFriction(delta: number) {
    if (this.grounded) {
      // Apply friction only to horizontal movement
      this.velocity.x *= Math.pow(this.friction, delta * 60);
      this.velocity.z *= Math.pow(this.friction, delta * 60);

      // Stop if velocity is very small
      if (Math.abs(this.velocity.x) < 0.01) this.velocity.x = 0;
      if (Math.abs(this.velocity.z) < 0.01) this.velocity.z = 0;
    }
  }

  applyGravity(delta: number) {
    if (!this.grounded) {
      this.velocity.y -= this.gravity * delta;
    } else {
      // Clamp velocity when grounded
      if (this.velocity.y < 0) {
        this.velocity.y = 0;
      }
    }
  }

  applyMovement(
    direction: three.Vector3,
    delta: number,
    sprinting: boolean = false
  ) {
    const speed = sprinting ? this.sprintSpeed : this.walkSpeed;
    const acceleration = speed * 20; // Higher acceleration for responsive movement

    // Only apply horizontal movement
    const moveDir = direction.clone().normalize();
    moveDir.y = 0;

    if (moveDir.length() > 0) {
      moveDir.normalize();
      this.velocity.x += moveDir.x * acceleration * delta;
      this.velocity.z += moveDir.z * acceleration * delta;

      // Clamp horizontal speed
      const horizontalSpeed = Math.sqrt(
        this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z
      );
      if (horizontalSpeed > speed) {
        const scale = speed / horizontalSpeed;
        this.velocity.x *= scale;
        this.velocity.z *= scale;
      }
    }
  }

  jump() {
    if (this.grounded) {
      this.velocity.y = this.jumpVelocity;
      this.grounded = false;
    }
  }

  update(delta: number) {
    this.applyGravity(delta);
    this.applyFriction(delta);
  }

  getVelocity(): three.Vector3 {
    return this.velocity.clone();
  }
}
