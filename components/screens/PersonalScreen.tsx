'use client';

import React, { useState } from 'react';
import { PFTransaction, ScreenView } from '@/types';
import { BrandLogo } from '../BrandLogo';
import {
  Wallet,
  PiggyBank,
  Shield,
  TrendingUp,
  Receipt,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  PlusCircle,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  LayoutDashboard,
  Calendar,
  Layers,
  Settings,
  HelpCircle,
  Home,
  Utensils,
  Car,
  Activity,
  Film
} from 'lucide-react';

interface PersonalScreenProps {
  transactions: PFTransaction[];
  onNavigate: (screen: ScreenView) => void;
  onOpenNewTransaction: () => void;
  onOpenProLaboreHelp: () => void;
}

export function PersonalScreen({
  transactions,
  onNavigate,
  onOpenNewTransaction,
  onOpenProLaboreHelp,
}: PersonalScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'expense' | 'prolabore'>('all');
  const [showProofModal, setShowProofModal] = useState(false);

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.accountOrOrigin.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === 'expense') return t.value < 0;
    if (activeTab === 'prolabore') return t.category === 'Pró-labore' || t.category === 'Lucros Isentos';
    return true;
  });

  const totalIncome = transactions
    .filter(t => t.value > 0)
    .reduce((acc, curr) => acc + curr.value, 0);

  const totalExpense = Math.abs(
    transactions
      .filter(t => t.value < 0)
      .reduce((acc, curr) => acc + curr.value, 0)
  );

  const netSavings = totalIncome - totalExpense;

  // Monthly dual bar comparison (May to Oct)
  const monthlyFlow = [
    { month: 'Mai', income: 5800, expense: 3900 },
    { month: 'Jun', income: 6000, expense: 4100 },
    { month: 'Jul', income: 6100, expense: 4050 },
    { month: 'Ago', income: 6200, expense: 4200 },
    { month: 'Set', income: 6200, expense: 4150 },
    { month: 'Out', income: 6200, expense: 4180 },
  ];

  return (
    <div className="flex min-h-[calc(100vh-61px)] bg-[#f8fafc]">
      
      {/* LEFT SIDEBAR (PF Palette: Deep Slate / Indigo) */}
      <aside className="w-64 bg-[#1e293b] text-slate-100 flex flex-col justify-between shrink-0 hidden lg:flex border-r border-slate-700/60 shadow-inner">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <BrandLogo theme="dark" size="md" showSubtitle={false} />
            <span className="px-2 py-0.5 text-[10px] font-black bg-blue-600 text-white rounded tracking-wider">
              PESSOAL
            </span>
          </div>

          <div className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            GESTÃO PESSOAL (PF)
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <button
              onClick={() => onNavigate('pf')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold bg-blue-600/90 text-white shadow-xs cursor-pointer text-left"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-200" />
              <span>Visão Geral</span>
            </button>

            <button
              onClick={() => onNavigate('pf')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-left"
            >
              <Receipt className="w-4 h-4 text-slate-400" />
              <span>Extrato Unificado</span>
            </button>

            <button
              onClick={() => onNavigate('pf')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-left"
            >
              <Layers className="w-4 h-4 text-slate-400" />
              <span>Categorias de Vida</span>
            </button>

            <button
              onClick={() => onNavigate('pf')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-left"
            >
              <FileCheck className="w-4 h-4 text-slate-400" />
              <span>Relatórios & Orçamento</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Reserva & Metas */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-700/60">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1.5">
              <span>RESERVA & METAS</span>
              <span className="text-blue-400 font-extrabold">61.6%</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                style={{ width: '61.6%' }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
              <span className="font-bold text-slate-200">R$ 18.500</span>
              <span>meta R$ 30k</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Modo PF Ativo</span>
            </span>
            <button
              onClick={() => onNavigate('pj')}
              className="text-[11px] text-blue-400 hover:underline cursor-pointer font-semibold"
            >
              Ir para PJ →
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24">
        
        {/* Header Row with Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Finanças Pessoais (Pessoa Física)
            </h1>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Perfil PF Ativo
              </span>
              <span>•</span>
              <span>Sincronizado com CNPJ 48.192.839/0001-92</span>
            </div>
          </div>

          {/* Action buttons on top right */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenNewTransaction}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-200"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Receita / Extra</span>
            </button>

            <button
              type="button"
              onClick={onOpenNewTransaction}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Novo Gasto Pessoal</span>
            </button>

            <button
              type="button"
              onClick={() => setShowProofModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-indigo-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Conferir Repasse PJ</span>
            </button>
          </div>
        </div>

        {/* 4 KPI METRIC CARDS (Exact match from Image 3) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: RENDA MENSAL (PF) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                RENDA MENSAL (PF)
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              R$ 6.200,00
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
              <div className="flex justify-between items-center">
                <span>Pró-labore MEI:</span>
                <strong className="text-slate-800">R$ 3.000,00</strong>
              </div>
              <div className="flex justify-between items-center">
                <span>Distribuição Isenta:</span>
                <strong className="text-emerald-700">R$ 3.200,00</strong>
              </div>
            </div>
          </div>

          {/* Card 2: GASTOS PESSOAIS DO MÊS */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                GASTOS PESSOAIS DO MÊS
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              R$ 4.180,00
            </div>
            {/* Red progress line */}
            <div className="mt-4">
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '67%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                <span>Teto de gastos: R$ 4.500</span>
                <span className="text-rose-600 font-semibold">67% consumido</span>
              </div>
            </div>
          </div>

          {/* Card 3: SALDO LÍQUIDO (ECONOMIA) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                SALDO LÍQUIDO (ECONOMIA)
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <PiggyBank className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-blue-600 mt-2">
              R$ 2.020,00
            </div>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+32.6% poupado</span>
              </span>
              <span className="text-slate-500 text-[11px]">Livre p/ reserva</span>
            </div>
          </div>

          {/* Card 4: RESERVA DE EMERGÊNCIA */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                RESERVA DE EMERGÊNCIA
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              R$ 18.500,00
            </div>
            <div className="flex items-center justify-between mt-3 text-xs font-semibold">
              <span className="text-indigo-600">4.4 meses de cobertura</span>
              <span className="text-slate-500 text-[11px]">Meta: R$ 30k</span>
            </div>
          </div>

        </div>

        {/* THE FAMOUS SYNC BANNER (Exact match from Image 3) */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50/60 to-emerald-50/40 border border-blue-200/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="w-5 h-5"
              >
                <path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Sincronizado da PJ via Banco Inter (08/10/2024)
                </span>
              </div>
              <div className="text-xs text-slate-700 mt-1 font-medium">
                Salário oficial com INSS garantido: <strong>(1 Salário Mínimo)</strong> + Lucros Livres de Imposto:
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-600" />
                <span>Sem retenção indevida na PJ. Separação 100% regular perante a Receita Federal do Brasil.</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowProofModal(true)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer self-start md:self-center"
          >
            <FileCheck className="w-4 h-4 text-blue-600" />
            <span>Ver Comprovante</span>
          </button>
        </div>

        {/* CHARTS SECTION (Exact match from Image 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Chart: Entradas vs Gastos Pessoais */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Entradas vs Gastos Pessoais
                  </h3>
                  <p className="text-xs text-slate-500">
                    Consistência de pró-labore e teto de gastos nos últimos 6 meses
                  </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-blue-600" />
                    <span className="text-slate-700">Entradas (PF)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-blue-200" />
                    <span className="text-slate-700">Gastos</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className="mt-6 h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-100">
                {monthlyFlow.map(item => {
                  const maxVal = 7000;
                  const incomeHeight = (item.income / maxVal) * 100;
                  const expenseHeight = (item.expense / maxVal) * 100;

                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="w-full max-w-[48px] flex items-end justify-center gap-1 h-full">
                        {/* Income */}
                        <div
                          className="w-1/2 bg-blue-600 rounded-t-md transition-all duration-500 group-hover:brightness-110"
                          style={{ height: `${incomeHeight}%` }}
                        />
                        {/* Expense */}
                        <div
                          className="w-1/2 bg-blue-200 rounded-t-md transition-all duration-500 group-hover:brightness-110"
                          style={{ height: `${expenseHeight}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {item.month} {item.month === 'Out' ? '(Atual)' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-500 font-medium pt-2">
              <div className="flex items-center gap-4">
                <span>Pró-labore MEI ⓘ <strong className="text-slate-800">R$ 3.000,00</strong></span>
                <span>Distribuição Isenta ⓘ <strong className="text-slate-800">R$ 3.200,00</strong></span>
              </div>
              <button
                type="button"
                onClick={onOpenProLaboreHelp}
                className="text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                Como funciona a isenção? →
              </button>
            </div>
          </div>

          {/* Right Chart: Despesas por Categoria (Donut 67% executado) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Despesas por Categoria
                  </h3>
                  <p className="text-xs text-slate-500">Estrutura de custo de vida (Outubro)</p>
                </div>
                <span className="text-xs font-bold text-slate-700">Total: R$ 4.180</span>
              </div>

              {/* Donut Chart SVG with 67% in center */}
              <div className="relative flex items-center justify-center my-4 h-36">
                <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90 transform">
                  {/* Moradia 44% (blue-600) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#2563eb"
                    strokeWidth="14"
                    strokeDasharray="105 238.7"
                    strokeDashoffset="0"
                  />
                  {/* Alimentação 27% (indigo-500) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#6366f1"
                    strokeWidth="14"
                    strokeDasharray="64.4 238.7"
                    strokeDashoffset="-105"
                  />
                  {/* Transporte 11% (emerald-500) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="14"
                    strokeDasharray="26.2 238.7"
                    strokeDashoffset="-169.4"
                  />
                  {/* Saúde 9% (sky-400) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#38bdf8"
                    strokeWidth="14"
                    strokeDasharray="21.5 238.7"
                    strokeDashoffset="-195.6"
                  />
                  {/* Lazer 8% (amber-300) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#fde047"
                    strokeWidth="14"
                    strokeDasharray="19.1 238.7"
                    strokeDashoffset="-217.1"
                  />
                </svg>

                <div className="absolute text-center flex flex-col items-center pointer-events-none">
                  <span className="text-base font-black text-slate-900">67%</span>
                  <span className="text-[10px] text-slate-500 font-semibold">executado</span>
                </div>
              </div>

              {/* Categories Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>Moradia (Aluguel, Luz, Net)</span>
                  </div>
                  <span className="font-bold text-slate-900">R$ 1.850,00 (44%)</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span>Alimentação & Supermercado</span>
                  </div>
                  <span className="font-bold text-slate-900">R$ 1.150,00 (27%)</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Transporte & Combustível</span>
                  </div>
                  <span className="font-bold text-slate-900">R$ 480,00 (11%)</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <span>Saúde & Farmácia</span>
                  </div>
                  <span className="font-bold text-slate-900">R$ 380,00 (9%)</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                    <span>Lazer & Assinaturas</span>
                  </div>
                  <span className="font-bold text-slate-900">R$ 320,00 (8%)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* TABLE: LANÇAMENTOS RECENTES (PESSOA FÍSICA) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          {/* Header & Tabs */}
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Lançamentos Recentes (Pessoa Física)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Extrato unificado de custos de vida e repasses da PJ
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar lançamento..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-44 sm:w-56"
                />
              </div>

              {/* Tabs */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    activeTab === 'all' ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Todas
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('expense')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    activeTab === 'expense' ? 'bg-white font-bold text-rose-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Despesas
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('prolabore')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    activeTab === 'prolabore' ? 'bg-white font-bold text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Pró-labore ⓘ
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
                  <th className="py-3 px-5">DESCRIÇÃO</th>
                  <th className="py-3 px-5">CATEGORIA</th>
                  <th className="py-3 px-5">CONTA / ORIGEM</th>
                  <th className="py-3 px-5 text-right">VALOR</th>
                  <th className="py-3 px-5 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTransactions.map(tx => {
                  const isPositive = tx.value > 0;

                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        tx.isFromPJ ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      {/* Date */}
                      <td className="py-3.5 px-5 font-semibold text-slate-600 whitespace-nowrap">
                        {tx.date}
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          {tx.isFromPJ && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Repasse da Empresa PJ" />
                          )}
                          <div>
                            <div className="font-bold text-slate-900 leading-snug">
                              {tx.description}
                            </div>
                            {tx.subDescription && (
                              <div className="text-[11px] text-emerald-700 font-medium">
                                {tx.subDescription}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className={`px-2 py-0.8 rounded-md font-semibold text-[11px] ${
                          tx.category === 'Pró-labore'
                            ? 'bg-blue-100 text-blue-800'
                            : tx.category === 'Lucros Isentos'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {tx.category}
                        </span>
                      </td>

                      {/* Account/Origin */}
                      <td className="py-3.5 px-5 text-slate-600 whitespace-nowrap">
                        {tx.accountOrOrigin}
                      </td>

                      {/* Value */}
                      <td className={`py-3.5 px-5 text-right font-black whitespace-nowrap ${
                        isPositive ? 'text-emerald-600' : 'text-slate-900'
                      }`}>
                        {isPositive
                          ? `+ R$ ${tx.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                          : `- R$ ${Math.abs(tx.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          tx.status === 'Recebido'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {tx.status === 'Recebido' && '● '}
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
            <span>Mostrando {filteredTransactions.length} de 38 lançamentos do mês</span>
            <button
              type="button"
              onClick={() => alert('Extrato exportável para IRPF com informe de rendimentos oficial.')}
              className="text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Ver todas as entradas e saídas pessoais (PF) →
            </button>
          </div>

        </div>

      </main>

      {/* Proof Modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Comprovante de Repasse PJ ➔ PF</h3>
              </div>
              <button
                onClick={() => setShowProofModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Origem:</span>
                <span className="font-bold text-slate-800">Banco Inter PJ (CNPJ 48.192.839/0001-92)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destino:</span>
                <span className="font-bold text-slate-800">Lucas Silva (CPF ***.821.908-**)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Data & Hora:</span>
                <span className="font-bold text-slate-800">08/10/2024 às 14:32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Valor Total:</span>
                <span className="font-bold text-emerald-600 text-sm">R$ 3.000,00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Natureza:</span>
                <span className="font-bold text-blue-600">Pró-labore Oficial (INSS Recolhido via DAS)</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Este lançamento foi registrado na contabilidade da empresa e classificado como dedutível/regular perante a Receita Federal do Brasil.
            </p>

            <button
              onClick={() => setShowProofModal(false)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Fechar Comprovante
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
