import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TierBadgeProps {
  tier: string;
  label: string;
  context: string;
}

const tierColors: Record<string, string> = {
  READY_TO_LEAD: "bg-green-500/10 text-green-400 border-green-500/30",
  READY_TO_BUILD: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  READY_TO_CONTRIBUTE: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  GROWING_FOUNDATION: "bg-muted text-muted-foreground border-border",
};

export function TierBadge({ tier, label, context }: TierBadgeProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-3">
      <span className="text-sm text-muted-foreground">{context}</span>
      <Badge
        variant="outline"
        className={cn("font-medium", tierColors[tier] ?? tierColors.GROWING_FOUNDATION)}
      >
        {label}
      </Badge>
    </div>
  );
}
