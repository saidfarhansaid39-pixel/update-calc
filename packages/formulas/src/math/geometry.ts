export function rectangleArea(width: number, height: number): number {
  return width * height;
}

export function rectanglePerimeter(width: number, height: number): number {
  return 2 * (width + height);
}

export function circleArea(radius: number): number {
  return Math.PI * radius * radius;
}

export function circleCircumference(radius: number): number {
  return 2 * Math.PI * radius;
}

export function triangleArea(base: number, height: number): number {
  return (base * height) / 2;
}

export function sphereVolume(radius: number): number {
  return (4 / 3) * Math.PI * Math.pow(radius, 3);
}

export function cylinderVolume(radius: number, height: number): number {
  return Math.PI * radius * radius * height;
}

export function coneVolume(radius: number, height: number): number {
  return (1 / 3) * Math.PI * radius * radius * height;
}

export function pythagoreanTheorem(a: number, b: number): number {
  return Math.sqrt(a * a + b * b);
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
