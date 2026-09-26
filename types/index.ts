export type ScreenView = 'pj' | 'pf' | 'os' | 'inventory' | 'das' | 'gallery' | 'pos';

export type TransactionType = 'income' | 'expense';

export interface PJTransaction {
  id: string;
  date: string;
  description: string;
  subDescription?: string;
  category: string;
  type: TransactionType;
  value: number;
  status: 'Recebido' | 'Pago' | 'Em Estoque' | 'Faturado' | 'Creditado PF';
  isSyncedToPF?: boolean;
  syncTarget?: string;
  account?: string;
}

export interface PFTransaction {
  id: string;
  date: string;
  description: string;
  subDescription?: string;
  category: 'Moradia' | 'Alimentação' | 'Transporte' | 'Saúde' | 'Lazer' | 'Pró-labore' | 'Lucros Isentos' | 'Outros';
  accountOrOrigin: string;
  value: number; // positive for income, negative for expense
  status: 'Pago' | 'Recebido' | 'Pendente';
  isFromPJ?: boolean;
  syncedPJId?: string;
}

export interface StockItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  costPrice: number;
  sellPrice: number;
  status: 'critical' | 'warning' | 'normal';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'warning' | 'success' | 'info';
  read: boolean;
  actionScreen?: ScreenView;
}
