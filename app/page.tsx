'use client';

import React, { useState } from 'react';
import { ScreenView, PJTransaction, PFTransaction, StockItem, NotificationItem } from '@/types';
import {
  INITIAL_PJ_TRANSACTIONS,
  INITIAL_PF_TRANSACTIONS,
  INITIAL_STOCK_ITEMS,
  INITIAL_NOTIFICATIONS
} from '@/lib/initialData';
import { TopNavbar } from '@/components/TopNavbar';
import { ScreenSwitcherDock } from '@/components/ScreenSwitcherDock';
import { CompanyScreen } from '@/components/screens/CompanyScreen';
import { PersonalScreen } from '@/components/screens/PersonalScreen';
import { InventoryScreen } from '@/components/screens/InventoryScreen';
import { DasScreen } from '@/components/screens/DasScreen';
import { ScreenFlowGallery } from '@/components/screens/ScreenFlowGallery';
import { PosPaymentScreen } from '@/components/screens/PosPaymentScreen';
import { ServiceOrderScreen } from '@/components/screens/ServiceOrderScreen';
import { NewTransactionModal } from '@/components/modals/NewTransactionModal';
import { DasModal } from '@/components/modals/DasModal';
import { ProLaboreInfoModal } from '@/components/modals/ProLaboreInfoModal';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('pj');
  const [pjTransactions, setPjTransactions] = useState<PJTransaction[]>(INITIAL_PJ_TRANSACTIONS);
  const [pfTransactions, setPfTransactions] = useState<PFTransaction[]>(INITIAL_PF_TRANSACTIONS);
  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCK_ITEMS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isDasPaid, setIsDasPaid] = useState<boolean>(false);

  // Modals state
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);
  const [isDasModalOpen, setIsDasModalOpen] = useState(false);
  const [isProLaboreHelpOpen, setIsProLaboreHelpOpen] = useState(false);
  const [syncToastMessage, setSyncToastMessage] = useState<{ title: string; subtitle: string; targetScreen?: ScreenView } | null>(null);

  // Handler for new PJ transaction with optional synchronized PF transaction
  const handleAddPJTransaction = (newPJ: PJTransaction, syncedPF?: PFTransaction) => {
    setPjTransactions(prev => [newPJ, ...prev]);

    if (syncedPF) {
      setPfTransactions(prev => [syncedPF, ...prev]);

      // Add a notification
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Sincronização PJ ➔ PF Efetuada',
        message: `Entrada de R$ ${syncedPF.value.toFixed(2)} lançada automaticamente na sua Visão Pessoal.`,
        time: 'Agora mesmo',
        type: 'success',
        read: false,
        actionScreen: 'pf'
      };
      setNotifications(prev => [newNotif, ...prev]);

      // Show toast
      setSyncToastMessage({
        title: 'Sincronização Inteligente Concluída!',
        subtitle: `R$ ${newPJ.value.toFixed(2)} debitados na PJ e creditados como "${syncedPF.category}" na Visão PF.`,
        targetScreen: 'pf'
      });
      setTimeout(() => setSyncToastMessage(null), 5000);
    }
  };

  // Handler for paying DAS
  const handlePayDas = () => {
    setIsDasPaid(true);

    const dasTx: PJTransaction = {
      id: `pj-das-${Date.now()}`,
      date: '15/10/2024',
      description: 'Pagamento Guia DAS-SIMEI (Outubro)',
      subDescription: 'Receita Federal do Brasil • Autenticação Pix #9910.12',
      category: 'Impostos / DAS',
      type: 'expense',
      value: 75.90,
      status: 'Pago',
      account: 'Banco Inter PJ'
    };

    setPjTransactions(prev => [dasTx, ...prev]);

    setSyncToastMessage({
      title: 'Guia DAS Paga com Sucesso!',
      subtitle: 'Comprovante oficial emitido e despesa registrada na conta PJ.',
      targetScreen: 'das'
    });
    setTimeout(() => setSyncToastMessage(null), 4000);
  };

  // Handler for restocking
  const handleRestockItem = (id: string, amount: number) => {
    setStockItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + amount,
              status: (item.quantity + amount) > item.minQuantity ? 'normal' : 'warning',
            }
          : item
      )
    );

    const targetItem = stockItems.find(i => i.id === id);
    if (targetItem) {
      setSyncToastMessage({
        title: 'Estoque Atualizado!',
        subtitle: `Adicionadas +${amount} unidades de "${targetItem.name}".`,
        targetScreen: 'inventory'
      });
      setTimeout(() => setSyncToastMessage(null), 4000);
    }
  };

  // Handler for finishing sale from PDV
  const handleFinishSale = (newPJ: PJTransaction) => {
    setPjTransactions(prev => [newPJ, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Venda Concluída no PDV',
      message: `${newPJ.description} no valor de R$ ${newPJ.value.toFixed(2)} lançada na receita da empresa.`,
      time: 'Agora mesmo',
      type: 'success',
      read: false,
      actionScreen: 'pj'
    };
    setNotifications(prev => [newNotif, ...prev]);

    setSyncToastMessage({
      title: 'Venda Lançada no Caixa PJ!',
      subtitle: `Entrada de R$ ${newPJ.value.toFixed(2)} computada no faturamento SIMEI da empresa.`,
      targetScreen: 'pj'
    });
    setTimeout(() => setSyncToastMessage(null), 5000);
  };

  // Handler for finishing service order (OS)
  const handleFinishServiceOrder = (newPJ: PJTransaction) => {
    setPjTransactions(prev => [newPJ, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Ordem de Serviço #1196 Finalizada',
      message: `${newPJ.description} no valor de R$ ${newPJ.value.toFixed(2)} baixada no Caixa PJ.`,
      time: 'Agora mesmo',
      type: 'success',
      read: false,
      actionScreen: 'pj'
    };
    setNotifications(prev => [newNotif, ...prev]);

    setSyncToastMessage({
      title: 'OS Baixada no Caixa da Empresa!',
      subtitle: `Receita de R$ ${newPJ.value.toFixed(2)} lançada na conta PJ e no teto SIMEI.`,
      targetScreen: 'pj'
    });
    setTimeout(() => setSyncToastMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navbar with live switcher */}
      <TopNavbar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        notifications={notifications}
        onOpenNewTransaction={() => setIsNewTxModalOpen(true)}
        onOpenScreenGallery={() => setCurrentScreen('gallery')}
      />

      {/* Synchronized Feedback Toast */}
      {syncToastMessage && (
        <div className="fixed top-16 right-4 sm:right-8 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700 max-w-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold">{syncToastMessage.title}</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {syncToastMessage.subtitle}
              </p>
              {syncToastMessage.targetScreen && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentScreen(syncToastMessage.targetScreen!);
                    setSyncToastMessage(null);
                  }}
                  className="mt-1 text-[11px] text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Conferir na tela correspondente</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Screen Content with Fluid Transitions */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {currentScreen === 'pj' && (
            <motion.div
              key="screen-pj"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <CompanyScreen
                transactions={pjTransactions}
                onNavigate={setCurrentScreen}
                onOpenNewTransaction={() => setIsNewTxModalOpen(true)}
                onOpenDasModal={() => setIsDasModalOpen(true)}
                isDasPaid={isDasPaid}
              />
            </motion.div>
          )}

          {currentScreen === 'pf' && (
            <motion.div
              key="screen-pf"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <PersonalScreen
                transactions={pfTransactions}
                onNavigate={setCurrentScreen}
                onOpenNewTransaction={() => setIsNewTxModalOpen(true)}
                onOpenProLaboreHelp={() => setIsProLaboreHelpOpen(true)}
              />
            </motion.div>
          )}

          {currentScreen === 'os' && (
            <motion.div
              key="screen-os"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <ServiceOrderScreen
                stockItems={stockItems}
                onNavigate={setCurrentScreen}
                onFinishOrder={handleFinishServiceOrder}
              />
            </motion.div>
          )}

          {currentScreen === 'pos' && (
            <motion.div
              key="screen-pos"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <PosPaymentScreen
                stockItems={stockItems}
                onNavigate={setCurrentScreen}
                onFinishSale={handleFinishSale}
              />
            </motion.div>
          )}

          {currentScreen === 'inventory' && (
            <motion.div
              key="screen-inventory"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <InventoryScreen
                stockItems={stockItems}
                onNavigate={setCurrentScreen}
                onRestockItem={handleRestockItem}
              />
            </motion.div>
          )}

          {currentScreen === 'das' && (
            <motion.div
              key="screen-das"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <DasScreen
                onNavigate={setCurrentScreen}
                onOpenDasModal={() => setIsDasModalOpen(true)}
                isDasPaid={isDasPaid}
              />
            </motion.div>
          )}

          {currentScreen === 'gallery' && (
            <motion.div
              key="screen-gallery"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <ScreenFlowGallery
                onNavigate={setCurrentScreen}
                onOpenNewTransaction={() => setIsNewTxModalOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Fluid Screen Switcher Dock */}
      <ScreenSwitcherDock
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onOpenNewTransaction={() => setIsNewTxModalOpen(true)}
        onOpenScreenGallery={() => setCurrentScreen('gallery')}
      />

      {/* Modals */}
      <NewTransactionModal
        isOpen={isNewTxModalOpen}
        onClose={() => setIsNewTxModalOpen(false)}
        onAddPJTransaction={handleAddPJTransaction}
        onOpenPFView={() => setCurrentScreen('pf')}
        onOpenProLaboreHelp={() => setIsProLaboreHelpOpen(true)}
      />

      <DasModal
        isOpen={isDasModalOpen}
        onClose={() => setIsDasModalOpen(false)}
        onPayDas={handlePayDas}
        isPaid={isDasPaid}
      />

      <ProLaboreInfoModal
        isOpen={isProLaboreHelpOpen}
        onClose={() => setIsProLaboreHelpOpen(false)}
      />

    </div>
  );
}
