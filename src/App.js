import { useCallback, useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { toast, Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/app-shell";
import { reconciliationApi } from "@/lib/api";
import HomePage from "@/pages/home-page";
import ImportPage from "@/pages/import-page";
import ReconciliationPage from "@/pages/reconciliation-page";
import ResultsPage from "@/pages/results-page";

const getErrorMessage = (error) =>
  error?.response?.data?.detail || "Une erreur est survenue. Réessayez dans un instant.";

function App() {
  const [workspace, setWorkspace] = useState(null);
  const [busy, setBusy] = useState(false);

  const runAction = useCallback(async (request, successMessage) => {
    setBusy(true);
    try {
      const nextWorkspace = await request();
      setWorkspace(nextWorkspace);
      if (successMessage) {
        toast.success(successMessage);
      }
      return nextWorkspace;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      setBusy(false);
    }
  }, []);

  const loadWorkspace = useCallback(async () => {
    setBusy(true);
    try {
      const nextWorkspace = await reconciliationApi.getWorkspace();
      setWorkspace(nextWorkspace);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  const handleLoadDemo = () =>
    runAction(() => reconciliationApi.loadDemo(), "Démo prête. Vous pouvez maintenant valider les rapprochements.");
  const handleReset = () => runAction(() => reconciliationApi.resetWorkspace(), "Atelier réinitialisé.");
  const handleRun = () => runAction(() => reconciliationApi.runReconciliation(), "Calcul relancé avec succès.");
  const handleUpload = (dataset, file) =>
    runAction(
      () => reconciliationApi.uploadDataset(dataset, file),
      dataset === "invoices" ? "Factures importées avec succès." : "Relevé bancaire importé avec succès.",
    );
  const handleCreateManualMatch = (payload) =>
    runAction(() => reconciliationApi.createManualMatch(payload), "Association manuelle enregistrée.");

  if (!workspace) {
    return (
      <div className="loading-screen" data-testid="app-loading-screen">
        <div className="loading-bar" />
        <div className="section-kicker text-primary">Chargement de l'atelier</div>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight">
          Préparation de votre écran de rapprochement
        </h1>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route
            element={
              <AppShell
                busy={busy}
                onCreateManualMatch={handleCreateManualMatch}
                onLoadDemo={handleLoadDemo}
                onReset={handleReset}
                onRun={handleRun}
                onUpload={handleUpload}
                workspace={workspace}
              />
            }
            path="/"
          >
            <Route element={<HomePage />} index />
            <Route element={<ImportPage />} path="import" />
            <Route element={<ReconciliationPage />} path="rapprochement" />
            <Route element={<ResultsPage />} path="resultats" />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
