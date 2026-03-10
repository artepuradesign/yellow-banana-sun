import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LogOut, Plus, FileText, Users, TrendingUp, TrendingDown, DollarSign,
} from "lucide-react";
import { toast } from "sonner";

interface Transacao {
  id: number;
  data: string;
  tipo: "entrada" | "saida";
  descricao: string;
  categoria: string;
  valor: number;
  beneficiario: string;
  documento: string;
  banco: string;
  agencia: string;
  conta: string;
}

const mockTransacoes: Transacao[] = [
  {
    id: 1, data: "2025-03-10", tipo: "entrada", descricao: "Transferência recebida pelo Pix",
    categoria: "PIX", valor: 7800, beneficiario: "LUIS R F CARVALHO SILVA",
    documento: "•••.815.893-••", banco: "BCO DO BRASIL S.A.", agencia: "3507", conta: "74113-2",
  },
  {
    id: 2, data: "2025-03-10", tipo: "saida", descricao: "Transferência enviada pelo Pix",
    categoria: "PIX", valor: 1068, beneficiario: "THIAGO PEDROSA LIMA",
    documento: "•••.460.413-••", banco: "BCO SANTANDER", agencia: "1836", conta: "1001518-6",
  },
  {
    id: 3, data: "2025-03-11", tipo: "entrada", descricao: "Transferência recebida pelo Pix",
    categoria: "PIX", valor: 10000, beneficiario: "MONTE C C LTDA",
    documento: "14.190.481/0001-50", banco: "BCO DO BRASIL S.A.", agencia: "4249", conta: "16248-5",
  },
  {
    id: 4, data: "2025-03-13", tipo: "saida", descricao: "Transferência enviada pelo Pix",
    categoria: "PIX", valor: 15000, beneficiario: "LIMA CONSTRUCOES",
    documento: "34.349.810/0001-70", banco: "BCO SANTANDER", agencia: "2410", conta: "13000010-4",
  },
];

