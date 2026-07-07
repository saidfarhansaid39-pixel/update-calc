export function calculateForce(mass: number, acceleration: number): number {
  return mass * acceleration;
}

export function calculateKineticEnergy(mass: number, velocity: number): number {
  return 0.5 * mass * velocity * velocity;
}

export function calculateVelocity(distance: number, time: number): number {
  if (time === 0) return 0;
  return distance / time;
}
