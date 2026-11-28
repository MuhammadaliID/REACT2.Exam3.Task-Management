const PALETTE = [
  "#6366f1",
  "#ea580c",
  "#059669",
  "#0284c7",
  "#db2777",
  "#ca8a04",
  "#7c3aed",
  "#0d9488",
] as const;

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function colorForIdentifier(identifier: string): string {
  return PALETTE[hash(identifier) % PALETTE.length];
}
