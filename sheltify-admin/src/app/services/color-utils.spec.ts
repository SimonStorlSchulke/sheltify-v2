import { randomColor } from './color-utils';

describe('randomColor', () => {
  afterEach(() => vi.restoreAllMocks());

  it('returns a hex color', () => {
    for (let i = 0; i < 50; i++) {
      expect(randomColor(Math.random() * 360)).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it('uses the exact base values when Math.random yields the midpoint', () => {
    // (0.5 * 2 - 1) = 0 -> no variation
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(randomColor(0, 10, 100, 10, 50, 10)).toBe('#ff0000');
    expect(randomColor(120, 10, 100, 10, 50, 10)).toBe('#00ff00');
    expect(randomColor(240, 10, 100, 10, 50, 10)).toBe('#0000ff');
  });

  it('returns gray for zero saturation', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(randomColor(200, 10, 0, 0, 50, 0)).toBe('#808080');
  });

  it('wraps the hue around and clamps lightness', () => {
    // (0 * 2 - 1) = -1 -> maximum negative variation
    vi.spyOn(Math, 'random').mockReturnValue(0);
    // hue 5 - 10 = -5 -> 355, lightness 5 - 10 -> clamped to 0 = black
    expect(randomColor(5, 10, 100, 0, 5, 10)).toBe('#000000');
  });
});
