import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils"; // Utility to merge class names

type ProgressSegment = {
  value: number;
  color?: string;
};

type Props = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  segments: ProgressSegment[];
  multiMode?: boolean; // New prop to toggle multi-progress mode
};

const MultiSegmentProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  Props
>(({ className, segments, multiMode = false, ...props }, ref) => {
  // Total value of segments (used to calculate proportional widths in multiMode)
  const totalValue = multiMode
    ? segments.reduce((acc, segment) => acc + segment.value, 0)
    : 100;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-slate-200",
        className
      )}
      {...props}
    >
      {segments.map((segment, index) => {
        // Calculate proportional width and offset only in multiMode
        const width = multiMode ? (segment.value / totalValue) * 100 : segment.value;
        const left = multiMode
          ? segments
              .slice(0, index)
              .reduce((acc, s) => acc + (s.value / totalValue) * 100, 0)
          : segments.slice(0, index).reduce((acc, s) => acc + s.value, 0);

        return (
          <ProgressPrimitive.Indicator
            key={index}
            className={cn(
              "h-full transition-all absolute top-0",
              segment.color ? segment.color : "bg-primary",
              index === 0 ? "rounded-l-full" : "",
              index === segments.length - 1 ? "rounded-r-full" : ""
            )}
            style={{
              width: `${width}%`,
              left: `${left}%`,
              zIndex: segments.length - index,
            }}
          />
        );
      })}
    </ProgressPrimitive.Root>
  );
});

MultiSegmentProgress.displayName = "MultiSegmentProgress";

export { MultiSegmentProgress };
