import { useState } from "react";
import { FileUp, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const UploadPanel = ({ dataset, title, description, count, columns, busy, onUpload }) => {
  const [files, setFiles] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (files.length === 0) return;
    for (const f of files) {
      await onUpload(dataset, f);
    }
    setFiles([]);
    event.target.reset();
  };

  return (
    <Card className="rounded-none border border-border bg-white shadow-none" data-testid={`${dataset}-upload-panel`}>
      <CardContent className="space-y-6 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="section-kicker" data-testid={`${dataset}-upload-kicker`}>
              Import guidé
            </div>
            <h2 className="font-heading text-2xl font-bold tracking-tight" data-testid={`${dataset}-upload-title`}>
              {title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground" data-testid={`${dataset}-upload-description`}>
              {description}
            </p>
          </div>
          <div className="metric-chip" data-testid={`${dataset}-upload-count`}>
            {count} lignes disponibles
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block border border-dashed border-primary/35 bg-primary/5 p-6" data-testid={`${dataset}-upload-dropzone`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center border border-primary/25 bg-white text-primary">
                  <FileUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-foreground" data-testid={`${dataset}-upload-supported-formats`}>
                    CSV, Excel, JSON ou PDF
                  </div>
                  <div className="text-sm text-muted-foreground" data-testid={`${dataset}-upload-columns`}>
                    Colonnes attendues : {columns}
                  </div>
                </div>
              </div>
              <Input
                accept=".csv,.xlsx,.xls,.json,.pdf"
                multiple
                className="max-w-full rounded-none border-border bg-white md:max-w-[280px]"
                data-testid={`${dataset}-upload-input`}
                onChange={(event) => setFiles(Array.from(event.target.files || []))}
                type="file"
              />
            </div>
          </label>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground" data-testid={`${dataset}-upload-file-name`}>
              <ShieldCheck className="h-4 w-4 text-primary" />
              {files.length > 0 ? files.map(f => f.name).join(", ") : "Aucun fichier."}
            </div>
            <Button className="rounded-none px-8" data-testid={`${dataset}-upload-submit-button`} disabled={files.length === 0 || busy} type="submit">
              Importer maintenant
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};