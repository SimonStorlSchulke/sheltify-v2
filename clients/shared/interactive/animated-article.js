export function animateFn(sectionContainers) {
  const clientHeight = window.innerHeight;
  const transitionEnd = clientHeight / 2.5;
  for (const section of sectionContainers) {
    const y = clientHeight - section.getBoundingClientRect().top;
    section.style.transform = `scale(${mapRange(y, 0, transitionEnd, 0.9)})`
    section.style.opacity = `${mapRange(y, 0, transitionEnd, 0)}`
  }
  console.log("scrolling");
}

function mapRange(value, in_min, in_max, outMin) {
  const remapped = (value - in_min) * (1 - outMin) / (in_max - in_min) + outMin;
  return Math.max(0, Math.min(remapped, 1))
}