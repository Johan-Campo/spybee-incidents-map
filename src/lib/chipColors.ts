const CHIP_COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#EC4899", "#14B8A6", "#F97316"];

export function chipColorForId(id: string): string {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(index);
    hash |= 0;
  }
  return CHIP_COLORS[Math.abs(hash) % CHIP_COLORS.length];
}
