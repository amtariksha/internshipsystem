import { Card, CardContent } from "@/components/ui/card";

interface CommitmentFlagProps {
  title: string;
  description: string;
}

export function CommitmentFlag({ title, description }: CommitmentFlagProps) {
  return (
    <Card className="border-yellow-500/30 bg-yellow-500/5">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <span className="text-lg">&#9888;</span>
          <div>
            <h4 className="font-semibold text-yellow-400">{title}</h4>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
