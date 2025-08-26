export function randomColor(
  baseHue: number,
  hueVariation: number = 10,
  saturation: number = 70,
  saturationVariation: number = 10,
  lightness: number = 50,
  lightnessVariation: number = 10
): string {
  // Clamp a number between min and max
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  // Generate random variation around the base value
  const variedHue = (baseHue + (Math.random() * 2 - 1) * hueVariation + 360) % 360;
  const variedSaturation = clamp(
    saturation + (Math.random() * 2 - 1) * saturationVariation,
    0,
    100
  );
  const variedLightness = clamp(
    lightness + (Math.random() * 2 - 1) * lightnessVariation,
    0,
    100
  );

  // Convert HSL to RGB
  const h = variedHue / 360;
  const s = variedSaturation / 100;
  const l = variedLightness / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // Convert to hex
  const toHex = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
