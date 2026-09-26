'use client';

import React, { useState } from 'react';
import { ScreenView, NotificationItem } from '@/types';
import { BrandLogo } from './BrandLogo';
import {
  Building2,
  User,
  Calendar,
  ChevronDown,
  Bell,
  CheckCircle2,
  Layers,
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface TopNavbarProps {
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
  notifications: NotificationItem[];
  onOpenNewTransaction: () => void;
  onOpenScreenGallery: () => void;
}

export function TopNavbar({
  currentScreen,
  onNavigate,
  notifications,
  onOpenNewTransaction,
  onOpenScreenGallery,
}: TopNavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Outubro 2024');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const months = ['Outubro 2024', 'Setembro 2024', 'Agosto 2024', 'Julho 2024'];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Mobile Logo & Quick Context */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <BrandLogo size="sm" showSubtitle={false} />
          </div>

          {/* Quick Context pill or breadcrumb */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ambiente Integrado</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-700">
              {currentScreen === 'pj'
                ? 'Módulo Jurídico (CNPJ 48.192.839/0001-92)'
                : currentScreen === 'pf'
                ? 'Módulo Pessoa Física (CPF Lucas Silva)'
                : currentScreen === 'os'
                ? 'Ordem de Serviço #1196 (Assistência PJ)'
                : currentScreen === 'inventory'
                ? 'Controle de Estoque PJ'
                : currentScreen === 'das'
                ? 'Guia Fiscal DAS-SIMEI'
                : 'Galeria & Comparador de Telas'}
            </span>
          </div>
        </div>

        {/* Center: The Core PJ vs PF Switcher (Exact visual match from images) */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 shadow-xs">
          <button
            type="button"
            onClick={() => onNavigate('pj')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
              currentScreen === 'pj'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Empresa (PJ)</span>
            {currentScreen === 'pj' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('pf')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
              currentScreen === 'pf'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Visão Pessoal (PF)</span>
            {currentScreen === 'pf' && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
            )}
          </button>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2.5">
          {/* Month Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMonthDropdown(!showMonthDropdown)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-medium transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{selectedMonth}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showMonthDropdown && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Mês de Referência
                </div>
                {months.map(m => (
                  <button
                    key={m}
                    onClick={() => {
                      setSelectedMonth(m);
                      setShowMonthDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      selectedMonth === m ? 'text-emerald-600 font-semibold bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{m}</span>
                    {selectedMonth === m && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Button: New Transaction with Sync */}
          <button
            type="button"
            onClick={onOpenNewTransaction}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="Abrir modal de lançamento com sincronização automática PJ ➔ PF"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span className="hidden sm:inline">Nova Transação</span>
            <span className="sm:hidden">+</span>
          </button>

          {/* Screen Gallery / Reference Switcher */}
          <button
            type="button"
            onClick={onOpenScreenGallery}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-lg text-xs font-medium border border-slate-200/80 transition-colors cursor-pointer"
            title="Ver mapa de telas e imagens de referência originais"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden lg:inline">Telas & Fluxo</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Notificações"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="font-semibold text-xs text-slate-900 flex items-center gap-2">
                    <span>Notificações & Alertas</span>
                    <span className="px-1.5 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded-full font-bold">
                      {unreadCount} novas
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">FacilitaMei Radar</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.actionScreen) onNavigate(n.actionScreen);
                        setShowNotifications(false);
                      }}
                      className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !n.read ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-800 leading-snug">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                      {n.actionScreen && (
                        <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                          <span>Acessar tela</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Capsule */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
              LS
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 leading-tight">Lucas Silva</span>
              <span className="text-[10px] text-emerald-600 font-medium leading-tight">
                {currentScreen === 'pj' ? 'MEI Ativo' : 'PF Ativo (CPF)'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
