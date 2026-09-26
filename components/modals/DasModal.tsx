'use client';

import React, { useState } from 'react';
import { X, Copy, Check, QrCode, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

interface DasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayDas: () => void;
  isPaid: boolean;
}

export function DasModal({ isOpen, onClose, onPayDas, isPaid }: DasModalProps) {
  const [copied, setCopied] = useState(false);
  const pixCode = "00020126580014br.gov.bcb.pix0136d8b37e89-9a2c-47b6-9764-a633cf481928520400005303986540575.905802BR5925RECEITA FEDERAL DO BRASIL6009SAO PAULO62070503***6304E8A2";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Guia DAS-SIMEI Oficial</h3>
              <p className="text-[11px] text-slate-500">Competência: Setembro/2024 • Vencimento: 20/10/2024</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status Badge */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            isPaid ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-center gap-2">
              {isPaid ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <ShieldCheck className="w-5 h-5 text-amber-600" />}
              <div>
                <span className="text-xs font-bold block">{isPaid ? 'Guia Paga com Sucesso' : 'Aguardando Pagamento (Vence em 5 dias)'}</span>
                <span className="text-[11px] opacity-80">CNPJ: 48.192.839/0001-92 • MEI Prestador & Comércio</span>
              </div>
            </div>
            <span className="text-sm font-black">R$ 75,90</span>
          </div>

          {/* Breakdown */}
          <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Detalhamento dos Tributos</div>
            <div className="flex justify-between text-slate-600">
              <span>INSS Previdenciário (5% do S.M.):</span>
              <span className="font-semibold text-slate-800">R$ 70,60</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>ICMS Estadual (Comércio):</span>
              <span className="font-semibold text-slate-800">R$ 1,00</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>ISS Municipal (Serviços):</span>
              <span className="font-semibold text-slate-800">R$ 5,00</span>
            </div>
          </div>

          {/* Simulated QR Code for Pix */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <div className="w-32 h-32 bg-white p-2 rounded-lg shadow-xs border border-slate-200 flex items-center justify-center relative">
              <QrCode className="w-28 h-28 text-slate-800" />
            </div>
            <span className="text-[11px] font-medium text-slate-500 mt-2">
              Escaneie com o app do seu Banco PJ (Inter)
            </span>
          </div>

          {/* Pix Copia e Cola */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
              Código Pix Copia e Cola
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={pixCode}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-600 truncate focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Fechar
            </button>
            {!isPaid && (
              <button
                type="button"
                onClick={() => {
                  onPayDas();
                  onClose();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirmar Pagamento (R$ 75,90)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
