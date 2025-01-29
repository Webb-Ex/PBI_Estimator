import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card";
  import { MultiSegmentProgress } from "@/components/customProgressBar";
  import { Separator } from "./ui/separator";
  import { Clock, CheckCircle, AlertTriangle, AlertOctagon } from "lucide-react"; // Import relevant icons
  
  type DeviceStatusProgressProps = {
    segments: { value: number; label: string }[];
  };
  
  const labelToColor = (label: string) => {
    switch (label) {
      case "Pending Devices":
        return "bg-yellow-500";
      case "Normal Devices":
        return "bg-green-500";
      case "Warning Devices":
        return "bg-orange-500";
      case "Critical Devices":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  
  const iconsToColor = (label: string) => {
    switch (label) {
      case "Pending Devices":
        return "text-yellow-500";
      case "Normal Devices":
        return "text-green-500";
      case "Warning Devices":
        return "text-orange-500";
      case "Critical Devices":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };
  
  const getLabelIcon = (label: string) => {
    switch (label) {
      case "Pending Devices":
        return Clock; // Icon for Pending
      case "Normal Devices":
        return CheckCircle; // Icon for Normal
      case "Warning Devices":
        return AlertTriangle; // Icon for Warning
      case "Critical Devices":
        return AlertOctagon; // Icon for Critical
      default:
        return null; // No icon for unknown labels
    }
  };
  
  const DeviceStatusProgress = ({ segments }: DeviceStatusProgressProps) => {
    return (
      <HoverCard>
        <HoverCardTrigger>
          <MultiSegmentProgress
            className="w-[60px] hover:scale-x-110 transition-all"
            multiMode={true}
            segments={segments.map((segment) => ({
              value: segment.value,
              color: labelToColor(segment.label), // Assign color based on the label
            }))}
          />
        </HoverCardTrigger>
        <HoverCardContent className="p-4 bg-white shadow-md rounded-lg text-sm text-muted-foreground">
          <div>
            <p className="font-bold">Device Status:</p>
            <ul>
              {segments.map((segment, index) => {
                const Icon = getLabelIcon(segment.label); // Get the appropriate icon
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center p-1">
                      <div className="flex items-center gap-2 text-xs">
                        {Icon && (
                          <Icon
                            className={`w-4 h-4 ${iconsToColor(segment.label)}`} // Apply color to the icon
                          />
                        )}
                        <p>{segment.label}</p>
                      </div>
                      <div>{segment.value}</div>
                    </div>
                    {index < segments.length - 1 && <Separator />} {/* Separator between items */}
                  </div>
                );
              })}
            </ul>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };
  
  export { DeviceStatusProgress };
  