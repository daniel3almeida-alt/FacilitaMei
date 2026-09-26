'use client';

import React, { useState, useMemo } from 'react';
import { ScreenView, StockItem, PJTransaction } from '@/types';
import {
  Settings,
  DollarSign,
  Plus,
  Trash2,
  Receipt,
  ArrowLeft,
  Calendar,
  CreditCard,
  CheckCircle2,
  Printer,
  ShoppingBag,
  RotateCcw,
  Sparkles,
  Search,
  Percent,
  Banknote,
  FileSpreadsheet
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  type: 'produto' | 'servico';
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Installment {
  number: number;
  dueDate: string;
  amount: number;
}

interface PosPaymentScreenProps {
  stockItems: StockItem[];
  onNavigate: (screen: ScreenView) => void;
  onFinishSale: (newPJ: PJTransaction) => void;
}

export function PosPaymentScreen({
  stockItems,
  onNavigate,
  onFinishSale,
}: PosPaymentScreenProps) {
  // Active sub-tab matching the top buttons from screenshot
  const [activeTab, setActiveTab] = useState<'produtos' | 'pagamento'>('pagamento');

  // Cart / Items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'item-1',
      name: 'SSD 480GB Kingston A400 SATA 3',
      type: 'produto',
      sku: 'SSD-480-KNG',
      quantity: 1,
      unitPrice: 289.00,
      total: 289.00
    },
    {
      id: 'item-2',
      name: 'Formatação & Instalação de Sistema Operacional',
      type: 'servico',
      sku: 'SRV-TI-01',
      quantity: 1,
      unitPrice: 150.00,
      total: 150.00
    },
    {
      id: 'item-3',
      name: 'Cabo USB-C Trançado 2m Reforçado',
      type: 'produto',
      sku: 'CAB-USBC-2M',
      quantity: 2,
      unitPrice: 49.90,
      total: 99.80
    }
  ]);

  // Product search in 'Produtos e Serviços' tab
  const [productSearch, setProductSearch] = useState('');
  const [customServiceName, setCustomServiceName] = useState('');
  const [customServicePrice, setCustomServicePrice] = useState('');

  // Discount
  const [discount, setDiscount] = useState<number>(38.80);

  // Payment Tab States (matching exact screenshot)
  const [entryAmount, setEntryAmount] = useState<number>(100.00); // Entrada / Sinal
  const [paymentMethod1, setPaymentMethod1] = useState<string>('A VISTA');
  const [paidValue1, setPaidValue1] = useState<number>(100.00); // Valor Pago (1)

  const [paymentMethod2, setPaymentMethod2] = useState<string>('PIX');
  const [paidValue2, setPaidValue2] = useState<number>(0.00); // Valor Pago (2)

  // Installment (A Prazo / Carnê) Section (right side of screenshot)
  const [prazoDays, setPrazoDays] = useState<number>(30);
  const [firstDueDate, setFirstDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [numInstallments, setNumInstallments] = useState<number>(3);
  const [installments, setInstallments] = useState<Installment[]>([
    { number: 1, dueDate: '25/10/2024', amount: 133.33 },
    { number: 2, dueDate: '25/11/2024', amount: 133.33 },
    { number: 3, dueDate: '25/12/2024', amount: 133.34 },
  ]);

  // Success modal
  const [saleFinished, setSaleFinished] = useState(false);

  // Calculations
  const totalBruto = useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.total, 0);
  }, [cartItems]);

  const totalLiquido = useMemo(() => {
    return Math.max(0, totalBruto - discount);
  }, [totalBruto, discount]);

  const totalItens = useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cartItems]);

  const totalPago = useMemo(() => {
    const installmentTotal = installments.reduce((acc, curr) => acc + curr.amount, 0);
    return entryAmount + paidValue1 + paidValue2 + installmentTotal;
  }, [entryAmount, paidValue1, paidValue2, installments]);

  const troco = useMemo(() => {
    const directCashPaid = entryAmount + paidValue1 + paidValue2;
    if (installments.length > 0) {
      return 0;
    }
    return directCashPaid > totalLiquido ? directCashPaid - totalLiquido : 0;
  }, [entryAmount, paidValue1, paidValue2, totalLiquido, installments]);

  // Installment remaining balance
  const installmentBalance = useMemo(() => {
    return Math.max(0, totalLiquido - entryAmount - paidValue1 - paidValue2);
  }, [totalLiquido, entryAmount, paidValue1, paidValue2]);

  // Generate Installments Handler (matching button "Gerar Parcelas Carnê/A prazo")
  const handleGenerateInstallments = () => {
    const count = Math.max(1, numInstallments);
    const amountToSplit = installmentBalance > 0 ? installmentBalance : totalLiquido;
    const baseAmount = Math.floor((amountToSplit / count) * 100) / 100;
    const remainder = Math.round((amountToSplit - (baseAmount * count)) * 100) / 100;

    const baseDate = new Date(firstDueDate || new Date());
    const generated: Installment[] = [];

    for (let i = 1; i <= count; i++) {
      const dueDate = new Date(baseDate);
      dueDate.setDate(baseDate.getDate() + ((i - 1) * prazoDays));
      const d = String(dueDate.getDate()).padStart(2, '0');
      const m = String(dueDate.getMonth() + 1).padStart(2, '0');
      const y = dueDate.getFullYear();

      const installmentVal = i === count ? Number((baseAmount + remainder).toFixed(2)) : baseAmount;
      generated.push({
        number: i,
        dueDate: `${d}/${m}/${y}`,
        amount: installmentVal,
      });
    }

    setInstallments(generated);
  };

  const handleRemoveInstallment = (index: number) => {
    setInstallments(prev => prev.filter((_, idx) => idx !== index));
  };

  // Add stock product to cart
  const handleAddStockItem = (item: StockItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.sku === item.sku);
      if (existing) {
        return prev.map(i =>
          i.sku === item.sku
            ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.unitPrice }
            : i
        );
      }
      return [
        ...prev,
        {
          id: `item-${Date.now()}`,
          name: item.name,
          type: 'produto',
          sku: item.sku,
          quantity: 1,
          unitPrice: item.sellPrice,
          total: item.sellPrice,
        }
      ];
    });
  };

  // Add custom service to cart
  const handleAddCustomService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customServiceName) return;
    const price = parseFloat(customServicePrice.replace(',', '.')) || 100;
    setCartItems(prev => [
      ...prev,
      {
        id: `srv-${Date.now()}`,
        name: customServiceName,
        type: 'servico',
        sku: `SRV-${Math.floor(Math.random() * 900 + 100)}`,
        quantity: 1,
        unitPrice: price,
        total: price
      }
    ]);
    setCustomServiceName('');
    setCustomServicePrice('');
  };

  // Finish sale
  const handleCompleteSale = () => {
    const saleId = `venda-${Date.now()}`;
    const dateNow = new Date();
    const formattedDate = `${String(dateNow.getDate()).padStart(2, '0')}/${String(dateNow.getMonth() + 1).padStart(2, '0')}/${dateNow.getFullYear()}`;

    const itemsSummary = cartItems.map(i => `${i.quantity}x ${i.name}`).join(', ');

    const newTx: PJTransaction = {
      id: saleId,
      date: formattedDate,
      description: `Venda PDV: ${cartItems[0]?.name || 'Produtos/Serviços'}${cartItems.length > 1 ? ` (+${cartItems.length - 1} itens)` : ''}`,
      subDescription: `Forma: ${paymentMethod1}${installments.length > 0 ? ` + ${installments.length}x Carnê` : ''} • NF-e/Recibo #${Math.floor(Math.random() * 9000 + 1000)}`,
      category: 'Faturamento / Vendas',
      type: 'income',
      value: totalLiquido,
      status: 'Recebido',
      account: 'Banco Inter PJ'
    };

    onFinishSale(newTx);
    setSaleFinished(true);
  };

  return (
    <div className="p-3 lg:p-6 max-w-7xl mx-auto space-y-4 pb-24 font-sans text-slate-800">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
        <div>
          <button
            onClick={() => onNavigate('pj')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para Menu Principal / Visão PJ</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Ponto de Venda & Pagamento (PDV MEI)</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
              Módulo Frente de Caixa
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Emissão de vendas com rateio à vista, entrada/sinal e geração de carnê a prazo com baixa contábil automática.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCartItems([]);
              setInstallments([]);
              setDiscount(0);
              setEntryAmount(0);
              setPaidValue1(0);
              setPaidValue2(0);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Limpar Venda</span>
          </button>

          <button
            type="button"
            onClick={handleCompleteSale}
            disabled={cartItems.length === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all shadow-xs cursor-pointer ${
              cartItems.length === 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Finalizar Venda (R$ {totalLiquido.toFixed(2)})</span>
          </button>
        </div>
      </div>

      {/* WINDOW CONTAINER REPRODUCING THE USER SCREENSHOT */}
      <div className="bg-[#f2f4f7] rounded-xl border border-slate-300 shadow-md overflow-hidden">
        
        {/* EXACT TAB BAR FROM SCREENSHOT */}
        <div className="flex items-center border-b border-slate-300 bg-[#e4e7eb] px-2 pt-2 gap-1 select-none">
          <button
            type="button"
            onClick={() => setActiveTab('produtos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-bold transition-colors cursor-pointer border-t border-l border-r ${
              activeTab === 'produtos'
                ? 'bg-white text-slate-900 border-slate-300 shadow-xs translate-y-[1px]'
                : 'bg-[#d8dce2] text-slate-600 border-transparent hover:bg-slate-200'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span>Produtos e Serviços</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
              {cartItems.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pagamento')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-bold transition-colors cursor-pointer border-t border-l border-r ${
              activeTab === 'pagamento'
                ? 'bg-white text-slate-900 border-slate-300 shadow-xs translate-y-[1px]'
                : 'bg-[#d8dce2] text-slate-600 border-transparent hover:bg-slate-200'
            }`}
          >
            <div className="w-4 h-4 rounded-xs border border-slate-800 flex items-center justify-center font-bold text-[11px] leading-none">
              $
            </div>
            <span>Pagamento</span>
          </button>
        </div>

        {/* TAB 1: PRODUTOS E SERVIÇOS */}
        {activeTab === 'produtos' && (
          <div className="p-4 bg-white space-y-4 animate-in fade-in duration-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* Left 2 Cols: Items in Cart */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    <span>Itens Lançados no Pedido / Venda</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    {totalItens} unidades • Total: <strong className="text-slate-900">R$ {totalBruto.toFixed(2)}</strong>
                  </span>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Item / Descrição</th>
                        <th className="py-2.5 px-3">Tipo</th>
                        <th className="py-2.5 px-3 text-center">Qtd</th>
                        <th className="py-2.5 px-3 text-right">Unitário</th>
                        <th className="py-2.5 px-3 text-right">Total</th>
                        <th className="py-2.5 px-3 text-center">Excluir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cartItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-800 block">{item.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{item.sku}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              item.type === 'produto' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="inline-flex items-center border border-slate-200 rounded">
                              <button
                                type="button"
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    setCartItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: it.quantity - 1, total: (it.quantity - 1) * it.unitPrice } : it));
                                  } else {
                                    setCartItems(prev => prev.filter((_, i) => i !== idx));
                                  }
                                }}
                                className="px-2 py-0.5 text-slate-600 hover:bg-slate-100"
                              >
                                -
                              </button>
                              <span className="px-2 font-bold">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setCartItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: it.quantity + 1, total: (it.quantity + 1) * it.unitPrice } : it));
                                }}
                                className="px-2 py-0.5 text-slate-600 hover:bg-slate-100"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium text-slate-600">
                            R$ {item.unitPrice.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                            R$ {item.total.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => setCartItems(prev => prev.filter((_, i) => i !== idx))}
                              className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                              title="Remover item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('pagamento')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <span>Prosseguir para Pagamento ($) →</span>
                  </button>
                </div>
              </div>

              {/* Right Col: Quick Catalog of Products & Custom Service */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Adicionar do Estoque PJ</span>
                  </h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {stockItems.map(st => (
                      <div
                        key={st.id}
                        onClick={() => handleAddStockItem(st)}
                        className="p-2 bg-white rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 flex items-center justify-between text-xs cursor-pointer transition-all"
                      >
                        <div>
                          <div className="font-semibold text-slate-800 line-clamp-1">{st.name}</div>
                          <div className="text-[10px] text-slate-400">Estoque: {st.quantity} un • {st.sku}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-slate-900">R$ {st.sellPrice.toFixed(2)}</span>
                          <span className="text-[10px] text-emerald-600 font-bold block">+ Incluir</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Service Form */}
                <form onSubmit={handleAddCustomService} className="pt-2 border-t border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900">Adicionar Serviço MEI</h4>
                  <input
                    type="text"
                    placeholder="Descrição do serviço..."
                    value={customServiceName}
                    onChange={e => setCustomServiceName(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Valor (R$)"
                      value={customServicePrice}
                      onChange={e => setCustomServicePrice(e.target.value)}
                      className="w-1/2 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      className="w-1/2 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-bold transition-colors cursor-pointer"
                    >
                      + Incluir Serviço
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PAGAMENTO (THE EXACT SCREENSHOT REPLICATED WITH HIGH FIDELITY) */}
        {activeTab === 'pagamento' && (
          <div className="p-4 bg-white space-y-4 animate-in fade-in duration-100">
            
            {/* MAIN TWO-COLUMN LAYOUT EXACTLY MATCHING USER SCREENSHOT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* LEFT COLUMN: ENTRADA / SINAL E FORMAS DE PAGAMENTO À VISTA */}
              <div className="lg:col-span-4 space-y-3.5 pr-0 lg:pr-3 lg:border-r lg:border-slate-300">
                
                {/* Row 1: Button "Lançar Entrada" + "Entrada/Sinal" box */}
                <div className="flex items-center gap-3">
                  {/* Button: Lançar Entrada */}
                  <button
                    type="button"
                    onClick={() => {
                      const amount = prompt('Digite o valor de Entrada / Sinal (R$):', entryAmount.toString());
                      if (amount !== null) {
                        const parsed = parseFloat(amount.replace(',', '.')) || 0;
                        setEntryAmount(parsed);
                        setPaidValue1(parsed);
                      }
                    }}
                    className="flex-1 flex flex-col items-center justify-center p-2.5 bg-[#e4e7eb] hover:bg-[#d8dce2] active:bg-[#c9ced6] border border-slate-400 rounded text-slate-800 font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center mb-0.5">
                      <span className="text-[11px] font-black leading-none">$</span>
                    </div>
                    <span>Lançar Entrada</span>
                  </button>

                  {/* Entrada/Sinal Display Box */}
                  <div className="w-40 border border-slate-400 bg-[#eef1f5] rounded text-center p-1.5">
                    <span className="text-[11px] font-bold text-slate-800 block">
                      Entrada/Sinal
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={entryAmount}
                      onChange={e => {
                        const val = parseFloat(e.target.value) || 0;
                        setEntryAmount(val);
                        setPaidValue1(val);
                      }}
                      className="w-full text-center font-bold text-slate-900 text-sm bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Row 2: Forma de Pagamento (1) + Valor Pago (1) */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-slate-400 bg-[#eef1f5] rounded p-1.5">
                    <label className="block text-[11px] font-bold text-slate-800 mb-0.5">
                      Forma de Pagamento (1)
                    </label>
                    <select
                      value={paymentMethod1}
                      onChange={e => setPaymentMethod1(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      <option value="A VISTA">A VISTA</option>
                      <option value="DINHEIRO">DINHEIRO</option>
                      <option value="PIX">PIX</option>
                      <option value="CARTÃO DE CRÉDITO">CARTÃO DE CRÉDITO</option>
                      <option value="CARTÃO DE DÉBITO">CARTÃO DE DÉBITO</option>
                      <option value="BOLETO BANCÁRIO">BOLETO BANCÁRIO</option>
                    </select>
                  </div>

                  <div className="border border-slate-400 bg-[#eef1f5] rounded p-1.5 text-center">
                    <label className="block text-[11px] font-bold text-slate-800 mb-0.5">
                      Valor Pago (1)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={paidValue1}
                      onChange={e => setPaidValue1(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-xs font-bold text-slate-900 text-center focus:outline-none"
                    />
                  </div>
                </div>

                {/* Row 3: Forma de Pagamento (2) + Valor Pago (2) */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-slate-400 bg-[#eef1f5] rounded p-1.5">
                    <label className="block text-[11px] font-bold text-slate-800 mb-0.5">
                      Forma de Pagamento (2)
                    </label>
                    <select
                      value={paymentMethod2}
                      onChange={e => setPaymentMethod2(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      <option value="NENHUMA">- NENHUMA -</option>
                      <option value="PIX">PIX</option>
                      <option value="CARTÃO DE CRÉDITO">CARTÃO DE CRÉDITO</option>
                      <option value="CARTÃO DE DÉBITO">CARTÃO DE DÉBITO</option>
                      <option value="DINHEIRO">DINHEIRO</option>
                      <option value="BOLETO BANCÁRIO">BOLETO BANCÁRIO</option>
                    </select>
                  </div>

                  <div className="border border-slate-400 bg-[#eef1f5] rounded p-1.5 text-center">
                    <label className="block text-[11px] font-bold text-slate-800 mb-0.5">
                      Valor Pago(2)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={paidValue2}
                      onChange={e => setPaidValue2(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-xs font-bold text-slate-900 text-center focus:outline-none"
                    />
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: CONDIÇÃO SOMENTE PARA PAGAMENTO A PRAZO (EXACT BOX FROM SCREENSHOT) */}
              <div className="lg:col-span-8 border border-emerald-700/60 rounded p-3 bg-white space-y-3">
                
                {/* Red Title Header */}
                <div className="text-center font-bold text-red-600 text-xs tracking-wide">
                  Condição somente para pagamento a prazo
                </div>

                {/* Form Row with 4 inputs and the Action Button on the Right */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  
                  {/* The 4 Fields */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 flex-1">
                    
                    {/* Prazo */}
                    <div className="border border-slate-400 bg-[#eef1f5] rounded p-1 text-center">
                      <span className="block text-[11px] font-bold text-slate-700 mb-0.5">Prazo</span>
                      <input
                        type="number"
                        value={prazoDays}
                        onChange={e => setPrazoDays(parseInt(e.target.value) || 30)}
                        className="w-full text-center font-bold text-slate-800 text-xs bg-white border border-slate-300 rounded py-0.5 focus:outline-none"
                      />
                    </div>

                    {/* Data 1ª Parcela */}
                    <div className="border border-slate-400 bg-[#eef1f5] rounded p-1 text-center">
                      <span className="block text-[11px] font-bold text-slate-700 mb-0.5">Data 1ª Parcela</span>
                      <input
                        type="date"
                        value={firstDueDate}
                        onChange={e => setFirstDueDate(e.target.value)}
                        className="w-full text-center text-[11px] font-bold text-slate-800 bg-white border border-slate-300 rounded py-0.5 focus:outline-none"
                      />
                    </div>

                    {/* Qtde/Parcelas */}
                    <div className="border border-slate-400 bg-[#eef1f5] rounded p-1 text-center">
                      <span className="block text-[11px] font-bold text-slate-700 mb-0.5">Qtde/Parcelas</span>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={numInstallments}
                        onChange={e => setNumInstallments(parseInt(e.target.value) || 1)}
                        className="w-full text-center font-bold text-slate-800 text-xs bg-white border border-slate-300 rounded py-0.5 focus:outline-none"
                      />
                    </div>

                    {/* Valor Total a pagar */}
                    <div className="border border-slate-400 bg-[#eef1f5] rounded p-1 text-center">
                      <span className="block text-[11px] font-bold text-slate-700 mb-0.5">Valor Total a pagar</span>
                      <div className="w-full text-center font-bold text-slate-900 text-xs py-1">
                        {installmentBalance.toFixed(2)}
                      </div>
                    </div>

                  </div>

                  {/* Button "Gerar Parcelas Carnê/A prazo" */}
                  <button
                    type="button"
                    onClick={handleGenerateInstallments}
                    className="sm:w-44 flex flex-col items-center justify-center p-2.5 bg-[#f0f2f5] hover:bg-[#e4e7eb] active:bg-[#d8dce2] border border-slate-400 rounded text-slate-700 font-bold text-[11px] text-center shadow-xs transition-colors cursor-pointer"
                  >
                    <Receipt className="w-4 h-4 text-slate-500 mb-1" />
                    <span>Gerar Parcelas Carnê/A prazo</span>
                  </button>

                </div>

                {/* Installments Table */}
                <div className="border border-slate-300 rounded overflow-hidden">
                  <div className="grid grid-cols-12 bg-[#eef1f5] border-b border-slate-300 text-center font-bold text-xs py-1 text-slate-800">
                    <div className="col-span-3 border-r border-slate-300">Parcela</div>
                    <div className="col-span-4 border-r border-slate-300">Vencimento</div>
                    <div className="col-span-4 border-r border-slate-300">Valor Parcela</div>
                    <div className="col-span-1 text-center">
                      <span className="text-red-700 text-sm">❌</span>
                    </div>
                  </div>

                  <div className="max-h-36 overflow-y-auto divide-y divide-slate-200">
                    {installments.length === 0 ? (
                      <div className="py-3 text-center text-xs text-slate-400 font-medium">
                        Nenhuma parcela gerada. Clique em &quot;Gerar Parcelas Carnê/A prazo&quot; para calcular.
                      </div>
                    ) : (
                      installments.map((inst, index) => (
                        <div key={index} className="grid grid-cols-12 text-center text-xs py-1.5 items-center hover:bg-slate-50">
                          <div className="col-span-3 font-semibold text-slate-700 border-r border-slate-200">
                            {inst.number}ª Parcela
                          </div>
                          <div className="col-span-4 font-mono font-medium text-slate-800 border-r border-slate-200">
                            {inst.dueDate}
                          </div>
                          <div className="col-span-4 font-bold text-slate-900 border-r border-slate-200">
                            R$ {inst.amount.toFixed(2)}
                          </div>
                          <div className="col-span-1 flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveInstallment(index)}
                              className="text-red-600 hover:text-red-800 cursor-pointer text-xs"
                              title="Excluir parcela"
                            >
                              ❌
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* BOTTOM SUMMARY ROW (EXACT LAYOUT AND COLORS FROM USER SCREENSHOT) */}
            <div className="pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-6 border border-slate-400 bg-[#e4e7eb] divide-x divide-slate-400 rounded overflow-hidden">
                
                {/* 1: TOTAL BRUTO */}
                <div className="p-2 text-center bg-white flex flex-col justify-between">
                  <span className="block font-black text-xs text-slate-900 tracking-wide uppercase">
                    TOTAL BRUTO
                  </span>
                  <span className="font-bold text-sm text-slate-800 mt-1">
                    R$ {totalBruto.toFixed(2)}
                  </span>
                </div>

                {/* 2: DESCONTO (Text in blue) */}
                <div className="p-2 text-center bg-white flex flex-col justify-between">
                  <span className="block font-black text-xs text-slate-900 tracking-wide uppercase">
                    DESCONTO
                  </span>
                  <div className="mt-1 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600 mr-1">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={discount}
                      onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                      className="w-20 text-center font-bold text-blue-600 text-sm focus:outline-none border-b border-blue-200"
                    />
                  </div>
                </div>

                {/* 3: TOTAL LIQUIDO (Yellow background, Bold Red Text) */}
                <div className="p-2 text-center bg-[#ffff99] flex flex-col justify-between border-l-2 border-r-2 border-amber-400">
                  <span className="block font-black text-xs text-slate-900 tracking-wide uppercase">
                    TOTAL LIQUIDO
                  </span>
                  <span className="font-black text-base text-red-600 mt-1">
                    R$ {totalLiquido.toFixed(2)}
                  </span>
                </div>

                {/* 4: TOTAL ITENS */}
                <div className="p-2 text-center bg-white flex flex-col justify-between">
                  <span className="block font-black text-xs text-slate-900 tracking-wide uppercase">
                    TOTAL ITENS
                  </span>
                  <span className="font-bold text-base text-slate-800 mt-1">
                    {totalItens}
                  </span>
                </div>

                {/* 5: TOTAL PAGO */}
                <div className="p-2 text-center bg-white flex flex-col justify-between">
                  <span className="block font-black text-xs text-slate-900 tracking-wide uppercase">
                    TOTAL PAGO
                  </span>
                  <span className="font-bold text-sm text-slate-900 mt-1">
                    R$ {totalPago.toFixed(2)}
                  </span>
                </div>

                {/* 6: TROCO (Light green background) */}
                <div className="p-2 text-center bg-[#d4edda] flex flex-col justify-between">
                  <span className="block font-black text-xs text-slate-900 tracking-wide uppercase">
                    TROCO
                  </span>
                  <span className="font-black text-sm text-emerald-800 mt-1">
                    R$ {troco.toFixed(2)}
                  </span>
                </div>

              </div>
            </div>

            {/* ACTION BAR AT BOTTOM */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Integração de Caixa MEI: O valor final alimenta o Faturamento da Visão Geral PJ</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Imprimindo Carnê / Comprovante Fiscal para ${installments.length} parcelas.`)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Imprimir Carnê / Cupom</span>
                </button>

                <button
                  type="button"
                  onClick={handleCompleteSale}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finalizar & Gravar Venda (R$ {totalLiquido.toFixed(2)})</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* SUCCESS CONFIRMATION MODAL */}
      {saleFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Venda Concluída com Sucesso!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Lançamento registrado no Caixa da Empresa PJ. O faturamento e o teto anual do MEI foram atualizados.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 text-left border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Líquido:</span>
                <span className="font-bold text-slate-900">R$ {totalLiquido.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Condição:</span>
                <span className="font-semibold text-emerald-700">
                  {entryAmount > 0 ? `Entrada R$ ${entryAmount.toFixed(2)} + ` : ''}
                  {installments.length > 0 ? `${installments.length}x a prazo` : paymentMethod1}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Módulo Contábil:</span>
                <span className="font-semibold text-blue-600">Faturamento SIMEI</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSaleFinished(false);
                  onNavigate('pj');
                }}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Ir para Visão Empresa (PJ)
              </button>
              <button
                type="button"
                onClick={() => setSaleFinished(false)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Nova Venda
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
