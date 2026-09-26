'use client';

import React, { useState } from 'react';
import { StockItem, ScreenView } from '@/types';
import {
  Package,
  AlertTriangle,
  Plus,
  Search,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Boxes,
  TrendingUp,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface InventoryScreenProps {
  stockItems: StockItem[];
  onNavigate: (screen: ScreenView) => void;
  onRestockItem: (id: string, amount: number) => void;
}

export function InventoryScreen({
  stockItems,
  onNavigate,
  onRestockItem,
}: InventoryScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'critical'>('all');
  const [selectedRestock, setSelectedRestock] = useState<StockItem | null>(null);
  const [restockAmount, setRestockAmount] = useState('10');

  const filteredItems = stockItems.filter(item => {
    const matches =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matches) return false;
    if (filter === 'critical') return item.quantity <= item.minQuantity;
    return true;
  });

  const criticalCount = stockItems.filter(i => i.quantity <= i.minQuantity).length;
  const totalStockValue = stockItems.reduce((acc, i) => acc + (i.quantity * i.costPrice), 0);

  const handleConfirmRestock = () => {
    if (!selectedRestock) return;
    const qty = parseInt(restockAmount, 10) || 5;
    onRestockItem(selectedRestock.id, qty);
    setSelectedRestock(null);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24">
      {/* Top Breadcrumb & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => onNavigate('pj')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para Visão Geral PJ</span>
          </button>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Controle de Estoque & Mercadorias
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoramento em tempo real de produtos físicos, insumos e margem de lucro.
          </p>
        </div>

        <button
          onClick={() => setSelectedRestock(stockItems[0])}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              VALOR EM ESTOQUE (CUSTO)
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            R$ {totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Patrimônio circulante em estoque</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              TOTAL DE ITENS CATALOGADOS
            </span>
            <Boxes className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            34 Itens
          </div>
          <span className="text-xs text-slate-500 mt-1 block">6 categorias ativas</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              ESTOQUE CRÍTICO / MÍNIMO
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">
            {criticalCount} Itens
          </div>
          <span className="text-xs text-amber-700 font-medium mt-1 block">
            Necessitam reposição imediata
          </span>
        </div>
      </div>

      {/* Critical Stock Alert Banner */}
      {criticalCount > 0 && (
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-900 block">
                Atenção ao estoque mínimo de segurança!
              </span>
              <p className="text-xs text-amber-800/80 mt-0.5">
                Cabo USB-C Trançado (restam 2 unidades) e SSD 480GB Kingston (resta 1 unidade) estão abaixo da reserva de contingência.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Table & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por produto, SKU ou categoria..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-64"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos os Itens ({stockItems.length})
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filter === 'critical' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Críticos ({criticalCount})
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">PRODUTO & SKU</th>
                <th className="py-3 px-5">CATEGORIA</th>
                <th className="py-3 px-5">QUANTIDADE</th>
                <th className="py-3 px-5 text-right">PREÇO CUSTO</th>
                <th className="py-3 px-5 text-right">PREÇO VENDA</th>
                <th className="py-3 px-5 text-right">MARGEM</th>
                <th className="py-3 px-5 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.map(item => {
                const isCrit = item.quantity <= item.minQuantity;
                const margin = (((item.sellPrice - item.costPrice) / item.sellPrice) * 100).toFixed(0);

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.sku}</div>
                    </td>

                    <td className="py-3.5 px-5 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <span className={`font-black text-sm ${isCrit ? 'text-rose-600' : 'text-slate-900'}`}>
                          {item.quantity} un
                        </span>
                        {isCrit && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">
                            Mínimo: {item.minQuantity}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-right font-medium text-slate-600">
                      R$ {item.costPrice.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-5 text-right font-bold text-slate-900">
                      R$ {item.sellPrice.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-5 text-right font-bold text-emerald-600">
                      {margin}%
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setSelectedRestock(item)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                      >
                        Repor Estoque
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {selectedRestock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Repor Estoque: {selectedRestock.name}
            </h3>
            <p className="text-xs text-slate-500">
              Estoque atual: <strong>{selectedRestock.quantity} un</strong> (Mínimo recomendado: {selectedRestock.minQuantity} un).
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Quantidade a Adicionar
              </label>
              <input
                type="number"
                min="1"
                value={restockAmount}
                onChange={e => setRestockAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedRestock(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmRestock}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Confirmar Reposição (+{restockAmount} un)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
