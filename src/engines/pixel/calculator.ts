export function calculatePixelDimensions(width: number, height: number, dpi: number): any {
  const area = width * height;
  return { width, height, area };
}

export function calculateNewDimensions(width: number, height: number, newWidth: number | null, newHeight: number | null, maintainAspectRatio: boolean): any {
  if (newWidth && newHeight) {
    return { width: newWidth, height: newHeight };
  } else if (newWidth) {
    return { width: newWidth, height: maintainAspectRatio ? Math.round(height * (newWidth / width)) : height };
  } else if (newHeight) {
    return { width: maintainAspectRatio ? Math.round(width * (newHeight / height)) : width, height: newHeight };
  }
  return { width, height };
}

export function calculateScalePercentage(original: number, target: number): number {
  return (target / original) * 100;
}