const Admin = () => {
  const navigate = useNavigate();
  const [transacoes, setTransacoes] = useState<Transacao[]>(mockTransacoes);
  const [novaTransacao, setNovaTransacao] = useState({
    data: "", tipo: "entrada" as "entrada" | "saida", descricao: "Transferência recebida pelo Pix",
    categoria: "PIX", valor: "", beneficiario: "", documento: "", banco: "", agencia: "", conta: "",
  });

  const saldoInicial = 20120.28;
  const totalEntradas = transacoes.filter(t => t.tipo === "entrada").reduce((s, t) => s + t.valor, 0);
  const totalSaidas = transacoes.filter(t => t.tipo === "saida").reduce((s, t) => s + t.valor, 0);
  const saldoFinal = saldoInicial + totalEntradas - totalSaidas;

  const handleAddTransacao = (e: React.FormEvent) => {
    e.preventDefault();
    const nova: Transacao = {
      id: Date.now(),
      ...novaTransacao,
      valor: parseFloat(novaTransacao.valor),
    };
    setTransacoes(prev => [...prev, nova]);
    setNovaTransacao({
      data: "", tipo: "entrada", descricao: "Transferência recebida pelo Pix",
      categoria: "PIX", valor: "", beneficiario: "", documento: "", banco: "", agencia: "", conta: "",
    });
    toast.success("Lançamento adicionado com sucesso!");
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Group transactions by date for statement
  const transacoesPorDia = transacoes.reduce((acc, t) => {
    if (!acc[t.data]) acc[t.data] = [];
    acc[t.data].push(t);
    return acc;
  }, {} as Record<string, Transacao[]>);

  const datasOrdenadas = Object.keys(transacoesPorDia).sort();

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Admin Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-extrabold nu-text-gradient">NU</h1>
            <span className="text-sm text-muted-foreground font-medium bg-secondary px-3 py-1 rounded-full">Administração</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Saldo Inicial", value: saldoInicial, icon: DollarSign, color: "text-muted-foreground" },
            { label: "Total Entradas", value: totalEntradas, icon: TrendingUp, color: "text-nu-green", prefix: "+" },
            { label: "Total Saídas", value: totalSaidas, icon: TrendingDown, color: "text-destructive", prefix: "-" },
            { label: "Saldo Final", value: saldoFinal, icon: DollarSign, color: "text-primary" },
          ].map((c, i) => (
            <Card key={i} className="nu-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <c.icon className={`h-5 w-5 ${c.color}`} />
                  <span className="text-sm text-muted-foreground">{c.label}</span>
                </div>
                <p className={`text-2xl font-bold ${c.color}`}>
                  {c.prefix || ""}R$ {formatCurrency(c.value)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="lancamentos">
          <TabsList className="mb-6">
            <TabsTrigger value="lancamentos" className="flex gap-2"><Plus className="h-4 w-4" /> Lançamentos</TabsTrigger>
            <TabsTrigger value="extrato" className="flex gap-2"><FileText className="h-4 w-4" /> Extrato</TabsTrigger>
            <TabsTrigger value="clientes" className="flex gap-2"><Users className="h-4 w-4" /> Clientes</TabsTrigger>
          </TabsList>

          {/* Lançamentos */}
          <TabsContent value="lancamentos">
            <Card className="nu-card border-0 mb-6">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Novo Lançamento</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTransacao} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Data *</Label>
                      <Input type="date" required value={novaTransacao.data} onChange={e => setNovaTransacao(p => ({ ...p, data: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Tipo *</Label>
                      <Select value={novaTransacao.tipo} onValueChange={v => setNovaTransacao(p => ({ ...p, tipo: v as "entrada" | "saida" }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entrada">Entrada</SelectItem>
                          <SelectItem value="saida">Saída</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Valor (R$) *</Label>
                      <Input type="number" step="0.01" required value={novaTransacao.valor} onChange={e => setNovaTransacao(p => ({ ...p, valor: e.target.value }))} placeholder="0,00" />
                    </div>
                    <div>
                      <Label>Categoria</Label>
                      <Select value={novaTransacao.categoria} onValueChange={v => setNovaTransacao(p => ({ ...p, categoria: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PIX">PIX</SelectItem>
                          <SelectItem value="TED">TED</SelectItem>
                          <SelectItem value="BOLETO">Boleto</SelectItem>
                          <SelectItem value="ESTORNO">Estorno</SelectItem>
                          <SelectItem value="RENDIMENTO">Rendimento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Descrição</Label>
                      <Input value={novaTransacao.descricao} onChange={e => setNovaTransacao(p => ({ ...p, descricao: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Beneficiário/Pagador *</Label>
                      <Input required value={novaTransacao.beneficiario} onChange={e => setNovaTransacao(p => ({ ...p, beneficiario: e.target.value }))} />
                    </div>
                    <div>
                      <Label>CPF/CNPJ</Label>
                      <Input value={novaTransacao.documento} onChange={e => setNovaTransacao(p => ({ ...p, documento: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Banco</Label>
                      <Input value={novaTransacao.banco} onChange={e => setNovaTransacao(p => ({ ...p, banco: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Agência</Label>
                      <Input value={novaTransacao.agencia} onChange={e => setNovaTransacao(p => ({ ...p, agencia: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Conta</Label>
                      <Input value={novaTransacao.conta} onChange={e => setNovaTransacao(p => ({ ...p, conta: e.target.value }))} />
                    </div>
                  </div>
                  <Button type="submit" variant="hero">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar lançamento
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Transaction list */}
            <Card className="nu-card border-0">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Lançamentos recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Beneficiário</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transacoes.map(t => (
                      <TableRow key={t.id}>
                        <TableCell className="text-sm">{new Date(t.data + "T12:00:00").toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${t.tipo === "entrada" ? "bg-nu-green/10 text-nu-green" : "bg-destructive/10 text-destructive"}`}>
                            {t.tipo === "entrada" ? "Entrada" : "Saída"}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{t.descricao}</TableCell>
                        <TableCell className="text-sm">{t.beneficiario}</TableCell>
                        <TableCell className={`text-right font-medium ${t.tipo === "entrada" ? "text-nu-green" : "text-destructive"}`}>
                          {t.tipo === "entrada" ? "+" : "-"}R$ {formatCurrency(t.valor)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Extrato */}
          <TabsContent value="extrato">
            <Card className="nu-card border-0">
              <CardContent className="pt-6">
                {/* Statement Header - Nubank style */}
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-border">
                  <div>
                    <h2 className="text-3xl font-extrabold nu-text-gradient mb-1">NU</h2>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">TPL CONSTRUCOES LTDA</p>
                    <p><span className="font-semibold text-primary">CNPJ</span> 43.680.807/0001-25 <span className="font-semibold">Agência</span> 0001 <span className="font-semibold">Conta</span> 674432224-5</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                  <h3 className="font-bold text-foreground">09 DE MARÇO DE 2025 a 08 DE MARÇO DE 2026</h3>
                  <span className="text-sm text-muted-foreground">VALORES EM R$</span>
                </div>

                {/* Summary */}
                <div className="grid md:grid-cols-2 gap-8 mb-8 pb-6 border-b border-border">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Saldo final do período</p>
                    <p className="text-3xl font-bold text-foreground">R$ {formatCurrency(saldoFinal)}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-sm text-muted-foreground">Saldo inicial</span><span className="font-medium text-foreground">{formatCurrency(saldoInicial)}</span></div>
                    <div className="flex justify-between"><span className="text-sm text-muted-foreground">Rendimento líquido</span><span className="font-medium text-foreground">+0,00</span></div>
                    <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total de entradas</span><span className="font-medium text-nu-green">+{formatCurrency(totalEntradas)}</span></div>
                    <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total de saídas</span><span className="font-medium text-destructive">-{formatCurrency(totalSaidas)}</span></div>
                    <div className="flex justify-between border-t border-border pt-2"><span className="font-semibold text-foreground">Saldo final do período</span><span className="font-bold text-foreground">{formatCurrency(saldoFinal)}</span></div>
                  </div>
                </div>

                {/* Movimentações */}
                <h3 className="font-bold text-foreground mb-6">Movimentações</h3>

                {datasOrdenadas.map(data => {
                  const trans = transacoesPorDia[data];
                  const entradas = trans.filter(t => t.tipo === "entrada");
                  const saidas = trans.filter(t => t.tipo === "saida");
                  const totalDiaEntradas = entradas.reduce((s, t) => s + t.valor, 0);
                  const totalDiaSaidas = saidas.reduce((s, t) => s + t.valor, 0);

                  const dataFormatada = new Date(data + "T12:00:00").toLocaleDateString("pt-BR", {
                    day: "2-digit", month: "short", year: "numeric",
                  }).toUpperCase().replace(".", "");

                  return (
                    <div key={data} className="mb-6 pb-6 border-b border-border last:border-0">
                      <h4 className="font-bold text-sm text-foreground mb-4">{dataFormatada}</h4>

                      {entradas.length > 0 && (
                        <>
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold text-sm text-foreground">Total de entradas</span>
                            <span className="font-semibold text-sm text-nu-green">+ {formatCurrency(totalDiaEntradas)}</span>
                          </div>
                          {entradas.map(t => (
                            <div key={t.id} className="flex justify-between py-2 pl-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">{t.descricao}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {t.beneficiario} - {t.documento} - {t.banco} Agência: {t.agencia} Conta: {t.conta}
                                </p>
                              </div>
                              <span className="font-medium text-foreground whitespace-nowrap ml-4">{formatCurrency(t.valor)}</span>
                            </div>
                          ))}
                        </>
                      )}

                      {saidas.length > 0 && (
                        <>
                          <div className="flex justify-between mb-2 mt-4">
                            <span className="font-semibold text-sm text-foreground">Total de saídas</span>
                            <span className="font-semibold text-sm text-destructive">- {formatCurrency(totalDiaSaidas)}</span>
                          </div>
                          {saidas.map(t => (
                            <div key={t.id} className="flex justify-between py-2 pl-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">{t.descricao}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {t.beneficiario} - {t.documento} - {t.banco} Agência: {t.agencia} Conta: {t.conta}
                                </p>
                              </div>
                              <span className="font-medium text-foreground whitespace-nowrap ml-4">{formatCurrency(t.valor)}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  );
                })}

                {/* Footer */}
                <div className="text-xs text-muted-foreground mt-8 pt-4 border-t border-border space-y-1">
                  <p>Tem alguma dúvida? Mande uma mensagem para nosso time de atendimento pelo chat do app ou ligue 4020 0185.</p>
                  <p>Extrato gerado dia {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clientes */}
          <TabsContent value="clientes">
            <Card className="nu-card border-0">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Clientes cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nenhum cliente cadastrado ainda. Os clientes aparecerão aqui quando se registrarem pela página de cadastro.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
