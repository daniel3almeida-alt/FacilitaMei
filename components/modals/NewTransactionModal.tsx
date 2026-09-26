'use client';

import React, { useState } from 'react';
import { PJTransaction, PFTransaction } from '@/types';
import {
  X,
  ArrowDownLeft,
  ArrowUpRight,
  HelpCircle,
  Calendar,
  Building,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPJTransaction: (transaction: PJTransaction, syncedPF?: PFTransaction) => void;
  onOpenPFView: () => void;
  onOpenProLaboreHelp: () => void;
}

export function NewTransactionModal({
  isOpen,
  onClose,
  onAddPJTransaction,
  onOpenPFView,
  onOpenProLaboreHelp,
}: NewTransactionModalProps) {
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('Retirada de Pró-labore - Lucas');
  const [amount, setAmount] = useState('3000,00');
  const [category, setCategory] = useState('Pró-labore');
  const [date, setDate] = useState('2024-10-15');
  const [account, setAccount] = useState('Banco Inter PJ • Ag 0001 C/C 82910-4');
  const [autoSyncToPF, setAutoSyncToPF] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!isOpen) return null;

  const parsedAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.')) || 0;
  const formattedCurrency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(parsedAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = Date.now();
    const pjId = `pj-${timestamp}`;
    const pfId = `pf-${timestamp}`;

    // Format date DD/MM/YYYY
    const [y, m, d] = date.split('-');
    const formattedDate = `${d}/${m}/${y}`;

    const newPJTx: PJTransaction = {
      id: pjId,
      date: formattedDate,
      description: description.trim() || (transactionType === 'income' ? 'Receita PJ' : 'Despesa PJ'),
      subDescription: autoSyncToPF ? 'Pix PJ → Lucas Silva (Banco Inter PF)' : 'Lançamento manual de caixa',
      category: category === 'Pró-labore' ? 'Pró-labore' : category,
      type: transactionType,
      value: parsedAmount,
      status: autoSyncToPF ? 'Creditado PF' : transactionType === 'income' ? 'Recebido' : 'Pago',
      isSyncedToPF: autoSyncToPF && transactionType === 'expense',
      syncTarget: autoSyncToPF ? pfId : undefined,
      account: 'Banco Inter PJ',
    };

    let syncedPFTx: PFTransaction | undefined = undefined;

    if (autoSyncToPF && transactionType === 'expense') {
      syncedPFTx = {
        id: pfId,
        date: formattedDate,
        description: category === 'Lucros Isentos' ? 'Distribuição de Lucro Trimestral MEI' : 'Pró-labore',
        subDescription: 'Sincronizado da Conta Jurídica (PJ)',
        category: category === 'Lucros Isentos' ? 'Lucros Isentos' : 'Pró-labore',
        accountOrOrigin: 'Banco Inter PF',
        value: parsedAmount, // positive in PF
        status: 'Recebido',
        isFromPJ: true,
        syncedPJId: pjId,
      };
    }

    onAddPJTransaction(newPJTx, syncedPFTx);
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                MÓDULO CAIXA MEI
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Nova Transação da Empresa
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Insira o lançamento financeiro com rateio contábil.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Segmented Button: Receita vs Despesa */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => {
                setTransactionType('income');
                setDescription('Venda de Serviços / Consultoria');
                setCategory('Faturamento / Vendas');
                setAutoSyncToPF(false);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                transactionType === 'income'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
              <span>Receita / Entrada</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTransactionType('expense');
                setDescription('Retirada de Pró-labore - Lucas');
                setCategory('Pró-labore');
                setAutoSyncToPF(true);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                transactionType === 'expense'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-rose-600" />
              <span>Despesa / Saída (Ativo)</span>
            </button>
          </div>

          {/* Description & Value Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                DESCRIÇÃO
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Ex: Retirada de Pró-labore"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                VALOR (R$)
              </label>
              <input
                type="text"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0,00"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 text-right focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Category & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                  CATEGORIA
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                </label>
              </div>
              <select
                value={category}
                onChange={e => {
                  const val = e.target.value;
                  setCategory(val);
                  if (val === 'Pró-labore' || val === 'Lucros Isentos') {
                    setAutoSyncToPF(true);
                  }
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              >
                {transactionType === 'expense' ? (
                  <>
                    <option value="Pró-labore">👤 O seu Salário (Pró-labore)</option>
                    <option value="Lucros Isentos">💰 Distribuição de Lucros Isentos</option>
                    <option value="Fornecedores & Insumos">📦 Fornecedores & Mercadorias</option>
                    <option value="Impostos / DAS">🏛️ Impostos / DAS-SIMEI</option>
                    <option value="Marketing & Ads">📢 Marketing & Tráfego Pago</option>
                    <option value="Operacional">⚙️ Outras Despesas Operacionais</option>
                  </>
                ) : (
                  <>
                    <option value="Faturamento / Vendas">📈 Faturamento / Vendas</option>
                    <option value="Prestação de Serviços">💼 Prestação de Serviços de TI</option>
                    <option value="Rendimento PJ">🏦 Rendimento Conta PJ</option>
                  </>
                )}
              </select>

              {/* Informational link for Pró-labore */}
              {category === 'Pró-labore' && (
                <button
                  type="button"
                  onClick={onOpenProLaboreHelp}
                  className="mt-1 text-[11px] text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>O que é Pró-labore?</span>
                </button>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                DATA DO LANÇAMENTO
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Account selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
              CONTA PJ DE DÉBITO / CRÉDITO
            </label>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 font-bold text-[10px] flex items-center justify-center border border-orange-200">
                  PJ
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    {account}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Saldo disponível em caixa: <span className="font-semibold text-emerald-600">R$ 9.530,00</span>
                  </div>
                </div>
              </div>
              <Building className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* The Revolutionary Smart Sync Box (Exact match from Image 7) */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-blue-50/50 to-emerald-50/40 border border-blue-200/80 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSyncToPF}
                  onChange={e => setAutoSyncToPF(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 transition-all cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-900">
                  Lançar automaticamente como Receita na Visão Pessoal (PF)?
                </span>
              </label>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white tracking-wide flex items-center gap-1 shadow-xs">
                <Sparkles className="w-2.5 h-2.5" />
                SINCRONIZADO
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              <span className="font-semibold text-blue-800">✦ Sincronização inteligente:</span> Ao salvar, o sistema debita <span className="font-bold text-slate-900">{formattedCurrency}</span> da sua Empresa e cria simultaneamente uma entrada de <span className="font-semibold text-slate-900">&quot;{category === 'Lucros Isentos' ? 'Distribuição de Lucro MEI' : 'O seu Salário (Pró-labore)'}&quot;</span> no seu orçamento pessoal, mantendo tudo organizado sem retrabalho.
            </p>

            <div className="p-2 bg-white/80 rounded-lg border border-blue-100 flex items-center justify-between text-[11px] font-medium text-slate-700">
              <span className="flex items-center gap-1 text-slate-500">
                <RefreshCw className="w-3 h-3 text-blue-500 animate-spin-slow" />
                Fluxo Contábil:
              </span>
              <div className="flex items-center gap-1.5 font-bold">
                <span className="text-rose-600">PJ: -{formattedCurrency}</span>
                <span className="text-slate-400">➔</span>
                <span className="text-emerald-600">PF (Lucas): +{formattedCurrency}</span>
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer transform active:scale-98"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Confirmar e Sincronizar ({formattedCurrency})</span>
            </button>
          </div>
        </form>

        {/* Success confirmation toast overlay */}
        {showSuccessToast && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Transação Sincronizada com Sucesso!
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mt-1">
              Debitado na Conta PJ e creditado simultaneamente no orçamento de Finanças Pessoais (PF).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
