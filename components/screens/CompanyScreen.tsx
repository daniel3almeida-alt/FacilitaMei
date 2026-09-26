'use client';

import React, { useState } from 'react';
import { PJTransaction, ScreenView } from '@/types';
import { BrandLogo } from '../BrandLogo';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Package,
  Calendar,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  PlusCircle,
  MinusCircle,
  FileText,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  PieChart,
  LayoutDashboard,
  Receipt,
  Layers,
  Settings,
  HelpCircle,
  Building2,
  ExternalLink,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

interface CompanyScreenProps {
  transactions: PJTransaction[];
  onNavigate: (screen: ScreenView) => void;
  onOpenNewTransaction: () => void;
  onOpenDasModal: () => void;
  isDasPaid: boolean;
}

export function CompanyScreen({
  transactions,
  onNavigate,
  onOpenNewTransaction,
  onOpenDasModal,
  isDasPaid,
}: CompanyScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [timeRange, setTimeRange] = useState<'month' | '30days' | 'year'>('month');

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.subDescription && t.subDescription.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (activeFilter === 'income') return t.type === 'income';
    if (activeFilter === 'expense') return t.type === 'expense';
    return true;
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.value, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.value, 0);

  const netProfit = totalIncome - totalExpense;

  // Chart data for semester trend (May to Oct)
  const semesterData = [
    { month: 'Maio', income: 8400, expense: 4100 },
    { month: 'Junho', income: 9200, expense: 4300 },
    { month: 'Julho', income: 10100, expense: 4600 },
    { month: 'Agosto', income: 11800, expense: 4800 },
    { month: 'Setembro', income: 13250, expense: 5100 },
    { month: 'Outubro', income: 14850, expense: 5320 },
  ];

  return (
    <div className="flex min-h-[calc(100vh-61px)] bg-[#f8fafc]">
      
      {/* LEFT SIDEBAR (Exact design from Image 5) */}
      <aside className="w-64 bg-[#064e3b] text-slate-100 flex flex-col justify-between shrink-0 hidden lg:flex border-r border-emerald-900/50 shadow-inner">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-emerald-800/60 flex items-center justify-between">
            <BrandLogo theme="dark" size="md" showSubtitle={false} />
            <span className="px-1.5 py-0.5 text-[10px] font-black bg-emerald-500 text-emerald-950 rounded tracking-wider">
              PRO
            </span>
          </div>

          <div className="px-5 py-3 text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
            MENU PRINCIPAL
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <button
              onClick={() => onNavigate('pj')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold bg-emerald-700/80 text-white shadow-xs cursor-pointer text-left"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-300" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('pj')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-emerald-100/80 hover:bg-emerald-800/60 hover:text-white transition-colors cursor-pointer text-left"
            >
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>Transações</span>
            </button>

            <button
              onClick={() => onNavigate('os')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-100/90 hover:bg-emerald-800/60 hover:text-white transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">Ordens de Serviço</span>
              </div>
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-emerald-500 text-emerald-950 rounded">
                PJ
              </span>
            </button>

            <button
              onClick={() => onNavigate('pj')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-emerald-100/80 hover:bg-emerald-800/60 hover:text-white transition-colors cursor-pointer text-left"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Categorias</span>
            </button>

            <button
              onClick={() => onNavigate('inventory')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-emerald-100/80 hover:bg-emerald-800/60 hover:text-white transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-emerald-400" />
                <span>Estoque</span>
              </div>
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                PJ
              </span>
            </button>

            <button
              onClick={() => onNavigate('das')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-emerald-100/80 hover:bg-emerald-800/60 hover:text-white transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Relatórios & DAS</span>
              </div>
              {!isDasPaid && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Teto MEI Anual Gauge */}
        <div className="p-4 border-t border-emerald-800/60 space-y-3">
          <div className="bg-emerald-950/60 rounded-xl p-3 border border-emerald-800/40">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-200 mb-1.5">
              <span>Teto MEI Anual</span>
              <span className="text-emerald-400 font-extrabold">66.9%</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-emerald-900/90 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"
                style={{ width: '66.9%' }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-emerald-300/80 mt-2 font-medium">
              <span>R$ 54.200</span>
              <span className="text-emerald-400/60">/ R$ 81k</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-xs text-emerald-200/80 pt-1">
            <button
              onClick={() => alert('Configurações contábeis e fiscais do MEI.')}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-emerald-800/40 hover:text-white transition-colors text-left cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span>Configurações</span>
            </button>
            <button
              onClick={() => alert('Central de ajuda com regras de emissão de NF-e e limites SIMEI.')}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-emerald-800/40 hover:text-white transition-colors text-left cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ajuda & Suporte</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24">
        
        {/* Top Header Row with Time Filters & Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Visão Geral da Empresa
            </h1>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
              <span className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-mono font-bold">
                CNPJ 48.192.839/0001-92
              </span>
              <span>•</span>
              <span>MEI Serviços & Vendas</span>
            </div>
          </div>

          {/* Time range pills & action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Time selector pills */}
            <div className="flex items-center bg-slate-200/70 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  timeRange === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Este Mês (Outubro)
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('30days')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  timeRange === '30days' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Últimos 30 dias
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('year')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  timeRange === 'year' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Ano 2024
              </button>
            </div>

            {/* Action buttons */}
            <button
              type="button"
              onClick={onOpenNewTransaction}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Registrar Venda</span>
            </button>

            <button
              type="button"
              onClick={onOpenNewTransaction}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <MinusCircle className="w-3.5 h-3.5" />
              <span>Pagar Conta</span>
            </button>
          </div>
        </div>

        {/* 4 KPI METRIC CARDS (Exact match from Image 5) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: RECEITA TOTAL PJ */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                RECEITA TOTAL PJ
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              R$ 14.850,00
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% vs. mês anterior (Set: R$ 13.250)</span>
            </div>
          </div>

          {/* Card 2: CUSTOS & DESPESAS PJ */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                CUSTOS & DESPESAS PJ
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              R$ 5.320,00
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-600 font-semibold">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-4% redução controlada de insumos</span>
            </div>
          </div>

          {/* Card 3: LUCRO LÍQUIDO REAL (Highlighted emerald) */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                LUCRO LÍQUIDO REAL ✦
              </span>
              <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-2">
              R$ 9.530,00
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-100 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
              <span>Pronto p/ Repasse PF</span>
            </div>
          </div>

          {/* Card 4: CAIXA / ESTOQUE PJ */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                ESTOQUE & SALDO PJ
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              R$ 8.940,00
            </div>
            <div className="flex items-center justify-between mt-2 text-xs font-semibold">
              <span className="text-slate-600">34 itens catalogados</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">2 críticos</span>
            </div>
          </div>

        </div>

        {/* 2 ALERT BANNERS (Guia DAS & Estoque) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Banner 1: Guia DAS-SIMEI */}
          <div className={`rounded-2xl p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
            isDasPaid
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 font-bold text-xs">
                  <span>Guia DAS-SIMEI Mensal</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isDasPaid ? 'bg-emerald-600 text-white' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {isDasPaid ? 'Paga' : 'Vence em 5 dias'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Vencimento em 20/10/2024 • Valor fixo: <strong className="text-slate-900">R$ 75,90</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenDasModal}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer self-start sm:self-center"
            >
              {isDasPaid ? 'Ver Comprovante' : 'Gerar Pix / Boleto'}
            </button>
          </div>

          {/* Banner 2: Estoque de Segurança Atingido */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 font-bold text-xs text-amber-950">
                  <span>Estoque de Segurança Atingido</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200 text-amber-900">
                    2 Itens
                  </span>
                </div>
                <p className="text-xs text-amber-900/80 mt-0.5">
                  Cabo USB-C Trançado (restam 2 un) & SSD 480GB (resta 1 un)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('inventory')}
              className="flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline shrink-0 cursor-pointer self-start sm:self-center"
            >
              <span>Ver no Estoque</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* CHARTS SECTION (Exact match from Image 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Chart: Tendência Semestral (Maio a Outubro) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    TENDÊNCIA SEMESTRAL
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Evolução Financeira PJ (Maio a Outubro)
                  </h3>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-600" />
                    <span className="text-slate-700">Receitas Brutas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-teal-500" />
                    <span className="text-slate-700">Custos Totais</span>
                  </div>
                </div>
              </div>

              {/* Chart SVG Representation with smooth curves & bars */}
              <div className="mt-6 h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-100">
                {semesterData.map((item, idx) => {
                  const maxVal = 16000;
                  const incomeHeight = (item.income / maxVal) * 100;
                  const expenseHeight = (item.expense / maxVal) * 100;

                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] p-1.5 rounded shadow-lg absolute -translate-y-24 pointer-events-none z-10 whitespace-nowrap">
                        <div className="font-bold">{item.month}</div>
                        <div>Receita: R$ {item.income.toLocaleString('pt-BR')}</div>
                        <div>Custos: R$ {item.expense.toLocaleString('pt-BR')}</div>
                      </div>

                      {/* Dual Bar / Indicator */}
                      <div className="w-full max-w-[48px] flex items-end justify-center gap-1 h-full">
                        {/* Income Bar */}
                        <div
                          className="w-1/2 bg-gradient-to-t from-emerald-700 to-emerald-500 rounded-t-md transition-all duration-500 group-hover:brightness-110"
                          style={{ height: `${incomeHeight}%` }}
                        />
                        {/* Expense Bar */}
                        <div
                          className="w-1/2 bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-md transition-all duration-500 group-hover:brightness-110"
                          style={{ height: `${expenseHeight}%` }}
                        />
                      </div>

                      {/* Month Label */}
                      <span className="text-xs font-semibold text-slate-500">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-medium pt-2">
              <span>Pico de faturamento apurado em Outubro: <strong className="text-slate-900">R$ 14.850,00</strong></span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span>Relatório contábil gerado</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Right Chart: Despesas por Categoria (Donut Chart) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                DISTRIBUIÇÃO
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Despesas por Categoria
              </h3>
              <p className="text-xs text-slate-500">Competência de Outubro (R$ 5.320)</p>

              {/* Donut Chart SVG */}
              <div className="relative flex items-center justify-center my-4 h-36">
                <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90 transform">
                  {/* Segment 1: Fornecedores 42% (blue-600) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#2563eb"
                    strokeWidth="14"
                    strokeDasharray="100.2 238.7"
                    strokeDashoffset="0"
                  />
                  {/* Segment 2: Pró-labore 20% (emerald-500) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="14"
                    strokeDasharray="47.7 238.7"
                    strokeDashoffset="-100.2"
                  />
                  {/* Segment 3: Tributos / DAS 18% (teal-400) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#14b8a6"
                    strokeWidth="14"
                    strokeDasharray="42.9 238.7"
                    strokeDashoffset="-147.9"
                  />
                  {/* Segment 4: Marketing 15% (sky-400) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#38bdf8"
                    strokeWidth="14"
                    strokeDasharray="35.8 238.7"
                    strokeDashoffset="-190.8"
                  />
                  {/* Segment 5: Outros 5% (slate-300) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#cbd5e1"
                    strokeWidth="14"
                    strokeDasharray="12 238.7"
                    strokeDashoffset="-226.6"
                  />
                </svg>

                {/* Donut Hole Text */}
                <div className="absolute text-center flex flex-col items-center pointer-events-none">
                  <span className="text-sm font-black text-slate-900">R$ 5.3k</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Total Saídas</span>
                </div>
              </div>

              {/* Category Breakdown legend */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>Fornecedores & Insumos</span>
                  </div>
                  <span className="font-bold text-slate-900">42% (R$ 2.234)</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Pró-labore Retirado</span>
                  </div>
                  <span className="font-bold text-slate-900">20% (R$ 1.064)</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                    <span>Tributos / Guia DAS</span>
                  </div>
                  <span className="font-bold text-slate-900">18% (R$ 957)</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <span>Marketing & Ads</span>
                  </div>
                  <span className="font-bold text-slate-900">15% (R$ 798)</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span>Outros Operacionais</span>
                  </div>
                  <span className="font-bold text-slate-900">5% (R$ 266)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* TABLE: LANÇAMENTOS RECENTES DA CONTA PJ (Exact match from Image 5) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          {/* Table Header & Search */}
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Lançamentos Recentes da Conta PJ
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                  Outubro 2024
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Todas as movimentações com impacto contábil direto no faturamento SIMEI da empresa.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar lançamento..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-44 sm:w-56"
                />
              </div>

              {/* Filter toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    activeFilter === 'all' ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('income')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    activeFilter === 'income' ? 'bg-white font-bold text-emerald-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Entradas
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('expense')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    activeFilter === 'expense' ? 'bg-white font-bold text-rose-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Saídas
                </button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">DATA</th>
                  <th className="py-3 px-5">DESCRIÇÃO DO LANÇAMENTO</th>
                  <th className="py-3 px-5">CATEGORIA</th>
                  <th className="py-3 px-5">TIPO</th>
                  <th className="py-3 px-5 text-right">VALOR LÍQUIDO</th>
                  <th className="py-3 px-5 text-right">AÇÃO / STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTransactions.map(tx => {
                  const isPositive = tx.type === 'income';

                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        tx.isSyncedToPF ? 'bg-indigo-50/20' : ''
                      }`}
                    >
                      {/* Date */}
                      <td className="py-3.5 px-5 font-semibold text-slate-600 whitespace-nowrap">
                        {tx.date}
                      </td>

                      {/* Description with icon and subtitle */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-start gap-2.5">
                          {/* Transfer / Sync Highlight Badge */}
                          {tx.isSyncedToPF && (
                            <button
                              type="button"
                              onClick={() => onNavigate('pf')}
                              className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-extrabold flex items-center gap-1 shadow-xs cursor-pointer mt-0.5"
                              title="Clique para conferir esta entrada na Visão Pessoal (PF)"
                            >
                              <span>Transferido p/ Visão Pessoal</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}

                          <div>
                            <div className="font-bold text-slate-900 leading-snug">
                              {tx.description}
                            </div>
                            {tx.subDescription && (
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                {tx.subDescription}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-medium text-[11px]">
                          {tx.category}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className={`font-semibold ${isPositive ? 'text-emerald-600' : 'text-slate-600'}`}>
                          {isPositive ? 'Receita' : 'Despesa PJ'}
                        </span>
                      </td>

                      {/* Value */}
                      <td className={`py-3.5 px-5 text-right font-black whitespace-nowrap ${
                        isPositive ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {isPositive ? `+ R$ ${tx.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : `- R$ ${tx.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          tx.status === 'Creditado PF'
                            ? 'bg-blue-100 text-blue-800'
                            : tx.status === 'Recebido'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tx.status === 'Pago'
                            ? 'bg-slate-100 text-slate-700'
                            : tx.status === 'Em Estoque'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {tx.status === 'Creditado PF' && '✓ '}
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Mostrando {filteredTransactions.length} lançamentos mais recentes de 48 registros deste mês
            </span>
            <button
              type="button"
              onClick={() => alert('Visualização completa de extrato contábil exportável em PDF e Excel.')}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Ver todas as 48 entradas e saídas →
            </button>
          </div>

        </div>

      </main>

    </div>
  );
}
