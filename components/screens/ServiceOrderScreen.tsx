'use client';

import React, { useState, useMemo } from 'react';
import { ScreenView, StockItem, PJTransaction } from '@/types';
import { BrandLogo } from '../BrandLogo';
import {
  LayoutDashboard,
  Receipt,
  FileText,
  Package,
  Layers,
  Settings,
  HelpCircle,
  MessageCircle,
  Printer,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Search,
  Check,
  CreditCard,
  QrCode,
  DollarSign,
  ChevronDown,
  Clock,
  Sparkles,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  ClipboardList
} from 'lucide-react';

interface OSItem {
  id: string;
  name: string;
  code: string;
  type: 'Peça' | 'Serviço';
  quantity: number;
  unitPrice: number;
}

interface ServiceOrderScreenProps {
  stockItems: StockItem[];
  onNavigate: (screen: ScreenView) => void;
  onFinishOrder: (tx: PJTransaction) => void;
}

export function ServiceOrderScreen({
  stockItems,
  onNavigate,
  onFinishOrder,
}: ServiceOrderScreenProps) {
  // OS Status
  const [osStatus, setOsStatus] = useState<'Pronto p/ Retirada' | 'Em Análise' | 'Aguardando Peça' | 'Entregue / Concluído'>('Pronto p/ Retirada');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Client & Equipment details
  const [clientName, setClientName] = useState('Eletrônica & Manutenção Prime LTDA');
  const [clientPhone, setClientPhone] = useState('(11) 98765-4321');
  const [equipmentModel, setEquipmentModel] = useState('Samsung Galaxy S22 Ultra 5G (Preto)');
  const [deliveryDate, setDeliveryDate] = useState('2026-09-28');
  const [assignedTechnician, setAssignedTechnician] = useState('Lucas Silva');

  // Diagnosis & Technical solution
  const [claimedDefect, setClaimedDefect] = useState(
    'Aparelho sofreu queda frontal. Display apagado sem resposta ao toque, aparelho vibra ao carregar.'
  );
  const [technicalSolution, setTechnicalSolution] = useState(
    'Troca completa do display OLED original com aro, desoxidação do conector USB-C e teste de carga.'
  );

  // Items and Labor
  const [items, setItems] = useState<OSItem[]>([
    {
      id: 'item-1',
      name: 'Módulo Display OLED S22 Ultra',
      code: 'Cód: PEC-8910-S22',
      type: 'Peça',
      quantity: 1,
      unitPrice: 460.00
    },
    {
      id: 'item-2',
      name: 'Mão de Obra de Manutenção Especializada',
      code: 'Cód: SRV-102 (1h)',
      type: 'Serviço',
      quantity: 1,
      unitPrice: 140.00
    },
    {
      id: 'item-3',
      name: 'Película de Proteção 3D Curva',
      code: 'Acessório Cortesia',
      type: 'Peça',
      quantity: 1,
      unitPrice: 50.00
    }
  ]);

  // Form for adding new item
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'Peça' | 'Serviço'>('Peça');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);

  // Financials
  const [commercialDiscount, setCommercialDiscount] = useState<number>(30.00);
  const [downPayment, setDownPayment] = useState<number>(300.00); // Entrada / Sinal (PIX Pago)
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'debito' | 'dinheiro' | 'prazo'>('pix');
  const [receivedAmount, setReceivedAmount] = useState<number>(350.00);

  // Checkboxes
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [postToCash, setPostToCash] = useState(true);
  const [issueNfse, setIssueNfse] = useState(false);

  // Checklist
  const [checklist, setChecklist] = useState({
    deviceTurnsOn: true,
    screenIntact: false,
    chargingPortOk: true,
    chipRemoved: true,
  });
  const [leftoverAccessories, setLeftoverAccessories] = useState('Cabo USB-C Original + Capa Silicone');

  // Confirmation state
  const [orderFinalized, setOrderFinalized] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Calculations
  const totalBruto = useMemo(() => {
    return items.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
  }, [items]);

  const totalLiquido = useMemo(() => {
    return Math.max(0, totalBruto - commercialDiscount);
  }, [totalBruto, commercialDiscount]);

  const saldoRestante = useMemo(() => {
    return Math.max(0, totalLiquido - downPayment);
  }, [totalLiquido, downPayment]);

  const trocoCalculado = useMemo(() => {
    if (paymentMethod === 'dinheiro' && receivedAmount > saldoRestante) {
      return receivedAmount - saldoRestante;
    }
    return 0.00;
  }, [paymentMethod, receivedAmount, saldoRestante]);

  // Add Item handler
  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newItemName.trim()) return;
    const price = parseFloat(newItemPrice.replace(/\./g, '').replace(',', '.')) || 50;

    const newItem: OSItem = {
      id: `os-item-${Date.now()}`,
      name: newItemName.trim(),
      code: `Cód: ${newItemType === 'Peça' ? 'PEC' : 'SRV'}-${Math.floor(Math.random() * 8000 + 1000)}`,
      type: newItemType,
      quantity: 1,
      unitPrice: price,
    };

    setItems(prev => [...prev, newItem]);
    setNewItemName('');
    setNewItemPrice('');
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  // Finalize OS and post to PJ Cash
  const handleFinalizeAndReceive = () => {
    const formattedDate = new Date().toLocaleDateString('pt-BR');
    const newTx: PJTransaction = {
      id: `pj-os-${Date.now()}`,
      date: formattedDate,
      description: `Quitação OS #1196 - ${clientName}`,
      subDescription: `Aparelho: ${equipmentModel} • Forma: ${paymentMethod.toUpperCase()}`,
      category: 'Faturamento / Vendas',
      type: 'income',
      value: saldoRestante,
      status: 'Recebido',
      account: 'Banco Inter PJ'
    };

    onFinishOrder(newTx);
    setOsStatus('Entregue / Concluído');
    setOrderFinalized(true);
  };

  const handleSaveDraft = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `Olá ${clientName}, sua Ordem de Serviço #1196 do aparelho ${equipmentModel} está PRONTA PARA RETIRADA! Valor restante: R$ ${saldoRestante.toFixed(2)}. FacilitaMei Assistência Técnica.`
    );
    window.open(`https://api.whatsapp.com/send?phone=5511987654321&text=${message}`, '_blank');
  };

  return (
    <div className="flex min-h-[calc(100vh-61px)] bg-[#f8fafc]">
      
      {/* LEFT SIDEBAR (Identical to CompanyScreen and image.png) */}
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
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-emerald-100/80 hover:bg-emerald-800/60 hover:text-white transition-colors cursor-pointer text-left"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('pj')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-emerald-100/80 hover:bg-emerald-800/60 hover:text-white transition-colors cursor-pointer text-left"
            >
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>Transações</span>
            </button>

            {/* Ordens de Serviço (Active Item) */}
            <button
              onClick={() => onNavigate('os')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold bg-emerald-700/90 text-white shadow-xs cursor-pointer text-left ring-1 ring-emerald-500/40"
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="w-4 h-4 text-emerald-300" />
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
              onClick={() => alert('Configurações de emissão e numeração de OS.')}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-emerald-800/40 hover:text-white transition-colors text-left cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span>Configurações</span>
            </button>
            <button
              onClick={() => alert('Suporte para regras fiscais e emissão de NFS-e MEI.')}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-emerald-800/40 hover:text-white transition-colors text-left cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ajuda & Suporte</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN SCREEN AREA */}
      <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto space-y-4 pb-28">
        
        {/* OS HEADER (Matching exact screenshot top bar) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          
          {/* Left Title & Status */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Ordem de Serviço</span>
              <span className="text-emerald-600">#1196</span>
            </h1>

            {/* Status dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200 transition-colors cursor-pointer"
              >
                <span className={`w-2 h-2 rounded-full ${
                  osStatus === 'Pronto p/ Retirada' ? 'bg-emerald-500' : osStatus === 'Entregue / Concluído' ? 'bg-blue-600' : 'bg-amber-500'
                }`} />
                <span>{osStatus}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {statusDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 animate-in fade-in duration-100">
                  {(['Pronto p/ Retirada', 'Em Análise', 'Aguardando Peça', 'Entregue / Concluído'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => {
                        setOsStatus(s);
                        setStatusDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-slate-50 flex items-center justify-between ${
                        osStatus === s ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{s}</span>
                      {osStatus === s && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Recepção Balcão
            </span>
          </div>

          {/* Action Buttons: WhatsApp, Imprimir, Salvar OS (F4), Finalizar & Receber (F8) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-emerald-200"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-200"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Imprimir</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-200"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span>Salvar OS <span className="opacity-60 text-[10px] ml-0.5">F4</span></span>
            </button>

            <button
              type="button"
              onClick={handleFinalizeAndReceive}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Finalizar & Receber <span className="opacity-70 text-[10px] ml-0.5">F8</span></span>
            </button>
          </div>

        </div>

        {/* 2-COLUMN MAIN LAYOUT (Identical to screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* LEFT COLUMN: CLIENTE, DIAGNÓSTICO, ITENS (8 COLS) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* 1. IDENTIFICAÇÃO & CLIENTE */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  IDENTIFICAÇÃO & CLIENTE
                </span>
                <button
                  type="button"
                  onClick={() => alert('Modal para cadastro rápido de novo cliente com CNPJ ou CPF.')}
                  className="text-xs text-emerald-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Novo Cliente</span>
                </button>
              </div>

              {/* Row 1: Cliente & Telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Cliente Solicitante
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Row 2: Equipamento, Previsão, Responsável */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Equipamento / Modelo
                  </label>
                  <input
                    type="text"
                    value={equipmentModel}
                    onChange={e => setEquipmentModel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Previsão Entrega
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Responsável
                  </label>
                  <select
                    value={assignedTechnician}
                    onChange={e => setAssignedTechnician(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Lucas Silva">Lucas Silva</option>
                    <option value="Atendente Balcão">Atendente Balcão</option>
                    <option value="Técnico Externo">Técnico Externo</option>
                  </select>
                </div>
              </div>

            </div>

            {/* 2. DIAGNÓSTICO & PROCEDIMENTO */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                DIAGNÓSTICO & PROCEDIMENTO
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Defeito Reclamado pelo Cliente
                  </label>
                  <textarea
                    rows={3}
                    value={claimedDefect}
                    onChange={e => setClaimedDefect(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Serviço & Solução Técnica
                  </label>
                  <textarea
                    rows={3}
                    value={technicalSolution}
                    onChange={e => setTechnicalSolution(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. ITENS & MÃO DE OBRA */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Itens & Mão de Obra
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                    {items.length} itens
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setQuickSearchOpen(!quickSearchOpen)}
                  className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Buscar Peça / F3</span>
                </button>
              </div>

              {/* Quick Search Drawer from Stock Items */}
              {quickSearchOpen && (
                <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2 animate-in fade-in duration-100">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase">
                    Selecione produto do estoque PJ para incluir na OS:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {stockItems.map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          setItems(prev => [
                            ...prev,
                            {
                              id: `os-${Date.now()}`,
                              name: st.name,
                              code: `Cód: ${st.sku}`,
                              type: 'Peça',
                              quantity: 1,
                              unitPrice: st.sellPrice
                            }
                          ]);
                          setQuickSearchOpen(false);
                        }}
                        className="p-2 bg-white rounded-lg border border-slate-200 hover:border-emerald-500 text-left text-xs cursor-pointer shadow-2xs"
                      >
                        <div className="font-bold text-slate-800 line-clamp-1">{st.name}</div>
                        <div className="text-slate-500 text-[10px] mt-0.5">R$ {st.sellPrice.toFixed(2)} • Qtd: {st.quantity}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Input Row */}
              <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  placeholder="Adicionar produto ou serviço..."
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="sm:col-span-6 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />

                <select
                  value={newItemType}
                  onChange={e => setNewItemType(e.target.value as 'Peça' | 'Serviço')}
                  className="sm:col-span-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="Peça">Peça</option>
                  <option value="Serviço">Serviço</option>
                </select>

                <input
                  type="text"
                  placeholder="R$ 0,00"
                  value={newItemPrice}
                  onChange={e => setNewItemPrice(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 text-right focus:outline-none"
                />

                <button
                  type="submit"
                  className="sm:col-span-2 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>Adicionar</span>
                </button>
              </form>

              {/* Table of Items */}
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 bg-slate-50/80 px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <div className="col-span-6">ITEM</div>
                  <div className="col-span-2 text-center">TIPO</div>
                  <div className="col-span-1 text-center">QTD</div>
                  <div className="col-span-2 text-right">TOTAL</div>
                  <div className="col-span-1 text-right"></div>
                </div>

                <div className="divide-y divide-slate-100">
                  {items.map(item => (
                    <div key={item.id} className="grid grid-cols-12 px-4 py-3 items-center hover:bg-slate-50/50 transition-colors">
                      <div className="col-span-6">
                        <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.code}</div>
                      </div>

                      <div className="col-span-2 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.type === 'Peça' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.type}
                        </span>
                      </div>

                      <div className="col-span-1 text-center font-bold text-xs text-slate-700">
                        {item.quantity}
                      </div>

                      <div className="col-span-2 text-right font-black text-xs text-slate-900">
                        R$ {(item.quantity * item.unitPrice).toFixed(2)}
                      </div>

                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remover item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: PAGAMENTO & QUITAÇÃO + CHECK-LIST RÁPIDO (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* CARD 1: PAGAMENTO & QUITAÇÃO */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>PAGAMENTO & QUITAÇÃO</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">Conclusão e baixa financeira</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  Caixa PJ
                </span>
              </div>

              {/* Financial values breakdown */}
              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex justify-between text-slate-600">
                  <span>Total Bruto (Itens + Mão de Obra)</span>
                  <span className="font-bold text-slate-900">R$ {totalBruto.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <div className="flex items-center gap-1">
                    <span>Desconto Comercial</span>
                    <button
                      type="button"
                      onClick={() => {
                        const val = prompt('Digite o valor do desconto (R$):', commercialDiscount.toString());
                        if (val !== null) setCommercialDiscount(parseFloat(val.replace(',', '.')) || 0);
                      }}
                      className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                    >
                      (ajustar)
                    </button>
                  </div>
                  <span className="font-bold text-blue-600">- R$ {commercialDiscount.toFixed(2)}</span>
                </div>

                {/* Total Líquido */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">Total Líquido da OS</span>
                  <span className="text-xl font-black text-slate-900">
                    R$ {totalLiquido.toFixed(2)}
                  </span>
                </div>

                {/* Entrada / Sinal (PIX Pago) Row */}
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Entrada / Sinal (PIX Pago)</span>
                  </div>
                  <span className="font-black text-emerald-700 text-xs">
                    R$ {downPayment.toFixed(2)}
                  </span>
                </div>

                {/* Saldo Restante a Cobrar Row */}
                <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    <span>Saldo Restante a Cobrar</span>
                  </div>
                  <span className="font-black text-rose-600 text-xs">
                    R$ {saldoRestante.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* FORMA DE QUITAÇÃO DO SALDO */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    FORMA DE QUITAÇÃO DO SALDO
                  </span>
                  <button
                    type="button"
                    onClick={() => alert('Dividir saldo entre PIX e Cartão de Crédito.')}
                    className="text-[10px] text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    + Dividir Formas
                  </button>
                </div>

                {/* 2x2 Grid of Payment methods */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* PIX Imediato */}
                  <label
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-2 rounded-xl border flex items-start gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-emerald-500 bg-emerald-50/40 text-slate-900 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'pix'}
                      onChange={() => setPaymentMethod('pix')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-bold text-[11px] leading-tight">PIX Imediato</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Sem taxas PJ</div>
                    </div>
                  </label>

                  {/* Cartão Débito */}
                  <label
                    onClick={() => setPaymentMethod('debito')}
                    className={`p-2 rounded-xl border flex items-start gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'debito'
                        ? 'border-emerald-500 bg-emerald-50/40 text-slate-900 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'debito'}
                      onChange={() => setPaymentMethod('debito')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-bold text-[11px] leading-tight">Cartão Débito</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Maquininha</div>
                    </div>
                  </label>

                  {/* Dinheiro (Espécie) */}
                  <label
                    onClick={() => setPaymentMethod('dinheiro')}
                    className={`p-2 rounded-xl border flex items-start gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'dinheiro'
                        ? 'border-emerald-500 bg-emerald-50/40 text-slate-900 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'dinheiro'}
                      onChange={() => setPaymentMethod('dinheiro')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-bold text-[11px] leading-tight">Dinheiro (Espécie)</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Calcular troco</div>
                    </div>
                  </label>

                  {/* A Prazo / Carnê */}
                  <label
                    onClick={() => setPaymentMethod('prazo')}
                    className={`p-2 rounded-xl border flex items-start gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'prazo'
                        ? 'border-emerald-500 bg-emerald-50/40 text-slate-900 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'prazo'}
                      onChange={() => setPaymentMethod('prazo')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-bold text-[11px] leading-tight">A Prazo / Carnê</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Promissória</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Valor a Receber, Entregue e Troco */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Valor a Receber Agora:</span>
                  <span className="font-black text-slate-900 text-sm">
                    R$ {saldoRestante.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Valor Entregue pelo Cliente:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-xs">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={receivedAmount}
                      onChange={e => setReceivedAmount(parseFloat(e.target.value) || 0)}
                      className="w-24 text-right px-2 py-1 bg-slate-50 border border-slate-200 rounded font-bold text-slate-900 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-dashed border-slate-200">
                  <span className="font-bold text-slate-700">Troco Calculado:</span>
                  <span className={`font-black text-xs ${trocoCalculado > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    R$ {trocoCalculado.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* 3 Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    checked={sendWhatsApp}
                    onChange={e => setSendWhatsApp(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span className="font-medium text-[11px]">Enviar Recibo / Comprovante por WhatsApp</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    checked={postToCash}
                    onChange={e => setPostToCash(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span className="font-medium text-[11px]">Dar baixa imediata no Caixa da Empresa (PJ)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    checked={issueNfse}
                    onChange={e => setIssueNfse(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span className="font-medium text-[11px]">Emitir NFS-e Nacional MEI após conclusão</span>
                </label>
              </div>

              {/* Big Action Button: Finalizar e Baixar no Caixa (PJ) */}
              <button
                type="button"
                onClick={handleFinalizeAndReceive}
                className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
              >
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Finalizar e Baixar no Caixa (PJ)</span>
                </div>
                <span className="text-[10px] text-emerald-200 font-normal">
                  Lança R$ {saldoRestante.toFixed(2)} em Entradas e entrega a OS
                </span>
              </button>

            </div>

            {/* CARD 2: CHECK-LIST RÁPIDO */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  CHECK-LIST RÁPIDO
                </span>
                <Smartphone className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between cursor-pointer select-none text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="text-slate-400">🔌</span>
                    <span>Aparelho Liga?</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={checklist.deviceTurnsOn}
                    onChange={e => setChecklist(prev => ({ ...prev, deviceTurnsOn: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 border-slate-300"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer select-none text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="text-slate-400">📱</span>
                    <span>Tela / Touch Íntegro?</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={checklist.screenIntact}
                    onChange={e => setChecklist(prev => ({ ...prev, screenIntact: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 border-slate-300"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer select-none text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="text-slate-400">⚡</span>
                    <span>Conector de Carga OK?</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={checklist.chargingPortOk}
                    onChange={e => setChecklist(prev => ({ ...prev, chargingPortOk: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 border-slate-300"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer select-none text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="text-slate-400">💳</span>
                    <span>Chip / Cartão Removido?</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={checklist.chipRemoved}
                    onChange={e => setChecklist(prev => ({ ...prev, chipRemoved: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 border-slate-300"
                  />
                </label>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Acessórios Deixados
                </label>
                <input
                  type="text"
                  value={leftoverAccessories}
                  onChange={e => setLeftoverAccessories(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Bottom Footer Tag: Pronto p/ NFS-e Nacional MEI */}
            <div className="p-3 bg-slate-100/80 rounded-xl flex items-center justify-between text-xs text-slate-600 border border-slate-200/60">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-700">Pronto p/ NFS-e Nacional MEI</span>
              </div>
              <button
                type="button"
                onClick={() => alert('Regras fiscais de emissão simplificada para MEI via Emissor Nacional.')}
                className="text-[11px] text-emerald-700 hover:underline font-bold cursor-pointer"
              >
                Regras
              </button>
            </div>

          </div>

        </div>

        {/* Confirmation Modal */}
        {orderFinalized && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">OS #1196 Finalizada & Baixada!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  O valor restante de <strong>R$ {saldoRestante.toFixed(2)}</strong> foi lançado nas receitas da Empresa (PJ) e o status foi atualizado para &quot;Entregue / Concluído&quot;.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 text-left border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cliente:</span>
                  <span className="font-bold text-slate-900">{clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Equipamento:</span>
                  <span className="font-semibold text-slate-800">{equipmentModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Valor Total Quitado:</span>
                  <span className="font-bold text-emerald-700">R$ {totalLiquido.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Comprovante WhatsApp:</span>
                  <span className="font-semibold text-emerald-600">Disparado com sucesso</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOrderFinalized(false);
                    onNavigate('pj');
                  }}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Voltar ao Dashboard PJ
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFinalized(false)}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Continuar na OS
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Draft Toast */}
        {saveToast && (
          <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl animate-in slide-in-from-bottom duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Ordem de Serviço #1196 salva como rascunho com sucesso!</span>
          </div>
        )}

      </main>

    </div>
  );
}
