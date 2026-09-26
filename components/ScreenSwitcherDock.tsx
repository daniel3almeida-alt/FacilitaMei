'use client';

import React, { useEffect } from 'react';
import { ScreenView } from '@/types';
import {
  Building2,
  User,
  Sparkles,
  Package,
  FileText,
  Compass,
  Maximize2,
  Settings,
  ClipboardList
} from 'lucide-react';

interface ScreenSwitcherDockProps {
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
  onOpenNewTransaction: () => void;
  onOpenScreenGallery: () => void;
}

export function ScreenSwitcherDock({
  currentScreen,
  onNavigate,
  onOpenNewTransaction,
  onOpenScreenGallery,
}: ScreenSwitcherDockProps) {

  // Keyboard shortcut listener for fluid navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === '1') onNavigate('pj');
      if (e.key === '2') onNavigate('pf');
      if (e.key === '3') onOpenNewTransaction();
      if (e.key === '4') onNavigate('os');
      if (e.key === '5') onNavigate('inventory');
      if (e.key === '6') onNavigate('das');
      if (e.key === '7') onOpenScreenGallery();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate, onOpenNewTransaction, onOpenScreenGallery]);

  return (
    <nav
      aria-label="Navegação rápida entre telas"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 text-white backdrop-blur-xl px-2.5 py-1.5 rounded-2xl shadow-2xl border border-slate-700/60 flex items-center gap-1 sm:gap-1.5 transition-all max-w-[95vw] overflow-x-auto"
    >
      <div className="hidden md:flex items-center gap-1.5 pl-2 pr-3 border-r border-slate-700/80 text-[11px] font-semibold text-slate-400">
        <Compass className="w-3.5 h-3.5 text-emerald-400" />
        <span>Navegação Fluida</span>
      </div>

      {/* Screen 1: Empresa (PJ) */}
      <button
        type="button"
        onClick={() => onNavigate('pj')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
          currentScreen === 'pj'
            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
        title="Pressione [1] para Visão Empresa PJ"
      >
        <Building2 className="w-3.5 h-3.5" />
        <span>Empresa PJ</span>
        <span className="hidden sm:inline-block text-[10px] opacity-60 ml-0.5">1</span>
      </button>

      {/* Screen 2: Finanças Pessoais (PF) */}
      <button
        type="button"
        onClick={() => onNavigate('pf')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
          currentScreen === 'pf'
            ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
        title="Pressione [2] para Finanças Pessoais PF"
      >
        <User className="w-3.5 h-3.5" />
        <span>Pessoal PF</span>
        <span className="hidden sm:inline-block text-[10px] opacity-60 ml-0.5">2</span>
      </button>

      {/* Screen 3: Modal de Sincronização PJ -> PF */}
      <button
        type="button"
        onClick={onOpenNewTransaction}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-md shadow-teal-500/25 transition-all cursor-pointer whitespace-nowrap"
        title="Pressione [3] para abrir o Modal de Sincronização Inteligente"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Sync PJ➔PF</span>
        <span className="hidden sm:inline-block text-[10px] opacity-70 ml-0.5">3</span>
      </button>

      {/* Screen 4: Ordens de Serviço (OS) */}
      <button
        type="button"
        onClick={() => onNavigate('os')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
          currentScreen === 'os'
            ? 'bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-400/30'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
        title="Pressione [4] para Ordens de Serviço (OS)"
      >
        <ClipboardList className="w-3.5 h-3.5" />
        <span>Ordens de Serviço</span>
        <span className="hidden sm:inline-block text-[10px] opacity-60 ml-0.5">4</span>
      </button>

      {/* Screen 5: Estoque PJ */}
      <button
        type="button"
        onClick={() => onNavigate('inventory')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
          currentScreen === 'inventory'
            ? 'bg-emerald-500 text-slate-950 shadow-md'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
        title="Pressione [5] para Estoque da Empresa"
      >
        <Package className="w-3.5 h-3.5" />
        <span>Estoque</span>
        <span className="px-1.5 py-0.2 bg-rose-500/80 text-white text-[9px] rounded-full font-bold">2</span>
      </button>

      {/* Screen 6: DAS & Relatórios */}
      <button
        type="button"
        onClick={() => onNavigate('das')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
          currentScreen === 'das'
            ? 'bg-emerald-500 text-slate-950 shadow-md'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
        title="Pressione [6] para Guia DAS e SIMEI"
      >
        <FileText className="w-3.5 h-3.5" />
        <span>DAS MEI</span>
        <span className="hidden sm:inline-block text-[10px] opacity-60 ml-0.5">6</span>
      </button>

      {/* Screen 7: Screen Tour & Gallery */}
      <button
        type="button"
        onClick={onOpenScreenGallery}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/80 hover:bg-indigo-600 text-white transition-all cursor-pointer whitespace-nowrap ml-1"
        title="Pressione [7] para Visualizador de Telas & Links Diretos"
      >
        <Maximize2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Galeria</span>
      </button>
    </nav>
  );
}
