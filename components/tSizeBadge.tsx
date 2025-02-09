import { SIZE_DISPLAY_NAMES, SIZE_MAPPING, TSIZE_COLORS, TSIZE_DAYS } from "@/constants/constants";
import { Badge } from "./ui/badge";

export function TSizeBadge({ size }: { size: string }) {
  const normalizedSize = size.toLowerCase() as keyof typeof SIZE_MAPPING;
  const mappedSize = SIZE_MAPPING[normalizedSize];
  const days = TSIZE_DAYS[mappedSize];
  const color = TSIZE_COLORS[mappedSize];

  return (
    <div className="relative group">
      <Badge
        className="rounded-full font-medium text-xs"
        style={{
          backgroundColor: color,
          opacity: 0.9,
        }}
      >
        {mappedSize}
      </Badge>
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-xs text-white px-2 py-1 rounded whitespace-nowrap z-50">
        {days} Days - {SIZE_DISPLAY_NAMES[mappedSize]}
      </div>
    </div>
  );
}
