'use client';

import React from 'react';
import { X, HelpCircle, Shield, Check, Info } from 'lucide-react';

interface ProLaboreInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProLaboreInfoModal({ isOpen, onClose }: ProLaboreInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-300" />
            <h3 className="text-base font-bold">O que é Pró-labore no MEI?</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              O <strong>Pró-labore</strong> é a remuneração formal pelo trabalho que o titular exerce no negócio. Ele se diferencia da simples divisão de lucros e é essencial para manter a regularidade perante a Receita Federal.
            </p>
          </div>

          <div className="space-y-3">
            <div className="border border-slate-200 rounded-xl p-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1 text-sm">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>1. Pró-labore Oficial (1 Salário Mínimo)</span>
              </div>
              <p className="text-slate-600">
                Como MEI, a contribuição previdenciária de 5% já está incluída na sua guia mensal DAS-SIMEI (R$ 70,60). Esse valor garante sua cobertura do INSS (aposentadoria por idade, auxílio por incapacidade temporária, salário-maternidade).
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1 text-sm">
                <Check className="w-4 h-4 text-blue-600" />
                <span>2. Distribuição de Lucros Isenta</span>
              </div>
              <p className="text-slate-600">
                Todo valor que você transfere além do pró-labore, após pagar os custos da empresa e a DAS, pode ser retirado como <strong>Distribuição de Lucros Isenta de Imposto de Renda</strong>, sem incidência de novos impostos na Pessoa Física.
              </p>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900">
            <strong>Dica do FacilitaMei:</strong> Nossa sincronização automática debita a saída da conta PJ e alimenta diretamente a sua renda na Visão PF, gerando o comprovante necessário para declarar seu IRPF com tranquilidade.
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
