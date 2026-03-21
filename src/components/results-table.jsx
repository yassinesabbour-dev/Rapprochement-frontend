import { Download, SearchCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrencyAmount } from "@/lib/formatting";

const badgeClasses = {
  payée: "border-emerald-500/30 bg-emerald-50 text-emerald-700",
  partielle: "border-amber-500/30 bg-amber-50 text-amber-700",
  "non rapprochée": "border-border bg-muted text-foreground",
};

export const ResultsTable = ({ workspace, onExport }) => {
  const invoices = workspace?.invoices || [];
  const matches = workspace?.matches || [];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]" data-testid="results-layout">
      <Card className="rounded-none border bg-white" data-testid="invoice-results-card">
        <CardContent className="space-y-5 p-0">
          <div className="flex flex-col gap-4 border-b border-border px-6 py-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="section-kicker">Sortie comptable</div>
              <h2 className="font-heading text-2xl font-bold tracking-tight" data-testid="invoice-results-title">Factures rapprochées, partielles et en attente</h2>
            </div>
            <Button className="rounded-none" data-testid="export-results-button" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Exporter en CSV
            </Button>
          </div>

          <Table data-testid="invoice-results-table">
            <TableHeader>
              <TableRow>
                <TableHead>Facture</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Devise</TableHead>
                <TableHead className="text-right">Rapproché</TableHead>
                <TableHead className="text-right">Reste</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow data-testid={`result-invoice-row-${invoice.id}`} key={invoice.id}>
                  <TableCell className="font-mono text-xs" data-testid={`result-invoice-number-${invoice.id}`}>{invoice.invoice_number}</TableCell>
                  <TableCell data-testid={`result-invoice-customer-${invoice.id}`}>{invoice.customer_name}</TableCell>
                  <TableCell>
                    <span className={`inline-flex border px-2 py-1 text-xs ${badgeClasses[invoice.status] || badgeClasses["non rapprochée"]}`} data-testid={`result-invoice-status-${invoice.id}`}>
                      {invoice.status}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono" data-testid={`result-invoice-currency-${invoice.id}`}>{invoice.currency}</TableCell>
                  <TableCell className="text-right font-mono" data-testid={`result-invoice-matched-${invoice.id}`}>{formatCurrencyAmount(invoice.matched_amount, invoice.currency)}</TableCell>
                  <TableCell className="text-right font-mono" data-testid={`result-invoice-outstanding-${invoice.id}`}>{formatCurrencyAmount(invoice.outstanding_amount, invoice.currency)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="rounded-none border bg-white" data-testid="match-results-card">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <SearchCheck className="h-5 w-5 text-primary" />
            <div>
              <div className="section-kicker">Traçabilité</div>
              <h2 className="font-heading text-2xl font-bold tracking-tight" data-testid="match-results-title">Correspondances enregistrées</h2>
            </div>
          </div>

          <div className="space-y-3" data-testid="match-results-list">
            {matches.map((match) => (
              <div className="border border-border p-4" data-testid={`match-row-${match.id}`} key={match.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-foreground" data-testid={`match-bank-label-${match.id}`}>{match.bank_label}</div>
                    <div className="mt-1 text-sm text-muted-foreground" data-testid={`match-invoices-${match.id}`}>{match.invoice_numbers.join(" · ")}</div>
                  </div>
                  <div className="font-mono text-right text-sm" data-testid={`match-amount-${match.id}`}>{formatCurrencyAmount(match.applied_amount, match.currency)}</div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="border border-border px-2 py-1" data-testid={`match-basis-${match.id}`}>{match.match_basis}</span>
                  <span className="border border-border px-2 py-1" data-testid={`match-status-${match.id}`}>{match.status}</span>
                  <span className="border border-border px-2 py-1" data-testid={`match-currency-${match.id}`}>{match.currency}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};