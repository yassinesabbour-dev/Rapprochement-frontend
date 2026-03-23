import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://rapprochement-backend-2.onrender.com';
const API = `${BACKEND_URL}/api`;

const client = axios.create({
  baseURL: API,
  timeout: 120000,
});

export const exportUrl = `${API}/reconciliation/export.csv`;

export const reconciliationApi = {
  getWorkspace: async () => (await client.get("/reconciliation/workspace")).data,
  loadDemo: async () => (await client.post("/reconciliation/demo")).data,
  resetWorkspace: async () => (await client.post("/reconciliation/reset")).data,
  runReconciliation: async () => (await client.post("/reconciliation/run")).data,
  createManualMatch: async (payload) =>
    (await client.post("/reconciliation/manual-match", payload)).data,
  uploadDataset: async (dataset, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return (
      await client.post(`/reconciliation/import/${dataset}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  },
};