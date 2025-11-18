"use client";

import { useState, useEffect } from "react";
import { Search, BookOpen, Calculator, Beaker, Globe, Languages, Sparkles, Clock, TrendingUp, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SearchHistory = {
  id: string;
  query: string;
  category: string;
  timestamp: Date;
};

type Category = {
  name: string;
  icon: React.ReactNode;
  color: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [answer, setAnswer] = useState("");
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [searchCount, setSearchCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedCount = localStorage.getItem("searchCount");
    const savedPremium = localStorage.getItem("isPremium");
    
    if (savedCount) setSearchCount(parseInt(savedCount));
    if (savedPremium === "true") setIsPremium(true);
  }, []);

  const categories: Category[] = [
    { name: "Matemática", icon: <Calculator className="w-5 h-5" />, color: "from-blue-500 to-cyan-500" },
    { name: "Ciências", icon: <Beaker className="w-5 h-5" />, color: "from-green-500 to-emerald-500" },
    { name: "História", icon: <Globe className="w-5 h-5" />, color: "from-orange-500 to-red-500" },
    { name: "Línguas", icon: <Languages className="w-5 h-5" />, color: "from-purple-500 to-pink-500" },
    { name: "Literatura", icon: <BookOpen className="w-5 h-5" />, color: "from-indigo-500 to-blue-500" },
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;

    // Verificar limite de pesquisas gratuitas
    if (!isPremium && searchCount >= 6) {
      setShowPaywall(true);
      return;
    }

    setIsSearching(true);
    setAnswer("");

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setAnswer(data.answer);

      // Incrementar contador
      const newCount = searchCount + 1;
      setSearchCount(newCount);
      localStorage.setItem("searchCount", newCount.toString());

      // Adicionar ao histórico
      const newSearch: SearchHistory = {
        id: Date.now().toString(),
        query,
        category: "Geral",
        timestamp: new Date(),
      };
      setSearchHistory([newSearch, ...searchHistory.slice(0, 4)]);
    } catch (error) {
      setAnswer("Desculpe, ocorreu um erro ao buscar a resposta. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleUpgrade = () => {
    // Simular compra (em produção, integrar com gateway de pagamento)
    setIsPremium(true);
    localStorage.setItem("isPremium", "true");
    setShowPaywall(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const remainingSearches = Math.max(0, 6 - searchCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">EduSearch</h1>
          </div>
          <div className="flex items-center gap-3">
            {!isPremium ? (
              <>
                <Badge variant="outline" className="text-gray-300 border-gray-300/30">
                  {remainingSearches} pesquisas restantes
                </Badge>
                <Button
                  onClick={() => setShowPaywall(true)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              </>
            ) : (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                <Crown className="w-4 h-4 mr-1" />
                Premium
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Encontre Respostas
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Para Qualquer Matéria
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Pesquise sobre matemática, ciências, história e muito mais. Respostas precisas e detalhadas em segundos.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <Card className="p-2 bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Digite sua pergunta sobre qualquer matéria..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 h-14 text-lg bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 transition-all"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !query.trim()}
                className="h-14 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Buscando...
                  </div>
                ) : (
                  "Pesquisar"
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Categories */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Categorias Populares</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setQuery(`Explique sobre ${category.name}`)}
                className="group"
              >
                <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all hover:scale-105 hover:shadow-xl">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <p className="text-sm font-medium text-white text-center">{category.name}</p>
                </Card>
              </button>
            ))}
          </div>
        </div>

        {/* Answer Section */}
        {answer && (
          <div className="max-w-4xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Resposta</h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{answer}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Pesquisas Recentes</h3>
            </div>
            <div className="space-y-2">
              {searchHistory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setQuery(item.query)}
                  className="w-full text-left"
                >
                  <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium">{item.query}</p>
                      <Badge variant="outline" className="text-purple-300 border-purple-300/30">
                        {item.category}
                      </Badge>
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {!answer && searchHistory.length === 0 && (
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">IA Avançada</h3>
              <p className="text-gray-300">Respostas precisas e detalhadas usando inteligência artificial de última geração.</p>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Todas as Matérias</h3>
              <p className="text-gray-300">Matemática, ciências, história, línguas e muito mais em um só lugar.</p>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Respostas Rápidas</h3>
              <p className="text-gray-300">Obtenha respostas completas e precisas em questão de segundos.</p>
            </Card>
          </div>
        )}
      </main>

      {/* Paywall Dialog */}
      <Dialog open={showPaywall} onOpenChange={setShowPaywall}>
        <DialogContent className="bg-gradient-to-br from-slate-900 to-purple-900 border-white/20 text-white max-w-md">
          <DialogHeader>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl text-center">
              Limite de Pesquisas Atingido
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-center">
              Você usou suas 6 pesquisas gratuitas. Faça upgrade para continuar aprendendo sem limites!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Plano Premium */}
            <Card className="p-6 bg-white/10 backdrop-blur-md border-2 border-yellow-500/50 shadow-2xl">
              <div className="text-center mb-4">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 mb-2">
                  Melhor Oferta
                </Badge>
                <h3 className="text-3xl font-bold text-white mb-2">Premium</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-white">R$ 5,99</span>
                  <span className="text-gray-300">pagamento único</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-200">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span>Pesquisas ilimitadas para sempre</span>
                </div>
                <div className="flex items-center gap-3 text-gray-200">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span>Respostas mais detalhadas</span>
                </div>
                <div className="flex items-center gap-3 text-gray-200">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span>Acesso a todas as matérias</span>
                </div>
                <div className="flex items-center gap-3 text-gray-200">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span>Sem anúncios</span>
                </div>
              </div>

              <Button
                onClick={handleUpgrade}
                className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Crown className="w-5 h-5 mr-2" />
                Fazer Upgrade Agora
              </Button>
            </Card>

            <p className="text-center text-sm text-gray-400">
              Pagamento único. Acesso vitalício. Sem mensalidades.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
