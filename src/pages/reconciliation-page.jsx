import { useOutletContext } from "react-router-dom";

import { MetricCard } from "@/components/metric-card";
import { ReconciliationBoard } from "@/components/reconciliation-board";
import { formatCurrencyBreakdown } from "@/lib/formatting";

export default function ReconciliationPage() {
  const { workspace, busy, onCreateManualMatch, onRun } = useOutletContext();
  const metrics = workspace?.metrics;

  return (
    <div className="space-y-6" data-testid="reconciliation-page">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4" data-testid="reconciliation-top-metrics">
        <MetricCard description="Factures entièrement rapprochées à ce stade." label="Soldées" testId="reconciliation-matched" tone="success" value={metrics?.matched_invoices ?? 0} />
        <MetricCard description="Factures avec acompte ou paiement partiel." label="Partielles" testId="reconciliation-partial" tone="warning" value={metrics?.partially_matched_invoices ?? 0} />
        <MetricCard description="Cas qui méritent un coup d'oeil avant validation." label="À vérifier" testId="reconciliation-review" tone="accent" value={metrics?.to_review ?? 0} />
        <MetricCard
          description="Montant qui n'a pas encore trouvé de facture définitive, séparé par devise."
          label="Reste à affecter"
          testId="reconciliation-outstanding"
          value={formatCurrencyBreakdown(metrics?.outstanding_amounts_by_currency, metrics?.outstanding_amount ?? 0)}
        />
      </div>

      <ReconciliationBoard busy={busy} onCreateManualMatch={onCreateManualMatch} onRun={onRun} workspace={workspace} />
    </div>
  );
}