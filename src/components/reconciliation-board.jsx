import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, FileText, Landmark, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrencyAmount } from "@/lib/formatting";

const statusStyles = {
  confirmé: "border-emerald-500/30 bg-emerald-50 text-emerald-700",
  manuel: "border-primary/25 bg-primary/5 text-primary",
  "à vérifier": "border-amber-500/30 bg-amber-50 text-amber-700",
};

export const ReconciliationBoard = ({ workspace, busy, onCreateManualMatch, onRun }) => {
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState([]);
  const [notes, setNotes] = useState("");

  const bankEntries = useMemo(() => workspace?.bank_entries || [], [workspace]);
  const openInvoices = useMemo(
    () => (workspace?.invoices || []).filter((invoice) => invoice.outstanding_amount > 0),
    [workspace],
  );
  const selectedBank = bankEntries.find((entry) => entry.id === selectedBankId) || null;
  const candidateInvoices = useMemo(() => {
    if (!selectedBank) return openInvoices;
    return openInvoices.filter((invoice) => invoice.currency === selectedBank.currency);
  }, [openInvoices, selectedBank]);

  useEffect(() => {
    const unresolved = bankEntries.find((entry) => entry.direction === "credit" && entry.remaining_amount > 0);
    setSelectedBankId(unresolved?.id || bankEntries[0]?.id || null);
    setSelectedInvoiceIds([]);
    setNotes("");
  }, [workspace, bankEntries]);

  const selectedInvoices = candidateInvoices.filter((invoice) => selectedInvoiceIds.includes(invoice.id));
  const selectedTotal = selectedInvoices.reduce((sum, invoice) => sum + invoice.outstanding_amount, 0);

  const toggleInvoice = (invoiceId) => {
    setSelectedInvoiceIds((current) =>
      current.includes(invoiceId) ? current.filter((id) => id !== invoiceId) : [...current, invoiceId],
    );
  };

  const handleManualMatch = async () => {
    if (!selectedBank || selectedInvoiceIds.length === 0) return;
    await onCreateManualMatch({ bank_entry_id: selectedBank.id, invoice_ids: selectedInvoiceIds, notes });
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12" data-testid="reconciliation-board">
      <Card className="rounded-none border bg-white xl:col-span-4" data-testid="bank-entries-panel">
        <CardContent className="space-y-4 p-0">
          <div className="flex items-center gap-3 border-b border-border px-6 py-4">
            <Landmark className="h-5 w-5 text-primary" />
            <div>
              <div className="section-kicker">Entrées bancaires</div>
              <div className="font-heading text-xl font-bold" data-testid="bank-entries-title">Choisissez un virement</div>
            </div>
          </div>
          <div className="space-y-3 px-4 pb-4">
            {bankEntries.map((entry) => (
              <button
                className={`w-full border p-4 text-left transition-all duration-200 ${selectedBankId === entry.id ? "border-primary bg-primary/5" : "border-border bg-white hover:border-primary/40"}`}
                data-testid={`bank-entry-${entry.id}`}
                key={entry.id}
                onClick={() => {
                  setSelectedBankId(entry.id);
                  setSelectedInvoiceIds([]);
                }}
                type="button"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-foreground" data-testid={`bank-entry-label-${entry.id}`}>{entry.label}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground" data-testid={`bank-entry-date-${entry.id}`}>
                      {entry.booking_date}
                    </div>
                  </div>
                  <div className="font-mono text-base font-semibold" data-testid={`bank-entry-amount-${entry.id}`}>{formatCurrencyAmount(entry.amount, entry.currency)}</div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="border border-border px-2 py-1" data-testid={`bank-entry-status-${entry.id}`}>{entry.status}</span>
                  <span className="border border-border px-2 py-1" data-testid={`bank-entry-remaining-${entry.id}`}>Reste {formatCurrencyAmount(entry.remaining_amount, entry.currency)}</span>
                  <span className="border border-border px-2 py-1" data-testid={`bank-entry-currency-${entry.id}`}>{entry.currency}</span>
                  {entry.extraction_notes?.length > 0 && <span className="border border-amber-400/40 bg-amber-50 px-2 py-1 text-amber-700" data-testid={`bank-entry-review-${entry.id}`}>PDF à vérifier</span>}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none border bg-white xl:col-span-4" data-testid="manual-match-panel">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            <div>
              <div className="section-kicker">Zone d'action</div>
              <div className="font-heading text-xl font-bold" data-testid="manual-match-title">Associer un virement à plusieurs factures</div>
            </div>
          </div>

          <div className="border border-border bg-muted/20 p-4" data-testid="manual-match-selection-summary">
            <div className="text-sm text-muted-foreground">Virement sélectionné</div>
            <div className="mt-2 font-medium text-foreground" data-testid="selected-bank-label">{selectedBank?.label || "Choisissez un virement"}</div>
            <div className="mt-2 font-mono text-2xl font-semibold" data-testid="selected-bank-remaining">
              {selectedBank ? `${formatCurrencyAmount(selectedBank.remaining_amount, selectedBank.currency)} à affecter` : "0 EUR"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4" data-testid="manual-match-stats">
            <div className="border border-border p-4">
              <div className="section-kicker">Factures cochées</div>
              <div className="mt-2 font-mono text-2xl font-semibold" data-testid="selected-invoice-count">{selectedInvoiceIds.length}</div>
            </div>
            <div className="border border-border p-4">
              <div className="section-kicker">Montant total</div>
              <div className="mt-2 font-mono text-2xl font-semibold" data-testid="selected-invoice-total">{selectedBank ? formatCurrencyAmount(selectedTotal, selectedBank.currency) : "0 EUR"}</div>
            </div>
          </div>

          <Input
            className="rounded-none border-border"
            data-testid="manual-match-notes-input"
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Note interne : ex. virement groupé client février"
            value={notes}
          />

          <div className="flex flex-col gap-3">
            <Button
              className="rounded-none"
              data-testid="create-manual-match-button"
              disabled={busy || !selectedBank || selectedInvoiceIds.length === 0 || selectedBank.remaining_amount <= 0}
              onClick={handleManualMatch}
            >
              <Link2 className="mr-2 h-4 w-4" />
              Créer l'association manuelle
            </Button>
            <Button className="rounded-none" data-testid="rerun-match-button" disabled={busy} onClick={onRun} variant="outline">
              Recalculer les propositions
            </Button>
          </div>

          <div className="space-y-3" data-testid="suggested-matches-list">
            <div className="section-kicker">Suggestions calculées</div>
            {(workspace?.matches || []).slice(0, 4).map((match) => (
              <div className="border border-border p-4" data-testid={`suggested-match-${match.id}`} key={match.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-foreground">{match.invoice_numbers.join(" · ")}</div>
                  <span className={`border px-2 py-1 text-xs ${statusStyles[match.status] || "border-border bg-muted text-foreground"}`} data-testid={`suggested-match-status-${match.id}`}>
                    {match.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground" data-testid={`suggested-match-note-${match.id}`}>{match.note}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none border bg-white xl:col-span-4" data-testid="open-invoices-panel">
        <CardContent className="space-y-4 p-0">
          <div className="flex items-center gap-3 border-b border-border px-6 py-4">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <div className="section-kicker">Factures ouvertes</div>
              <div className="font-heading text-xl font-bold" data-testid="open-invoices-title">Sélection multi-factures</div>
            </div>
          </div>
          <div className="space-y-3 px-4 pb-4">
            {candidateInvoices.map((invoice) => {
              const active = selectedInvoiceIds.includes(invoice.id);
              return (
                <label className={`flex cursor-pointer items-start gap-3 border p-4 transition-all duration-200 ${active ? "border-primary bg-primary/5" : "border-border bg-white hover:border-primary/35"}`} data-testid={`invoice-row-${invoice.id}`} key={invoice.id}>
                  <input checked={active} className="mt-1 h-4 w-4 accent-[#002FA7]" data-testid={`invoice-checkbox-${invoice.id}`} onChange={() => toggleInvoice(invoice.id)} type="checkbox" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium text-foreground" data-testid={`invoice-number-${invoice.id}`}>{invoice.invoice_number}</div>
                        <div className="mt-1 text-sm text-muted-foreground" data-testid={`invoice-customer-${invoice.id}`}>{invoice.customer_name}</div>
                      </div>
                      <div className="font-mono text-base font-semibold" data-testid={`invoice-outstanding-${invoice.id}`}>{formatCurrencyAmount(invoice.outstanding_amount, invoice.currency)}</div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="border border-border px-2 py-1" data-testid={`invoice-status-${invoice.id}`}>{invoice.status}</span>
                      <span className="border border-border px-2 py-1" data-testid={`invoice-due-date-${invoice.id}`}>Échéance {invoice.due_date}</span>
                      <span className="border border-border px-2 py-1" data-testid={`invoice-currency-${invoice.id}`}>{invoice.currency}</span>
                      {invoice.extraction_notes?.length > 0 && <span className="border border-amber-400/40 bg-amber-50 px-2 py-1 text-amber-700" data-testid={`invoice-review-${invoice.id}`}>PDF à vérifier</span>}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};