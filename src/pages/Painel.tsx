import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye, EyeOff, ChevronRight, HelpCircle, CheckCircle,
  ArrowUpDown, DollarSign, ShoppingBag,
  Grid3X3, BarChart3, Landmark, CalendarDays, Smartphone, CreditCard, RefreshCw
} from "lucide-react";

const Painel = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [user, setUser] = useState<{ id: number; email: string; tipo_conta: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("nu_user") || sessionStorage.getItem("nu_user");
    if (!saved) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(saved));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("nu_user");
    sessionStorage.removeItem("nu_user");
    navigate("/login");
  };

  const quickActions = [
    { icon: Grid3X3, label: "Área Pix e\nTransferir" },
    { icon: BarChart3, label: "Pagar" },
    { icon: Landmark, label: "Pegar\nemprestado", badge: "FGTS" },
    { icon: CalendarDays, label: "Ajuda\nfinanceira", badge: "Descontos" },
    { icon: Smartphone, label: "Recarga\ncelular" },
    { icon: CreditCard, label: "Cobrar" },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background font-body pb-28">
      {/* Header roxo */}
      <header className="nu-gradient-bg px-5 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {}}
            className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center"
          >
            <span className="text-primary-foreground text-lg font-heading font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </span>
          </button>
          <div className="flex items-center gap-5">
            <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors" onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? <Eye className="h-6 w-6" /> : <EyeOff className="h-6 w-6" />}
            </button>
            <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <HelpCircle className="h-6 w-6" />
            </button>
            <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <CheckCircle className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Saldo */}
      <section className="px-5 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-body">Saldo em conta</p>
            <p className="text-2xl font-bold text-foreground font-heading mt-1">
              {showBalance ? "R$ 1.677,54" : "••••••"}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </section>

      {/* Quick actions */}
      <section className="px-5 pb-6">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {quickActions.map((action, i) => (
            <button key={i} className="flex flex-col items-center gap-2 min-w-[72px]">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center relative">
                <action.icon className="h-6 w-6 text-foreground" />
                {action.badge && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    {action.badge}
                  </span>
                )}
              </div>
              <span className="text-xs text-foreground text-center leading-tight whitespace-pre-line font-body">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Banner card */}
      <section className="px-5 pb-6">
        <div className="bg-secondary rounded-2xl p-5 flex items-center justify-between">
          <p className="text-sm text-foreground font-body">
            Traga seus dados e <strong>aumente suas chances de crédito.</strong>
          </p>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ml-4">
            <RefreshCw className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="flex justify-center gap-1.5 mt-3">
          <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
          <span className="w-2 h-2 rounded-full bg-muted-foreground" />
          <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
        </div>
      </section>

      <div className="h-px bg-border mx-5" />

      {/* Cartão de crédito */}
      <section className="px-5 py-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground font-heading">Cartão de crédito</h3>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground font-body">Fatura atual</p>
        <p className="text-2xl font-bold text-foreground font-heading mt-2">
          {showBalance ? "R$ 1.570,75" : "••••••"}
        </p>
        <p className="text-xs text-muted-foreground mt-1 font-body">Vencimento em 15 Mar</p>
      </section>

      <div className="h-px bg-border mx-5" />

      {/* Planeje suas contas */}
      <section className="px-5 py-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground font-heading">Planeje suas contas</h3>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground font-body mb-4">
          Acompanhe, pague e programe com a ajuda do Assistente de pagamentos.
        </p>
        <button className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-full font-heading">
          Acessar
        </button>
      </section>

      <div className="h-px bg-border mx-5" />

      {/* Descubra mais */}
      <section className="px-5 py-6">
        <h3 className="text-base font-bold text-foreground font-heading mb-4">Descubra mais</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <div className="min-w-[260px] rounded-2xl border border-border overflow-hidden">
            <div className="h-36 bg-secondary" />
            <div className="p-4">
              <h4 className="font-bold text-foreground font-heading text-sm">Conta para menores de 18</h4>
              <p className="text-xs text-muted-foreground mt-1 font-body">Solicite a conta para seus filhos a partir de 6 anos.</p>
              <button className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-full mt-3 font-heading">
                Começar
              </button>
            </div>
          </div>
          <div className="min-w-[260px] rounded-2xl border border-border overflow-hidden">
            <div className="h-36 bg-secondary" />
            <div className="p-4">
              <h4 className="font-bold text-foreground font-heading text-sm">Seguro Vida</h4>
              <p className="text-xs text-muted-foreground mt-1 font-body">Cuide de quem você ama de um jeito simples pro seu bolso.</p>
              <button className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-full mt-3 font-heading">
                Conhecer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Logout */}
      <section className="px-5 pb-8">
        <button onClick={handleLogout} className="text-sm text-destructive font-medium hover:underline font-body">
          Sair da conta
        </button>
      </section>

      {/* Floating bottom nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 bg-background/95 backdrop-blur-lg border border-border rounded-full px-6 py-3 shadow-lg">
          <button className="flex flex-col items-center gap-1 px-4 py-1 rounded-full bg-secondary">
            <ArrowUpDown className="h-5 w-5 text-foreground" />
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-1">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-1">
            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Painel;
