import { Link, NavLink, Outlet } from "react-router-dom";
import { ArrowRight, Database, GitCompareArrows, House, RotateCcw, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrencyBreakdown } from "@/lib/formatting";

const navItems = [
  { to: "/", label: "Accueil", icon: House, testId: "home-nav-link" },
  { to: "/import", label: "Import", icon: Upload, testId: "import-nav-link" },
  { to: "/rapprochement", label: "Rapprochement", icon: GitCompareArrows, testId: "reconciliation-nav-link" },
  { to: "/resultats", label: "Résultats", icon: Database, testId: "results-nav-link" },
];

const StatStrip = ({ label, value, testId }) => (
  <div className="border-t border-white/20 py-3" data-testid={`${testId}-container`}>
    <div className="text-[11px] uppercase tracking-[0.28em] text-white/70">{label}</div>
    <div className="mt-1 font-mono text-xl font-semibold text-white" data-testid={testId}>
      {value}
    </div>
  </div>
);

export const AppShell = ({ workspace, busy, onCreateManualMatch, onLoadDemo, onReset, onRun, onUpload }) => {
  const metrics = workspace?.metrics;

  return (
    <div className="finance-grid min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="flex flex-col justify-between border-r border-white/15 bg-primary px-6 py-8 text-primary-foreground lg:px-8">
          <div>
            <Link className="inline-flex items-center gap-3" data-testid="brand-link" to="/">
              <div className="flex h-11 w-11 items-center justify-center border border-white/30 text-sm font-semibold">
                FX
              </div>
              <div>
                <div className="font-heading text-xl font-extrabold tracking-tight">Flux Rapprochement</div>
                <div className="text-sm text-white/72" data-testid="brand-subtitle">
                  Factures et relevés alignés, même pour les virements groupés.
                </div>
              </div>
            </Link>

            <nav className="mt-10 flex flex-col gap-2" data-testid="primary-navigation">
              {navItems.map(({ to, label, icon: Icon, testId }) => (
                <NavLink
                  key={to}
                  className={({ isActive }) =>
                    `inline-flex items-center justify-between border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive ? "border-white bg-white text-primary" : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                    }`
                  }
                  data-testid={testId}
                  to={to}
                >
                  <span className="inline-flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </NavLink>
              ))}
            </nav>

            <div className="mt-10 border border-white/20 bg-white/5 p-5" data-testid="workspace-summary-card">
              <div className="text-[11px] uppercase tracking-[0.3em] text-white/72">Vue rapide</div>
              <StatStrip label="Factures soldées" testId="workspace-matched-invoices" value={metrics?.matched_invoices ?? 0} />
              <StatStrip label="À vérifier" testId="workspace-review-count" value={metrics?.to_review ?? 0} />
              <StatStrip
                label="Reste à encaisser"
                testId="workspace-outstanding-amount"
                value={formatCurrencyBreakdown(metrics?.outstanding_amounts_by_currency, metrics?.outstanding_amount ?? 0)}
              />
            </div>
          </div>

          <div className="space-y-3" data-testid="workspace-actions-panel">
            <Button
              className="h-11 w-full rounded-none border border-white bg-white text-primary transition-transform duration-200 hover:-translate-y-[1px] hover:bg-white/90"
              data-testid="load-demo-button"
              disabled={busy}
              onClick={onLoadDemo}
            >
              Charger une démo
            </Button>
            <Button
              className="h-11 w-full rounded-none border border-white/30 bg-transparent text-white transition-transform duration-200 hover:-translate-y-[1px] hover:bg-white/10"
              data-testid="run-reconciliation-button"
              disabled={busy}
              onClick={onRun}
              variant="outline"
            >
              Relancer le rapprochement
            </Button>
            <Button
              className="h-11 w-full rounded-none border border-white/15 bg-white/5 text-white transition-transform duration-200 hover:-translate-y-[1px] hover:bg-white/10"
              data-testid="reset-workspace-button"
              disabled={busy}
              onClick={onReset}
              variant="ghost"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
        </aside>

        <main className="min-w-0 bg-[#f8f9fa]">
          <header className="border-b border-border bg-white/95 px-6 py-5 backdrop-blur md:px-10" data-testid="workspace-header">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="section-kicker" data-testid="workspace-header-kicker">
                  Atelier de pilotage
                </div>
                <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground" data-testid="workspace-header-title">
                  {workspace?.workspace_name || "Rapprochement intelligent"}
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-muted-foreground" data-testid="workspace-header-description">
                  Importez vos factures, croisez-les avec vos entrées bancaires, puis validez les cas groupés en un seul endroit.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" data-testid="workspace-header-metrics">
                <div className="metric-chip" data-testid="header-total-invoices">{metrics?.total_invoices ?? 0} factures</div>
                <div className="metric-chip" data-testid="header-total-bank-entries">{metrics?.total_bank_entries ?? 0} lignes bancaires</div>
                <div className="metric-chip" data-testid="header-last-run">{workspace?.last_run_at ? `Mis à jour ${new Date(workspace.last_run_at).toLocaleString("fr-FR")}` : "En attente d'un premier calcul"}</div>
              </div>
            </div>
          </header>

          <section className="px-6 py-8 md:px-10 md:py-10">
            <Outlet context={{ workspace, busy, onCreateManualMatch, onLoadDemo, onRun, onUpload }} />
          </section>
        </main>
      </div>
    </div>
  );
};