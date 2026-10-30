// Inline style that staggers a .reveal element's transition.
export function revealDelay(ms) {
  return ms ? { "--d": `${ms}ms` } : undefined;
}
