export type ClassValue = string | number | null | undefined | false;

export function cn(...values: ClassValue[]): string {
  return values.filter((value) => value !== null && value !== undefined && value !== false && value !== "").join(" ");
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}
