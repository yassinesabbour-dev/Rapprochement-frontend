import { useOutletContext, useNavigate } from "react-router-dom";
import { ArrowRight, Blocks, Landmark, Link2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MetricCard } from "@/components/metric-card";
import { formatCurrencyBreakdown } from "@/lib/formatting";

const featureCards = [
  { title: "Détecte les virements groupés", text: "Un seul virement peut solder plusieurs factures grâce au croisement montant, date et référence." },
  { title: "Laisse une place au contrôle", text: "Les cas ambigus remontent en revue manuelle au lieu de rester bloqués dans un tableur." },
  { title: "Produit une sortie claire", text: "Vous obtenez une liste factures payées, partielles, non rapprochées et exportables." },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { workspace, onLoadDemo, busy } = useOutletContext();
  const heroImage = "https://images.unsplash.com/photo-1696453423495-046a7d83bf55?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85";

  const handleDemo = async () => {
    await onLoadDemo();
    navigate("/rapprochement");
  };

  return (
    <div className="space-y-8" data-testid="home-page">
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12" data-testid="home-hero-section">
        <div className="border border-border bg-white p-6 md:p-8 xl:col-span-5">
          <div className="section-kicker" data-testid="home-hero-kicker">Rapprochement bancaire simplifié</div>
          <h2 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl" data-testid="home-hero-title">
            Arrêtez de chercher quel virement paie quelles factures.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground" data-testid="home-hero-description">
            Cette interface rassemble vos factures et vos relevés PDF, propose automatiquement les bonnes associations et gère les paiements regroupés sans perdre la trace comptable.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button className="rounded-none px-8" data-testid="home-load-demo-button" disabled={busy} onClick={handleDemo}>
              Charger une démonstration
            </Button>
            <Button className="rounded-none px-8" data-testid="home-go-import-button" onClick={() => navigate("/import")} variant="outline">
              Commencer avec mes fichiers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden border border-border bg-white xl:col-span-7" data-testid="home-hero-visual">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,47,167,0.06)_1px,transparent_1px),linear-gradient(rgba(0,47,167,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
          <img alt="bureau comptable minimaliste" className="relative aspect-[16/9] w-full object-cover object-center" data-testid="home-hero-image" src={heroImage} />
          <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-white/95 p-5 backdrop-blur">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="border border-border p-4" data-testid="home-hero-stat-matches">
                <div className="section-kicker">Virements groupés</div>
                <div className="mt-2 font-mono text-3xl font-semibold">1 → n</div>
              </div>
              <div className="border border-border p-4" data-testid="home-hero-stat-review">
                <div className="section-kicker">Validation</div>
                <div className="mt-2 font-mono text-3xl font-semibold">assistée</div>
              </div>
              <div className="border border-border p-4" data-testid="home-hero-stat-export">
                <div className="section-kicker">Sortie</div>
                <div className="mt-2 font-mono text-3xl font-semibold">CSV</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3" data-testid="home-metrics-section">
        <MetricCard description="Factures déjà soldées dans l'atelier courant." label="Factures payées" testId="home-metric-paid" tone="success" value={workspace?.metrics?.matched_invoices ?? 0} />
        <MetricCard
          description="Montant restant à contrôler ou encaisser, séparé par devise si besoin."
          label="Reste à encaisser"
          testId="home-metric-outstanding"
          tone="warning"
          value={formatCurrencyBreakdown(workspace?.metrics?.outstanding_amounts_by_currency, workspace?.metrics?.outstanding_amount ?? 0)}
        />
        <MetricCard description="Correspondances nécessitant une confirmation." label="À vérifier" testId="home-metric-review" tone="accent" value={workspace?.metrics?.to_review ?? 0} />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3" data-testid="home-features-section">
        {featureCards.map((card, index) => (
          <Card className="rounded-none border bg-white" data-testid={`home-feature-card-${index + 1}`} key={card.title}>
            <CardContent className="space-y-4 p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center border border-border bg-primary/5 text-primary">
                {[Landmark, Link2, ShieldCheck][index] && (() => {
                  const Icon = [Landmark, Link2, ShieldCheck][index];
                  return <Icon className="h-5 w-5" />;
                })()}
              </div>
              <h3 className="font-heading text-2xl font-bold tracking-tight" data-testid={`home-feature-title-${index + 1}`}>{card.title}</h3>
              <p className="text-sm text-muted-foreground" data-testid={`home-feature-text-${index + 1}`}>{card.text}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="border border-border bg-white p-6 md:p-8" data-testid="home-process-section">
        <div className="section-kicker">Méthode de travail</div>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[
            ["1", "Importer", "Ajoutez vos fichiers PDF, CSV ou Excel dans des zones séparées pour les factures et la banque."],
            ["2", "Rapprocher", "Le moteur cherche les références, montants exacts et lots de factures cohérents."],
            ["3", "Valider", "Complétez manuellement les cas restants puis exportez le résultat."],
          ].map(([step, title, text]) => (
            <div className="border border-border p-5" data-testid={`home-process-step-${step}`} key={step}>
              <div className="font-mono text-5xl font-semibold text-primary">{step}</div>
              <div className="mt-3 font-heading text-2xl font-bold tracking-tight">{title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}