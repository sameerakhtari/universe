export function detectQuality() {
  const mobile = matchMedia('(max-width: 800px)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const low = mobile || cores <= 4 || (memory && memory <= 4);
  return {
    reduced,
    pixelRatio: Math.min(devicePixelRatio || 1, low ? 1.35 : 1.8),
    stars: low ? 5200 : 9000,
    neighborhoodStars: low ? 850 : 1500,
    galaxyStars: low ? 6500 : 12000,
    webNodes: low ? 58 : 86,
    bloom: low ? 0.45 : 0.65,
    antialias: !low
  };
}
