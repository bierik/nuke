export function now() { return Date.now(); }

export function onResize(element, callback) {
  element.addEventListener('resize', () => {
    window.requestAnimationFrame(callback);
  });
}
