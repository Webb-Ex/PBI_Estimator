import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TSIZE_COLORS, TSIZE_DAYS, SIZE_DISPLAY_NAMES } from "@/constants/constants";

interface TSizeScaleProps {
  className?: string;
}

export function TSizeScale({ className }: TSizeScaleProps) {
  return (
    <Card className={`flex items-center border-0 shadow-none ${className}`}>
      <CardHeader>
        <CardTitle className="text-xs font-medium text-muted-foreground">
          T-Size Scale
        </CardTitle>
      </CardHeader>
      <CardContent className="m-0 p-0">
        <div className="flex items-center gap-3">
          {Object.entries(TSIZE_COLORS).map(([size, color]) => (
            <div
              key={size}
              className="group relative flex items-center gap-1.5 px-2 py-1 rounded-full 
                border border-slate-200 hover:border-slate-300 
                dark:border-slate-700 dark:hover:border-slate-600
                bg-slate-50 dark:bg-slate-900
                transition-colors"
            >
              <span
                className="w-2 h-2 rounded-full transition-transform group-hover:scale-110"
                style={{ backgroundColor: color as string }}
              />
              <span className="text-xs font-medium dark:text-slate-200">
                {size}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono dark:text-slate-400">
                {TSIZE_DAYS[size as keyof typeof TSIZE_DAYS]}d
              </span>
              <div className="absolute -bottom-8 left-0 hidden group-hover:block 
                bg-slate-900 dark:bg-slate-800 
                text-xs text-white px-2 py-1 rounded whitespace-nowrap
                shadow-lg z-50">
                {TSIZE_DAYS[size as keyof typeof TSIZE_DAYS] +
                  " Days" +
                  " - " +
                  SIZE_DISPLAY_NAMES[size as keyof typeof SIZE_DISPLAY_NAMES]}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}