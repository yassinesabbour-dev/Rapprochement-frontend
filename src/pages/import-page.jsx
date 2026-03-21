import { useOutletContext, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadPanel } from "@/components/upload-panel";

export default function ImportPage() {
  const navigate = useNavigate();
  const { workspace, busy, onUpload } = useOutletContext();

  return (
    <div className="space-y-6" data-testid="import-page">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <UploadPanel
            busy={busy}
            columns="invoice_number, customer_name, issue_date, due_date, amount, currency"
            count={workspace?.invoices?.length ?? 0}
            dataset="invoices"
            description="Importez vos factures ouvertes en PDF, Excel, CSV ou JSON. Les PDF texte et scannés sont analysés automatiquement avec repérage des champs incertains."
            onUpload={onUpload}
            title="Factures à rapprocher"
          />
        </div>
        <div className="xl:col-span-5">
          <Card className="h-full rounded-none border bg-white" data-testid="import-guidelines-card">
            <CardContent className="space-y-5 p-6 md:p-8">
              <div className="section-kicker">Préparer les données</div>
              <h2 className="font-heading text-2xl font-bold tracking-tight" data-testid="import-guidelines-title">Plus vos colonnes sont claires, plus le rapprochement est fiable</h2>
              <div className="space-y-3 text-sm text-muted-foreground" data-testid="import-guidelines-list">
                <p>Pour les factures, gardez une référence unique par ligne et un montant TTC fiable.</p>
                <p>Pour la banque, importez les crédits reçus avec date d'opération, libellé, montant et devise.</p>
                <p>Les PDF scannés ou texte sont acceptés, avec extraction automatique des infos utiles puis contrôle manuel si besoin.</p>
                <p>Les virements groupés seront proposés sous forme de lots de factures quand la somme colle.</p>
              </div>
              <Button className="rounded-none" data-testid="go-reconciliation-from-import-button" onClick={() => navigate("/rapprochement")} variant="outline">
                Aller à l'écran de rapprochement
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <UploadPanel
        busy={busy}
        columns="booking_date, label, amount, reference, currency"
        count={workspace?.bank_entries?.length ?? 0}
        dataset="bank"
        description="Ajoutez votre relevé bancaire en PDF, Excel, CSV ou JSON pour identifier les encaissements, y compris les virements qui couvrent plusieurs factures, en EUR ou MAD."
        onUpload={onUpload}
        title="Relevé bancaire"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]" data-testid="import-bottom-section">
        <Card className="rounded-none border bg-white" data-testid="import-sources-card">
          <CardContent className="space-y-4 p-6">
            <div className="section-kicker">Historique d'import</div>
            <h2 className="font-heading text-2xl font-bold tracking-tight" data-testid="import-sources-title">Fichiers déjà pris en compte</h2>
            <div className="space-y-3" data-testid="import-sources-list">
              {(workspace?.imported_sources || []).map((source) => (
                <div className="flex flex-col gap-2 border border-border p-4 md:flex-row md:items-center md:justify-between" data-testid={`import-source-${source.id}`} key={source.id}>
                  <div>
                    <div className="font-medium text-foreground" data-testid={`import-source-name-${source.id}`}>{source.file_name}</div>
                    <div className="text-sm text-muted-foreground" data-testid={`import-source-dataset-${source.id}`}>{source.dataset} · {source.rows_count} lignes</div>
                  </div>
                  <div className="text-sm text-muted-foreground" data-testid={`import-source-date-${source.id}`}>{new Date(source.imported_at).toLocaleString("fr-FR")}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border bg-primary text-primary-foreground" data-testid="import-next-steps-card">
          <CardContent className="space-y-4 p-6">
            <div className="section-kicker text-white/75">Suite logique</div>
            <h2 className="font-heading text-2xl font-bold tracking-tight" data-testid="import-next-steps-title">Ensuite, le moteur calcule automatiquement les meilleures associations</h2>
            <p className="text-sm text-white/75" data-testid="import-next-steps-description">
              Si plusieurs factures sont payées par un seul virement, vous pourrez confirmer ou corriger ce lot depuis la vue de rapprochement, sans mélanger les devises.
            </p>
            <Button className="rounded-none border border-white bg-white text-primary hover:bg-white/90" data-testid="open-reconciliation-workbench-button" onClick={() => navigate("/rapprochement")}>
              Ouvrir l'atelier de rapprochement
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}