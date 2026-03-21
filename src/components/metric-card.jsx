import { Card, CardContent } from "@/components/ui/card";

export const MetricCard = ({ label, value, description, tone = "default", testId }) => {
  const toneClass = {
    default: "border-border bg-white",
    success: "border-emerald-500/40 bg-emerald-50/70",
    warning: "border-amber-500/40 bg-amber-50/70",
    accent: "border-primary/25 bg-primary/5",
  };

  return (
    <Card className={`rounded-none border shadow-none transition-all duration-200 hover:-translate-y-[1px] ${toneClass[tone]}`} data-testid={`${testId}-card`}>
      <CardContent className="space-y-4 p-6">
        <div className="section-kicker" data-testid={`${testId}-label`}>
          {label}
        </div>
        <div className="break-words font-mono text-2xl font-semibold leading-tight text-foreground md:text-3xl" data-testid={`${testId}-value`}>
          {value}
        </div>
        <p className="text-sm text-muted-foreground" data-testid={`${testId}-description`}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
};