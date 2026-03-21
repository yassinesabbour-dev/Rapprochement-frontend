import { useOutletContext } from "react-router-dom";

import { exportUrl } from "@/lib/api";
import { MetricCard } from "@/components/metric-card";
import { ResultsTable } from "@/components/results-table";
import { formatCurrencyBreakdown } from "@/lib/formatting";

export default function ResultsPage() {
  const { workspace } = useOutletContext();
  const metrics = workspace?.metrics;

  return (
    <div className="space-y-6" data-testid="results-page">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4" data-testid="results-top-metrics">
        <MetricCard description="Nombre total de factures chargées." label="Factures" testId="results-total-invoices" value={metrics?.total_invoices ?? 0} />
        <MetricCard
          description="Montant rapproché au fil des correspondances, ventilé par devise."
          label="Montant rapproché"
          testId="results-matched-amount"
          tone="success"
          value={formatCurrencyBreakdown(metrics?.matched_amounts_by_currency, metrics?.matched_amount ?? 0)}
        />
        <MetricCard
          description="Montant encore ouvert ou partiellement couvert, ventilé par devise."
          label="Montant restant"
          testId="results-outstanding-amount"
          tone="warning"
          value={formatCurrencyBreakdown(metrics?.outstanding_amounts_by_currency, metrics?.outstanding_amount ?? 0)}
        />
        <MetricCard description="Cas qui demandent encore une validation humaine." label="Cas à revoir" testId="results-review-count" tone="accent" value={metrics?.to_review ?? 0} />
      </div>

      <ResultsTable onExport={() => window.open(exportUrl, "_blank", "noopener,noreferrer")} workspace={workspace} />
    </div>
  );
}