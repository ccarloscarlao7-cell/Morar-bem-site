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
    const { nome, telefone, email, codigoImovel, tipoImovel, faixaInteresse } = req.body;

    // Validation
    if (!nome || !telefone || !email || !codigoImovel || !tipoImovel || !faixaInteresse || !nome.trim() || !telefone.trim() || !email.trim() || !codigoImovel.trim()) {
      return res.status(400).json({ error: "Campo obrigatório." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return res.status(400).json({ error: "Informe um e-mail válido." });
    }

    // Phone validation (valid Brazilian DDD + number)
    const phoneDigits = String(telefone || "").replace(/\D/g, "");
    const validPhone = /^(?:[1-9][0-9])(?:9?[0-9]{8})$/.test(phoneDigits);
    if (!validPhone) {
      return res.status(400).json({ error: "Informe um telefone válido." });
    }

    const newLead = {
      id: Date.now().toString(),
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email.trim(),
      codigoImovel: codigoImovel.trim(),
      tipoImovel: tipoImovel || null,
      faixaInteresse: faixaInteresse || null,
      createdAt: new Date().toISOString()
    };

    // Check duplicates: same codigoImovel + telefone/email, or if codigoImovel empty then telefone/email
    try {
      const leads = getLeads();
      const normalize = (s: any) => (String(s || "").replace(/\D/g, ""));
      const newPhone = normalize(telefone);
      const newEmail = String(email || "").toLowerCase();
      const newCodigo = String(codigoImovel || "").trim();

      const duplicate = leads.find((l: any) => {
        const lPhone = normalize(l.telefone);
        const lEmail = String(l.email || "").toLowerCase();
        const lCodigo = String(l.codigoImovel || "").trim();

        if (newCodigo && lCodigo) {
          if (lCodigo === newCodigo && ((lPhone && lPhone === newPhone) || (lEmail && lEmail === newEmail))) return true;
        } else {
          if ((lPhone && lPhone === newPhone) || (lEmail && lEmail === newEmail)) return true;
        }
        return false;
      });

      if (duplicate) {
        return res.status(409).json({ error: "Cadastro já existente." });
      }

      const saved = saveLead(newLead);
      if (!saved) {
        return res.status(500).json({ error: "Erro ao salvar os dados no servidor." });
      }

      return res.status(201).json({ success: true, lead: newLead });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Erro interno ao processar o cadastro." });
    }
  });

  // Endpoint to receive issue reports from client for support/diagnosis (CH-01)
  app.post("/api/issues", (req, res) => {
    const { screen, action, message, data, hasScreenshot, createdAt } = req.body;
    const issue = { id: Date.now().toString(), screen, action, message, data, hasScreenshot: !!hasScreenshot, createdAt: createdAt || new Date().toISOString() };

    try {
      const issuesFile = path.join(__dirname, "issues.json");
      let issues: any[] = [];
      if (fs.existsSync(issuesFile)) {
        issues = JSON.parse(fs.readFileSync(issuesFile, "utf-8"));
      }
      issues.push(issue);
      fs.writeFileSync(issuesFile, JSON.stringify(issues, null, 2), "utf-8");
      res.status(201).json({ success: true, issue });
    } catch (e) {
      console.error("Error saving issue", e);
      res.status(500).json({ error: "Erro ao registrar chamado." });
    }
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

