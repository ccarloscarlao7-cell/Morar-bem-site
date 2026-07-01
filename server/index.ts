import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LEADS_FILE = path.join(__dirname, "leads.json");

// Helper to read leads
function getLeads() {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading leads file", e);
  }
  return [];
}

// Helper to save lead
function saveLead(lead: any) {
  try {
    const leads = getLeads();
    leads.push(lead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Error saving lead", e);
    return false;
  }
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // API endpoints
  app.get("/api/leads", (_req, res) => {
    res.json(getLeads());
  });

  app.post("/api/leads", (req, res) => {
    const { nome, telefone, codigoImovel, tipoImovel, faixaInteresse } = req.body;

    // Validation
    if (!nome || !telefone || !codigoImovel || !nome.trim() || !telefone.trim() || !codigoImovel.trim()) {
      return res.status(400).json({ error: "Por favor, preencha todos os campos obrigatórios." });
    }

    const newLead = {
      id: Date.now().toString(),
      nome: nome.trim(),
      telefone: telefone.trim(),
      codigoImovel: codigoImovel.trim(),
      tipoImovel: tipoImovel || null,
      faixaInteresse: faixaInteresse || null,
      createdAt: new Date().toISOString()
    };

    const saved = saveLead(newLead);
    if (!saved) {
      return res.status(500).json({ error: "Erro ao salvar os dados no servidor." });
    }

    res.status(201).json({ success: true, lead: newLead });
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

