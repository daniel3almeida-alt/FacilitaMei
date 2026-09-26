'use client';

import React, { useState } from 'react';
import { ScreenView } from '@/types';
import { BrandLogo } from '../BrandLogo';
import {
  Layers,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Building2,
  User,
  Package,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Compass,
  ArrowLeftRight,
  Maximize2
} from 'lucide-react';

interface ScreenFlowGalleryProps {
  onNavigate: (screen: ScreenView) => void;
  onOpenNewTransaction: () => void;
}

export function ScreenFlowGallery({
  onNavigate,
  onOpenNewTransaction,
}: ScreenFlowGalleryProps) {
  const [selectedScreenId, setSelectedScreenId] = useState<string>('pj');

  const screens = [
    {
      id: 'pj',
      number: 'Tela 01',
      title: 'Visão Geral da Empresa (PJ)',
      badge: 'Módulo Jurídico MEI',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Painel executivo de controle do CNPJ: Faturamento bruto (R$ 14.850,00), Custos operacionais, Lucro Líquido Real, Alerta de DAS a vencer, Alerta de estoque crítico e Extrato contábil.',
      highlights: [
        'KPIs de Receita, Custos e Lucro com indicador de repasse para PF',
        'Alerta da Guia DAS-SIMEI com geração direta de Pix',
        'Aviso inteligente de 2 itens atingindo estoque de segurança',
        'Gráficos de tendência semestral e distribuição de custos por categoria'
      ],
      action: () => onNavigate('pj'),
      actionLabel: 'Abrir Visão Empresa (PJ)',
      hotkey: 'Pressione [1]'
    },
    {
      id: 'pf',
      number: 'Tela 02',
      title: 'Finanças Pessoais (Pessoa Física)',
      badge: 'Módulo CPF & Orçamento',
      badgeColor: 'bg-blue-100 text-blue-800',
      description: 'Gestão da vida financeira pessoal do empreendedor: Salário (Pró-labore com INSS garantido), Distribuição de Lucros 100% Isenta perante a Receita Federal, Reserva de emergência e Teto de gastos.',
      highlights: [
        'Comprovante de sincronização da PJ via Banco Inter',
        'Separação legal entre Pró-labore oficial e Lucros Isentos',
        'Reserva de emergência com cálculo de cobertura mensal',
        'Divisão percentual de custos de vida (Moradia, Alimentação, Saúde)'
      ],
      action: () => onNavigate('pf'),
      actionLabel: 'Abrir Finanças Pessoais (PF)',
      hotkey: 'Pressione [2]'
    },
    {
      id: 'modal',
      number: 'Tela 03',
      title: 'Modal de Sincronização Inteligente PJ ➔ PF',
      badge: 'Diferencial Exclusivo',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      description: 'O recurso central do FacilitaMei: Ao lançar uma retirada de Pró-labore ou Lucro na PJ, o sistema debita automaticamente a conta da Empresa e alimenta a renda pessoal na Visão PF sem retrabalho contábil.',
      highlights: [
        'Rateio contábil automatizado entre Pessoa Jurídica e Física',
        'Fluxo em tempo real: PJ: -R$ 3.000,00 ➔ PF: +R$ 3.000,00',
        'Contas de débito sincronizadas (Banco Inter PJ / PF)',
        'Classificação tributária compatível com a Receita Federal'
      ],
      action: () => onOpenNewTransaction(),
      actionLabel: 'Abrir Modal de Sincronização',
      hotkey: 'Pressione [3]'
    },
    {
      id: 'os',
      number: 'Tela 04',
      title: 'Ordem de Serviço #1196 (Assistência PJ)',
      badge: 'Manutenção & Baixa Caixa PJ',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Gestão completa de assistência técnica: Identificação do cliente, diagnóstico técnico, peças e mão de obra, checklist rápido do aparelho e módulo financeiro de quitação com baixa direta no Caixa da Empresa PJ.',
      highlights: [
        'Identificação do cliente, equipamento (Samsung S22 Ultra) e diagnóstico',
        'Lançamento de Peças e Mão de Obra com busca no estoque PJ',
        'Check-list rápido do aparelho (ligando, touch, conector de carga)',
        'Quitação com PIX, Débito, Dinheiro ou Carnê e envio por WhatsApp'
      ],
      action: () => onNavigate('os'),
      actionLabel: 'Abrir Ordem de Serviço',
      hotkey: 'Pressione [4]'
    },
    {
      id: 'inventory',
      number: 'Tela 05',
      title: 'Controle de Estoque & Mercadorias PJ',
      badge: 'Gestão de Insumos',
      badgeColor: 'bg-amber-100 text-amber-800',
      description: 'Catálogo de 34 produtos com rastreio de estoque mínimo de segurança. Destaque para os itens críticos (Cabo USB-C e SSD Kingston) e reposição rápida com cálculo de margem de lucro.',
      highlights: [
        'Alerta visual para itens abaixo da margem mínima',
        'Cálculo de margem e precificação de venda',
        'Modal de reposição rápida de estoque com 1 clique'
      ],
      action: () => onNavigate('inventory'),
      actionLabel: 'Abrir Estoque PJ',
      hotkey: 'Pressione [5]'
    },
    {
      id: 'das',
      number: 'Tela 06',
      title: 'Guia DAS-SIMEI & Teto Anual R$ 81k',
      badge: 'Conformidade Fiscal',
      badgeColor: 'bg-purple-100 text-purple-800',
      description: 'Acompanhamento do limite legal de faturamento do MEI (R$ 81.000,00/ano, atualmente em 66.9%) e emissão da guia unificada mensal com código Pix copia-e-cola.',
      highlights: [
        'Histórico dos 12 meses do exercício fiscal 2024',
        'Geração de QR Code e Pix Copia-e-Cola para pagamento',
        'Projeção de segurança contra desenquadramento para ME'
      ],
      action: () => onNavigate('das'),
      actionLabel: 'Abrir Relatórios & DAS',
      hotkey: 'Pressione [6]'
    }
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Arquitetura de Navegação Fluida
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-300 text-xs">FacilitaMei Gestão Integrada PJ & PF</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Links Diretos & Mapa Completo de Telas
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Navegue instantaneamente por todas as telas do aplicativo com links diretos, atalhos de teclado e transições fluidas. Experimente a sincronização bidirecional entre a conta da sua Empresa (MEI) e as Finanças Pessoais (PF).
          </p>

          {/* Quick Shortcuts Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Atalhos do Teclado:</span>
            <span className="px-2 py-1 bg-white/10 rounded-lg text-emerald-300 font-mono font-bold">[1] PJ</span>
            <span className="px-2 py-1 bg-white/10 rounded-lg text-blue-300 font-mono font-bold">[2] PF</span>
            <span className="px-2 py-1 bg-white/10 rounded-lg text-teal-300 font-mono font-bold">[3] Modal Sync</span>
            <span className="px-2 py-1 bg-white/10 rounded-lg text-amber-300 font-mono font-bold">[4] Estoque</span>
            <span className="px-2 py-1 bg-white/10 rounded-lg text-purple-300 font-mono font-bold">[5] DAS</span>
          </div>
        </div>

        {/* Decorative background branding */}
        <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none hidden md:block">
          <BrandLogo size="lg" theme="dark" showSubtitle={false} />
        </div>
      </div>

      {/* Screen Cards Grid with Direct Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {screens.map(screen => (
          <div
            key={screen.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 font-mono tracking-wider">
                  {screen.number}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${screen.badgeColor}`}>
                  {screen.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {screen.title}
              </h3>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {screen.description}
              </p>

              {/* Highlights */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Destaques da Tela:
                </span>
                {screen.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Action Link Button */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono font-semibold">
                {screen.hotkey}
              </span>

              <button
                type="button"
                onClick={screen.action}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer group-hover:bg-emerald-600"
              >
                <span>{screen.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Synchronized Flow Interactive Demo Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Como Funciona a Sincronização Inteligente Entre Telas?
            </h2>
            <p className="text-xs text-slate-500">
              Demonstração do fluxo contábil de ponta a ponta sem retrabalho
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">1</span>
              <span className="text-xs font-bold text-slate-900">Na Empresa (PJ)</span>
            </div>
            <p className="text-xs text-slate-600">
              Você clica em <strong>&quot;Pagar Conta / Nova Transação&quot;</strong>, seleciona a categoria <em>&quot;O seu Salário (Pró-labore)&quot;</em> e define o valor (ex: R$ 3.000,00).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">2</span>
              <span className="text-xs font-bold text-indigo-950">A Mágica do FacilitaMei</span>
            </div>
            <p className="text-xs text-indigo-900/80">
              A caixa de seleção <strong>&quot;Lançar automaticamente como Receita na Visão Pessoal (PF)&quot;</strong> conecta as duas pontas contábeis de forma legalmente auditável.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">3</span>
              <span className="text-xs font-bold text-blue-950">Na Visão Pessoal (PF)</span>
            </div>
            <p className="text-xs text-blue-900/80">
              O valor entra como crédito líquido sem você digitar duas vezes, gerando o comprovante com a separação exigida pela Receita Federal.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={onOpenNewTransaction}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Testar Agora: Lançar Nova Transação Sincronizada</span>
          </button>
        </div>
      </div>

    </div>
  );
}
