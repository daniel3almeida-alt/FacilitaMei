'use client';

import React, { useState } from 'react';
import { ScreenView } from '@/types';
import {
  FileText,
  ArrowLeft,
  CheckCircle2,
  Clock,
  QrCode,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

interface DasScreenProps {
  onNavigate: (screen: ScreenView) => void;
  onOpenDasModal: () => void;
  isDasPaid: boolean;
}

export function DasScreen({
  onNavigate,
  onOpenDasModal,
  isDasPaid,
}: DasScreenProps) {
  const [copied, setCopied] = useState(false);

  const months = [
    { name: 'Janeiro', value: 'R$ 71,60', status: 'Pago', date: '20/02/2024' },
    { name: 'Fevereiro', value: 'R$ 71,60', status: 'Pago', date: '20/03/2024' },
    { name: 'Março', value: 'R$ 71,60', status: 'Pago', date: '20/04/2024' },
    { name: 'Abril', value: 'R$ 75,90', status: 'Pago', date: '20/05/2024' },
    { name: 'Maio', value: 'R$ 75,90', status: 'Pago', date: '20/06/2024' },
    { name: 'Junho', value: 'R$ 75,90', status: 'Pago', date: '20/07/2024' },
    { name: 'Julho', value: 'R$ 75,90', status: 'Pago', date: '20/08/2024' },
    { name: 'Agosto', value: 'R$ 75,90', status: 'Pago', date: '20/09/2024' },
    { name: 'Setembro (Outubro)', value: 'R$ 75,90', status: isDasPaid ? 'Pago' : 'Aguardando Pagamento', date: '20/10/2024' },
    { name: 'Outubro', value: 'R$ 75,90', status: 'A Vencer', date: '20/11/2024' },
    { name: 'Novembro', value: 'R$ 75,90', status: 'A Vencer', date: '20/12/2024' },
    { name: 'Dezembro', value: 'R$ 75,90', status: 'A Vencer', date: '20/01/2025' },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24">
      {/* Top Header */}
      <div>
        <button
          onClick={() => onNavigate('pj')}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para Visão Geral PJ</span>
        </button>
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
          Relatórios Fiscais & Guia DAS-SIMEI
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Gestão de tributos mensais, regularidade previdenciária e monitoramento do limite anual de faturamento.
        </p>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Guia Atual */}
        <div className={`p-5 rounded-2xl border shadow-xs ${
          isDasPaid ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              GUIA DO MÊS ATUAL
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isDasPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'
            }`}>
              {isDasPaid ? 'Quitada' : 'Vence em 5 dias'}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            R$ 75,90
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Vencimento em 20/10/2024 • Tributação única simplificada
          </p>

          <button
            onClick={onOpenDasModal}
            className="w-full mt-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>{isDasPaid ? 'Ver Comprovante de Pagamento' : 'Gerar Pix / Pagar Guia'}</span>
          </button>
        </div>

        {/* Card 2: Teto MEI Anual */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                FATURAMENTO ACUMULADO 2024
              </span>
              <span className="text-xs font-black text-emerald-600">66.9%</span>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              R$ 54.200,00
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                style={{ width: '66.9%' }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
            <span>Limite Legal SIMEI:</span>
            <strong className="text-slate-800">R$ 81.000,00 / ano</strong>
          </div>
        </div>

        {/* Card 3: Margem Segura */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              SALDO ATÉ O TETO DO MEI
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-2">
              R$ 26.800,00
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Capacidade média de faturamento: <strong className="text-slate-800">R$ 8.933/mês</strong> nos próximos 3 meses sem desenquadramento.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-3 pt-2 border-t border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Situação Cadastral: 100% Regular</span>
          </div>
        </div>
      </div>

      {/* Annual Calendar Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Histórico das Guias Mensais DAS-SIMEI (Exercício 2024)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            CNPJ: 48.192.839/0001-92
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">MÊS DE REFERÊNCIA</th>
                <th className="py-3 px-5">VALOR TRIBUTÁRIO</th>
                <th className="py-3 px-5">DATA VENCIMENTO</th>
                <th className="py-3 px-5">STATUS FISCAL</th>
                <th className="py-3 px-5 text-right">COMPROVANTE / AÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {months.map(m => (
                <tr key={m.name} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-900">
                    {m.name}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-slate-700">
                    {m.value}
                  </td>
                  <td className="py-3.5 px-5 text-slate-500">
                    {m.date}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      m.status === 'Pago'
                        ? 'bg-emerald-100 text-emerald-800'
                        : m.status === 'Aguardando Pagamento'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {m.status === 'Pago' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {m.status === 'Aguardando Pagamento' && <Clock className="w-3 h-3 text-rose-600" />}
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {m.status === 'Pago' ? (
                      <button
                        onClick={onOpenDasModal}
                        className="text-emerald-700 hover:underline font-bold text-xs cursor-pointer"
                      >
                        Ver Quitação
                      </button>
                    ) : m.status === 'Aguardando Pagamento' ? (
                      <button
                        onClick={onOpenDasModal}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer"
                      >
                        Pagar Agora (Pix)
                      </button>
                    ) : (
                      <span className="text-slate-400">Emissão em breve</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
