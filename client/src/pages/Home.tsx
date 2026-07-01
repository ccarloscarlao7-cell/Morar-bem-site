import { useState, useEffect } from "react";
import { validateLeadForm } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Building2,
  Home as HomeIcon,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LogIn,
  LogOut,
  X,
  Phone,
  Mail,
  MessageSquare,
  Shield,
  Eye,
  EyeOff,
  BedDouble,
  Bath,
  Maximize,
  Car,
  Users,
  ClipboardList,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────────────────
const ADMIN_USERNAME = "Roberto";
const ADMIN_PASSWORD = "1234";
const WHATSAPP_NUMBER = "5511940028922"; // número da imobiliária
const CONTACT_EMAIL = "contato@morarbemimoveis.com.br";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Property {
  code: string;
  title: string;
  type: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  cars: number;
  area: string;
  tag: string;
  budgetRange: string;
  imageColor: string;
  images: string[];
  description: string;
}

interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  codigoImovel: string;
  tipoImovel: string | null;
  faixaInteresse: string | null;
  createdAt: string;
}

// ─── Mock Properties ──────────────────────────────────────────────────────────
const PROPERTIES: Property[] = [
  {
    code: "C-101",
    title: "Casa de Luxo Alphaville",
    type: "Casa",
    price: "R$ 1.500.000",
    location: "Alphaville, Barueri - SP",
    beds: 4,
    baths: 5,
    cars: 3,
    area: "350m²",
    tag: "Exclusivo",
    budgetRange: "R$ 1.000.000 a R$ 2.000.000",
    imageColor: "from-blue-600 to-indigo-800",
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Magnífica residência em condomínio fechado de alto padrão. Acabamentos premium, piscina aquecida, espaço gourmet completo, jardim paisagístico e segurança 24h. Perfeita para quem busca qualidade de vida e sofisticação.",
  },
  {
    code: "A-202",
    title: "Apartamento Vista Parque",
    type: "Apartamento",
    price: "R$ 850.000",
    location: "Jardins, São Paulo - SP",
    beds: 3,
    baths: 3,
    cars: 2,
    area: "120m²",
    tag: "Destaque",
    budgetRange: "R$ 500.000 a R$ 1.000.000",
    imageColor: "from-emerald-600 to-teal-800",
    images: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Apartamento moderno com vista privilegiada para o parque. Localizado em uma das regiões mais nobres de São Paulo, próximo a restaurantes, shopping e transporte. Varanda ampla, cozinha americana e ambientes planejados.",
  },
  {
    code: "A-303",
    title: "Cobertura Duplex Leblon",
    type: "Apartamento",
    price: "R$ 3.200.000",
    location: "Leblon, Rio de Janeiro - RJ",
    beds: 4,
    baths: 6,
    cars: 3,
    area: "420m²",
    tag: "Alto Padrão",
    budgetRange: "Acima de R$ 2.000.000",
    imageColor: "from-purple-600 to-pink-800",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Cobertura duplex excepcional no bairro mais exclusivo do Rio de Janeiro. Piscina privativa com vista para o mar, terraço gourmet, sala de cinema, academia e área de lazer completa. O ápice do luxo carioca.",
  },
  {
    code: "T-404",
    title: "Terreno Comercial Plano",
    type: "Terreno",
    price: "R$ 450.000",
    location: "Interlagos, São Paulo - SP",
    beds: 0,
    baths: 0,
    cars: 0,
    area: "600m²",
    tag: "Oportunidade",
    budgetRange: "Até R$ 500.000",
    imageColor: "from-amber-500 to-orange-700",
    images: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Terreno plano em localização estratégica, ideal para empreendimentos comerciais ou residenciais. Excelente potencial construtivo, área totalmente regularizada com escritura e sem pendências. Oportunidade única de investimento.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  // ── Admin state
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);

  // ── Property detail state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ── Interest form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("todos");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [codigoImovel, setCodigoImovel] = useState("");
  const [tipoImovel, setTipoImovel] = useState("");
  const [faixaInteresse, setFaixaInteresse] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load leads from localStorage
  const loadLeads = () => {
    const stored = localStorage.getItem("morar_bem_leads");
    setLeads(stored ? JSON.parse(stored) : []);
  };

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedProperty]);

  // ── Admin Login Handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError("");
    if (adminUsername.trim() === ADMIN_USERNAME && adminPassword === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setIsAdminLoginOpen(false);
      setAdminUsername("");
      setAdminPassword("");
      loadLeads();
      setIsAdminPanelOpen(true);
      toast.success(`Bem-vindo, ${ADMIN_USERNAME}!`);
    } else {
      setAdminLoginError("Usuário ou senha incorretos. Tente novamente.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setIsAdminPanelOpen(false);
    toast.info("Sessão administrativa encerrada.");
  };

  const handleDeleteLead = (id: string) => {
    const updated = leads.filter((l) => l.id !== id);
    setLeads(updated);
    localStorage.setItem("morar_bem_leads", JSON.stringify(updated));
    toast.success("Contato removido.");
  };

  const handleClearAllLeads = () => {
    setLeads([]);
    localStorage.removeItem("morar_bem_leads");
    toast.info("Todos os contatos foram removidos.");
  };

  // ── Property detail open
  const handleOpenDetail = (property: Property) => {
    setSelectedProperty(property);
    setCurrentImageIndex(0);
    setIsDetailOpen(true);
  };

  const handleNextImage = () => {
    if (!selectedProperty) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedProperty.images.length);
  };

  const handlePrevImage = () => {
    if (!selectedProperty) return;
    setCurrentImageIndex((prev) => (prev - 1 + selectedProperty.images.length) % selectedProperty.images.length);
  };

  // ── Contact actions
  const handleWhatsApp = (property: Property) => {
    const msg = encodeURIComponent(
      `Olá! Tenho interesse no imóvel *${property.title}* (Ref: ${property.code}). Poderia me passar mais informações?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  const handleEmail = (property: Property) => {
    const subject = encodeURIComponent(`Interesse no imóvel ${property.code} - ${property.title}`);
    const body = encodeURIComponent(
      `Olá,\n\nTenho interesse no imóvel "${property.title}" (Ref: ${property.code}), localizado em ${property.location}, no valor de ${property.price}.\n\nPoderia me enviar mais informações?\n\nAguardo retorno.`
    );
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, "_blank");
  };

  const handleSMS = (property: Property) => {
    const msg = encodeURIComponent(
      `Oi! Tenho interesse no imóvel ${property.title} (Ref: ${property.code}). Me contate!`
    );
    window.open(`sms:${WHATSAPP_NUMBER}?body=${msg}`, "_blank");
  };

  // ── Phone mask
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    let masked = digits;
    if (digits.length > 2) {
      const area = digits.slice(0, 2);
      const rest = digits.slice(2);
      if (rest.length <= 4) masked = `(${area}) ${rest}`;
      else if (rest.length <= 8) masked = `(${area}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
      else masked = `(${area}) ${rest.slice(0, 5)}-${rest.slice(5, 9)}`;
    }
    setTelefone(masked);
  };

  // ── Open interest modal
  const handleOpenInterest = (propertyCode?: string, propertyType?: string) => {
    setErrorMsg("");
    setIsSuccess(false);
    setCodigoImovel(propertyCode ?? "");
    setTipoImovel(propertyType ?? "");
    setNome("");
    setTelefone("");
    setEmail("");
    setFaixaInteresse("");
    setIsDetailOpen(false);
    setIsModalOpen(true);
  };

  // ── Submit interest form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    const leadData = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email.trim(),
      codigoImovel: codigoImovel.trim(),
      tipoImovel: tipoImovel || null,
      faixaInteresse: faixaInteresse || null,
    };

    const validation = validateLeadForm(leadData);
    if (!validation.isValid) {
      setErrorMsg(validation.message);
      setIsSubmitting(false);
      return;
    }

    try {
      const existingLeads: Lead[] = JSON.parse(localStorage.getItem("morar_bem_leads") || "[]");
      const newLead: Lead = {
        ...leadData,
        tipoImovel: leadData.tipoImovel,
        faixaInteresse: leadData.faixaInteresse,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      existingLeads.push(newLead);
      localStorage.setItem("morar_bem_leads", JSON.stringify(existingLeads));
      loadLeads();

      // Try backend (ignores failure gracefully)
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      }).catch(() => {});

      setIsSuccess(true);
      toast.success("Enviado com Sucesso!");
    } catch {
      setIsSuccess(true);
      toast.success("Salvo localmente com Sucesso!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProperties =
    selectedType === "todos"
      ? PROPERTIES
      : PROPERTIES.filter((p) => p.type.toLowerCase() === selectedType.toLowerCase());

  // ── Helpers
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("pt-BR");
    } catch {
      return iso;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-700 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
              M
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Morar</span>
              <span className="text-xl font-bold text-blue-700">Bem</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#imoveis" className="hover:text-blue-700 transition">Imóveis</a>
            <a href="#sobre" className="hover:text-blue-700 transition">Sobre Nós</a>
            <a href="#contato" className="hover:text-blue-700 transition">Contato</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Admin button */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => { loadLeads(); setIsAdminPanelOpen(true); }}
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 gap-1.5 font-semibold relative"
                >
                  <ClipboardList className="w-4 h-4" />
                  Painel Admin
                  {leads.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {leads.length}
                    </span>
                  )}
                </Button>
                <Button
                  onClick={handleAdminLogout}
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-red-600 gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  setAdminLoginError("");
                  setAdminUsername("");
                  setAdminPassword("");
                  setIsAdminLoginOpen(true);
                }}
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-blue-700 gap-1.5 font-medium"
              >
                <Shield className="w-4 h-4" />
                Administrador
              </Button>
            )}

            <Button
              onClick={() => handleOpenInterest()}
              className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-full shadow-lg shadow-blue-700/20 active:scale-95 transition"
            >
              Tenho Interesse
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative py-20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/30 via-slate-900/80 to-slate-950 -z-10" />
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1 bg-amber-400/15 border border-amber-300/20 px-3 py-1 rounded-full text-amber-300 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Sua vitrine digital de imóveis
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                O caminho mais curto para o seu novo lar
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Explore nossa seleção exclusiva de casas, apartamentos e terrenos. Clique em qualquer imóvel para ver todos os detalhes e registre seu interesse em segundos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#imoveis">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-xl shadow-blue-700/30">
                    Ver Imóveis Disponíveis
                  </Button>
                </a>
                <Button
                  onClick={() => handleOpenInterest()}
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-white border-white/20 hover:bg-white/10"
                >
                  Registrar Interesse Geral
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-400/40 to-amber-300/30 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
                  alt="Corretor orientando cliente com confiança"
                  className="h-80 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur-sm">
                    <Shield className="w-4 h-4 text-emerald-300" />
                    Imobiliária confiável e transparente
                  </div>
                  <p className="mt-3 max-w-md text-sm text-slate-200">
                    Atendimento humano, segurança nas negociações e imóveis selecionados com excelência.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section id="sobre" className="py-16 bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 mb-4">
                <Shield className="w-4 h-4" />
                Sobre a Morar Bem
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
                Mais do que vender imóveis, construímos confiança e oportunidades.
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Nossa equipe trabalha com atenção aos detalhes, transparência nas negociações e um atendimento personalizado para encontrar o imóvel ideal para cada etapa da sua vida.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm border border-slate-200">
                  Atendimento personalizado
                </span>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm border border-slate-200">
                  Imóveis selecionados
                </span>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm border border-slate-200">
                  Negócios seguros
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <HomeIcon className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Experiência completa</h3>
                <p className="text-sm text-slate-600">Ajudamos você desde a escolha até a finalização da negociação com clareza e praticidade.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Transparência total</h3>
                <p className="text-sm text-slate-600">Informações claras, honestidade nas condições e acompanhamento próximo em cada etapa.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Properties Section ── */}
      <section id="imoveis" className="py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Nossos Imóveis</h2>
              <p className="text-slate-500 mt-2">Clique no nome de qualquer imóvel para ver detalhes completos.</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0 overflow-x-auto pb-2">
              {["todos", "casa", "apartamento", "terreno"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition ${
                    selectedType === type
                      ? "bg-blue-700 text-white shadow-md shadow-blue-700/20"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.code}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Card image header — clickable to open detail */}
                  <button
                    onClick={() => handleOpenDetail(property)}
                    className="w-full text-left"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                      <div className="absolute top-3 left-3 bg-white/95 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
                        {property.tag}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        Ref: {property.code}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          Ver Detalhes
                        </span>
                      </div>
                    </div>
                  </button>

                  <div className="p-5">
                    <span className="text-xs font-bold text-blue-700 tracking-wider uppercase">{property.type}</span>
                    {/* Title is clickable */}
                    <button
                      onClick={() => handleOpenDetail(property)}
                      className="block w-full text-left mt-1"
                    >
                      <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-blue-700 transition hover:underline">
                        {property.title}
                      </h3>
                    </button>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex gap-4 text-xs font-semibold text-slate-600 mt-4 border-t border-slate-100 pt-3">
                      <span>Área: {property.area}</span>
                      {property.beds > 0 && <span>Quartos: {property.beds}</span>}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100/50 mt-auto">
                  <div className="flex items-center justify-between my-4">
                    <div className="text-xs text-slate-400">Valor</div>
                    <div className="text-xl font-extrabold text-blue-700">{property.price}</div>
                  </div>
                  <Button
                    onClick={() => handleOpenInterest(property.code, property.type)}
                    className="w-full bg-slate-900 hover:bg-blue-700 text-white rounded-xl py-2.5 font-medium transition"
                  >
                    Tenho Interesse
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contato" className="bg-slate-900 text-slate-400 py-12 mt-auto border-t border-slate-800">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-700 text-white rounded-lg flex items-center justify-center font-bold text-lg">M</div>
                <span className="text-lg font-bold text-white">Morar Bem</span>
              </div>
              <p className="text-sm">Encontrando o espaço perfeito para você desde 2026. Transparência, inovação e modernidade no mercado imobiliário.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Acesso Rápido</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#imoveis" className="hover:text-white transition">Vitrine de Imóveis</a></li>
                <li><a href="#contato" className="hover:text-white transition">Contate um Corretor</a></li>
                <li><button onClick={() => handleOpenInterest()} className="hover:text-white transition text-left">Tenho Interesse Geral</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <p className="text-sm mb-2">Av. Paulista, 1000 - São Paulo, SP</p>
              <p className="text-sm">Fone: (11) 4002-8922</p>
              <p className="text-sm">Email: {CONTACT_EMAIL}</p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-xs">
            &copy; 2026 Imobiliária Morar Bem. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════════════
          DIALOG: Admin Login
      ════════════════════════════════════════════════════════════════════════ */}
      <Dialog open={isAdminLoginOpen} onOpenChange={setIsAdminLoginOpen}>
        <DialogContent className="sm:max-w-[420px] p-8 rounded-2xl bg-white border border-slate-100 shadow-2xl">
          <DialogHeader className="mb-6 text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-700" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Área Administrativa
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm mt-1">
              Acesso restrito. Insira suas credenciais para continuar.
            </DialogDescription>
          </DialogHeader>

          {adminLoginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2 text-sm mb-4">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{adminLoginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-user" className="text-slate-700 font-semibold text-sm">
                Usuário
              </Label>
              <Input
                id="admin-user"
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Digite seu usuário"
                className="rounded-xl border-slate-200 h-11"
                autoComplete="username"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-pass" className="text-slate-700 font-semibold text-sm">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="admin-pass"
                  type={showAdminPassword ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="rounded-xl border-slate-200 h-11 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                >
                  {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAdminLoginOpen(false)}
                className="flex-1 rounded-xl h-11 border-slate-200 hover:bg-slate-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-xl h-11 bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow-lg shadow-blue-700/20 gap-2"
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════════
          SLIDING PANEL: Admin Dashboard
      ════════════════════════════════════════════════════════════════════════ */}
      {isAdminPanelOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsAdminPanelOpen(false)}
          />
          {/* Panel */}
          <div className="relative ml-auto w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full overflow-hidden">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-lg leading-tight">Painel Administrativo</h2>
                  <p className="text-slate-400 text-xs">Olá, {ADMIN_USERNAME} · Interesses recebidos</p>
                </div>
              </div>
              <button
                onClick={() => setIsAdminPanelOpen(false)}
                className="text-slate-400 hover:text-white transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 divide-x bg-slate-50 border-b">
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-extrabold text-blue-700">{leads.length}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Total de Contatos</div>
              </div>
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-extrabold text-emerald-600">
                  {leads.filter((l) => {
                    const d = new Date(l.createdAt);
                    return d.toDateString() === new Date().toDateString();
                  }).length}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Hoje</div>
              </div>
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-extrabold text-slate-700">
                  {new Set(leads.map((l) => l.codigoImovel)).size}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Imóveis de Interesse</div>
              </div>
            </div>

            {/* Leads list */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {leads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <Users className="w-12 h-12 text-slate-200 mb-3" />
                  <h3 className="font-semibold text-slate-600">Nenhum contato registrado</h3>
                  <p className="text-slate-400 text-sm mt-1">Os interesses enviados pelo site aparecerão aqui.</p>
                </div>
              ) : (
                [...leads].reverse().map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                          <span className="text-blue-700 font-bold text-sm">
                            {lead.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{lead.nome}</p>
                          <p className="text-slate-500 text-xs flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {lead.telefone}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="text-slate-300 hover:text-red-500 transition p-1 shrink-0"
                        title="Remover contato"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-50 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block">Imóvel</span>
                        <span className="font-semibold text-slate-800">{lead.codigoImovel}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">E-mail</span>
                        <span className="font-semibold text-slate-800 break-all">{lead.email}</span>
                      </div>
                      {lead.tipoImovel && (
                        <div>
                          <span className="text-slate-400 block">Tipo</span>
                          <span className="font-semibold text-slate-800">{lead.tipoImovel}</span>
                        </div>
                      )}
                      {lead.faixaInteresse && (
                        <div className="col-span-2">
                          <span className="text-slate-400 block">Faixa de Interesse</span>
                          <span className="font-semibold text-blue-700">{lead.faixaInteresse}</span>
                        </div>
                      )}
                      <div className="col-span-2 mt-1">
                        <span className="text-slate-400 block">Recebido em</span>
                        <span className="text-slate-600">{formatDate(lead.createdAt)}</span>
                      </div>
                    </div>

                    {/* Quick contact actions for admin */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={`https://wa.me/55${lead.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá ${lead.nome}! Aqui é da Imobiliária Morar Bem. Recebemos seu interesse no imóvel ${lead.codigoImovel}. Como posso ajudar?`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                      <a
                        href={`tel:${lead.telefone.replace(/\D/g, "")}`}
                        className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition"
                      >
                        <Phone className="w-3.5 h-3.5" /> Ligar
                      </a>
                      <a
                        href={`mailto:${lead.email}?subject=${encodeURIComponent(`Resposta sobre o imóvel ${lead.codigoImovel}`)}&body=${encodeURIComponent(`Olá ${lead.nome},\n\nObrigado pelo seu interesse no imóvel ${lead.codigoImovel}.\n\nEm breve retornaremos com mais informações.\n\nAtenciosamente,\nImobiliária Morar Bem`)}`}
                        className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded-lg transition"
                      >
                        <Mail className="w-3.5 h-3.5" /> Enviar e-mail
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Panel Footer */}
            {leads.length > 0 && (
              <div className="border-t px-6 py-4 bg-white flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClearAllLeads}
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Limpar Tudo
                </Button>
                <Button
                  onClick={() => setIsAdminPanelOpen(false)}
                  className="flex-1 bg-slate-900 hover:bg-blue-700 text-white rounded-xl transition"
                >
                  Fechar Painel
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          DIALOG: Property Detail Modal
      ════════════════════════════════════════════════════════════════════════ */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[620px] p-0 rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-2xl">
          {selectedProperty && (
            <>
              {/* Hero image area */}
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <img
                  src={selectedProperty.images[currentImageIndex]}
                  alt={`${selectedProperty.title} ${currentImageIndex + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  {selectedProperty.tag}
                </div>
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setIsDetailOpen(false)}
                    className="bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {selectedProperty.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      Ref: {selectedProperty.code}
                    </span>
                    {selectedProperty.images.length > 1 && (
                      <div className="flex items-center gap-1.5">
                        {selectedProperty.images.map((_, index) => (
                          <span
                            key={index}
                            className={`h-2.5 w-2.5 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/45"}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-2xl font-extrabold text-white drop-shadow-lg">
                    {selectedProperty.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-1 text-xs font-bold text-blue-700 tracking-wider uppercase">
                  {selectedProperty.type}
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                  {selectedProperty.title}
                </h2>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  {selectedProperty.location}
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 rounded-2xl p-4 mb-4">
                  <div className="text-center">
                    <Maximize className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="font-bold text-slate-800 text-sm">{selectedProperty.area}</div>
                    <div className="text-xs text-slate-400">Área Total</div>
                  </div>
                  {selectedProperty.beds > 0 && (
                    <div className="text-center">
                      <BedDouble className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <div className="font-bold text-slate-800 text-sm">{selectedProperty.beds}</div>
                      <div className="text-xs text-slate-400">Quartos</div>
                    </div>
                  )}
                  {selectedProperty.baths > 0 && (
                    <div className="text-center">
                      <Bath className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <div className="font-bold text-slate-800 text-sm">{selectedProperty.baths}</div>
                      <div className="text-xs text-slate-400">Banheiros</div>
                    </div>
                  )}
                  {selectedProperty.cars > 0 && (
                    <div className="text-center">
                      <Car className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <div className="font-bold text-slate-800 text-sm">{selectedProperty.cars}</div>
                      <div className="text-xs text-slate-400">Vagas</div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {selectedProperty.description}
                </p>

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Entre em contato pelo imóvel
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleWhatsApp(selectedProperty)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition group"
                    >
                      <MessageSquare className="w-5 h-5 group-hover:scale-110 transition" />
                      <span className="text-xs font-semibold">WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleEmail(selectedProperty)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition group"
                    >
                      <Mail className="w-5 h-5 group-hover:scale-110 transition" />
                      <span className="text-xs font-semibold">E-mail</span>
                    </button>
                    <button
                      onClick={() => handleSMS(selectedProperty)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 transition group"
                    >
                      <Phone className="w-5 h-5 group-hover:scale-110 transition" />
                      <span className="text-xs font-semibold">SMS</span>
                    </button>
                  </div>

                  {/* Main CTA */}
                  <Button
                    onClick={() => handleOpenInterest(selectedProperty.code, selectedProperty.type)}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-xl h-12 font-bold text-base shadow-lg shadow-blue-700/20 transition active:scale-[0.98] mt-1"
                  >
                    Registrar Interesse no Imóvel
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════════
          DIALOG: Interest Form
      ════════════════════════════════════════════════════════════════════════ */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-6 rounded-2xl bg-white border border-slate-100 shadow-2xl">
          {!isSuccess ? (
            <>
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <HomeIcon className="w-6 h-6 text-blue-700" />
                  Tenho Interesse
                </DialogTitle>
                <DialogDescription className="text-slate-500 text-sm">
                  Deixe seus dados de contato e o imóvel do seu interesse. Retornaremos em instantes.
                </DialogDescription>
              </DialogHeader>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2 text-sm mb-4">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nome" className="text-slate-700 font-semibold text-sm flex items-center">
                    Nome <span className="text-red-500 ml-1 font-bold">*</span>
                  </Label>
                  <Input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome completo" className="rounded-xl border-slate-200 h-11" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="telefone" className="text-slate-700 font-semibold text-sm flex items-center">
                    Telefone <span className="text-red-500 ml-1 font-bold">*</span>
                  </Label>
                  <Input id="telefone" type="tel" value={telefone} onChange={handlePhoneChange} placeholder="(11) 99999-9999" className="rounded-xl border-slate-200 h-11" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-slate-700 font-semibold text-sm flex items-center">
                    E-mail <span className="text-red-500 ml-1 font-bold">*</span>
                  </Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="rounded-xl border-slate-200 h-11" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="codigoImovel" className="text-slate-700 font-semibold text-sm flex items-center">
                    Código do Imóvel <span className="text-red-500 ml-1 font-bold">*</span>
                  </Label>
                  <Input id="codigoImovel" type="text" value={codigoImovel} onChange={(e) => setCodigoImovel(e.target.value)} placeholder="Ex: C-101" className="rounded-xl border-slate-200 h-11" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-semibold text-sm flex items-center gap-1">
                    Tipo de Imóvel <span className="text-slate-400 font-normal text-xs">(Opcional)</span>
                  </Label>
                  <Select value={tipoImovel} onValueChange={setTipoImovel}>
                    <SelectTrigger className="rounded-xl border-slate-200 h-11">
                      <SelectValue placeholder="Selecione o tipo de imóvel" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-100 rounded-xl shadow-lg">
                      <SelectItem value="Casa">Casa</SelectItem>
                      <SelectItem value="Apartamento">Apartamento</SelectItem>
                      <SelectItem value="Terreno">Terreno</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-semibold text-sm flex items-center gap-1">
                    Faixa de Interesse <span className="text-slate-400 font-normal text-xs">(Opcional)</span>
                  </Label>
                  <Select value={faixaInteresse} onValueChange={setFaixaInteresse}>
                    <SelectTrigger className="rounded-xl border-slate-200 h-11">
                      <SelectValue placeholder="Selecione sua faixa de interesse" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-100 rounded-xl shadow-lg">
                      <SelectItem value="Até R$ 500.000">Até R$ 500.000</SelectItem>
                      <SelectItem value="R$ 500.000 a R$ 1.000.000">R$ 500.000 a R$ 1.000.000</SelectItem>
                      <SelectItem value="R$ 1.000.000 a R$ 2.000.000">R$ 1.000.000 a R$ 2.000.000</SelectItem>
                      <SelectItem value="Acima de R$ 2.000.000">Acima de R$ 2.000.000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl h-11 border-slate-200 hover:bg-slate-50">
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl h-11 bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow-lg shadow-blue-700/20 active:scale-95 transition">
                    {isSubmitting ? "Enviando..." : "Salvar Envio"}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="py-8 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Enviado com Sucesso!</h2>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">
                Recebemos o seu cadastro. Em breve, um dos nossos corretores entrará em contato para dar prosseguimento ao seu interesse.
              </p>
              <Button onClick={() => setIsModalOpen(false)} className="w-full bg-slate-900 hover:bg-blue-700 text-white rounded-xl h-11 transition">
                Concluir
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
