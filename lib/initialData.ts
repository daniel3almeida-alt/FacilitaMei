import { PJTransaction, PFTransaction, StockItem, NotificationItem } from '@/types';

export const INITIAL_PJ_TRANSACTIONS: PJTransaction[] = [
  {
    id: 'pj-1',
    date: '14/10/2024',
    description: 'Venda de Consultoria de TI',
    subDescription: 'Cliente: Nexus Engenharia LTDA (NF-e #0892)',
    category: 'Faturamento / Vendas',
    type: 'income',
    value: 3500.00,
    status: 'Recebido',
    account: 'Banco Inter PJ'
  },
  {
    id: 'pj-2',
    date: '12/10/2024',
    description: 'Pagamento DAS-SIMEI (Setembro)',
    subDescription: 'Guia Oficial da Receita Federal • Aut: 8901.99',
    category: 'Impostos / DAS',
    type: 'expense',
    value: 75.90,
    status: 'Pago',
    account: 'Banco Inter PJ'
  },
  {
    id: 'pj-3',
    date: '10/10/2024',
    description: 'Reposição de Mercadorias Tech',
    subDescription: 'Distribuidora Atacadista SP • NF Entrada 7731',
    category: 'Fornecedores & Insumos',
    type: 'expense',
    value: 1450.00,
    status: 'Em Estoque',
    account: 'Banco Inter PJ'
  },
  {
    id: 'pj-4',
    date: '08/10/2024',
    description: 'Retirada de Pró-labore - Lucas',
    subDescription: 'Pix PJ → Lucas Silva (Banco Inter PF)',
    category: 'Pró-labore',
    type: 'expense',
    value: 3000.00,
    status: 'Creditado PF',
    isSyncedToPF: true,
    syncTarget: 'pf-3',
    account: 'Banco Inter PJ'
  },
  {
    id: 'pj-5',
    date: '05/10/2024',
    description: 'Campanha Tráfego Pago Instagram',
    subDescription: 'Meta Ads Brasil • Cartão Corporativo Virtual',
    category: 'Marketing & Ads',
    type: 'expense',
    value: 380.00,
    status: 'Faturado',
    account: 'Cartão PJ'
  },
  {
    id: 'pj-6',
    date: '02/10/2024',
    description: 'Distribuição de Lucro Trimestral MEI',
    subDescription: 'Transferência Pix PJ → Lucas Silva (Isenção SIMEI)',
    category: 'Lucros Isentos',
    type: 'expense',
    value: 3200.00,
    status: 'Creditado PF',
    isSyncedToPF: true,
    syncTarget: 'pf-5',
    account: 'Banco Inter PJ'
  },
  {
    id: 'pj-7',
    date: '01/10/2024',
    description: 'Desenvolvimento e Manutenção Web',
    subDescription: 'Cliente: AgroMais Consultoria • Recibo #102',
    category: 'Faturamento / Vendas',
    type: 'income',
    value: 4150.00,
    status: 'Recebido',
    account: 'Banco Inter PJ'
  }
];

export const INITIAL_PF_TRANSACTIONS: PFTransaction[] = [
  {
    id: 'pf-1',
    date: '14/10/2024',
    description: 'Supermercado Pão de Açúcar',
    category: 'Alimentação',
    accountOrOrigin: 'Cartão Nubank PF',
    value: -412.50,
    status: 'Pago'
  },
  {
    id: 'pf-2',
    date: '10/10/2024',
    description: 'Aluguel Residencial Outubro',
    category: 'Moradia',
    accountOrOrigin: 'Pix Direto',
    value: -1500.00,
    status: 'Pago'
  },
  {
    id: 'pf-3',
    date: '08/10/2024',
    description: 'Pró-labore',
    subDescription: 'Sincronizado da Conta Jurídica',
    category: 'Pró-labore',
    accountOrOrigin: 'Banco Inter PF',
    value: 3000.00,
    status: 'Recebido',
    isFromPJ: true,
    syncedPJId: 'pj-4'
  },
  {
    id: 'pf-4',
    date: '05/10/2024',
    description: 'Farmácia Raia (Medicamentos)',
    category: 'Saúde',
    accountOrOrigin: 'Débito PF',
    value: -145.90,
    status: 'Pago'
  },
  {
    id: 'pf-5',
    date: '02/10/2024',
    description: 'Distribuição de Lucro Trimestral MEI',
    category: 'Lucros Isentos',
    accountOrOrigin: 'Transferência Pix PJ',
    value: 3200.00,
    status: 'Recebido',
    isFromPJ: true,
    syncedPJId: 'pj-6'
  },
  {
    id: 'pf-6',
    date: '01/10/2024',
    description: 'Energia Elétrica & Banda Larga',
    category: 'Moradia',
    accountOrOrigin: 'Débito Automático PF',
    value: -350.00,
    status: 'Pago'
  },
  {
    id: 'pf-7',
    date: '28/09/2024',
    description: 'Plano Academia & Saúde',
    category: 'Saúde',
    accountOrOrigin: 'Cartão Nubank PF',
    value: -129.90,
    status: 'Pago'
  }
];

export const INITIAL_STOCK_ITEMS: StockItem[] = [
  {
    id: 'st-1',
    name: 'Cabo USB-C Trançado 2m Reforçado',
    category: 'Cabos & Conectores',
    sku: 'CAB-USBC-2M',
    quantity: 2,
    minQuantity: 10,
    costPrice: 18.50,
    sellPrice: 49.90,
    status: 'critical'
  },
  {
    id: 'st-2',
    name: 'SSD 480GB Kingston A400 SATA 3',
    category: 'Armazenamento',
    sku: 'SSD-480-KNG',
    quantity: 1,
    minQuantity: 5,
    costPrice: 165.00,
    sellPrice: 289.00,
    status: 'critical'
  },
  {
    id: 'st-3',
    name: 'Hub Adaptador USB-C 7 em 1 4K HDMI',
    category: 'Acessórios Tech',
    sku: 'HUB-7IN1-ALU',
    quantity: 14,
    minQuantity: 6,
    costPrice: 85.00,
    sellPrice: 179.90,
    status: 'normal'
  },
  {
    id: 'st-4',
    name: 'Suporte Articulado para Monitor Duplo',
    category: 'Ergonomia Office',
    sku: 'SUP-ART-MON2',
    quantity: 8,
    minQuantity: 4,
    costPrice: 120.00,
    sellPrice: 249.00,
    status: 'normal'
  },
  {
    id: 'st-5',
    name: 'Teclado Mecânico Sem Fio ABNT2',
    category: 'Periféricos',
    sku: 'TEC-MEC-BT',
    quantity: 5,
    minQuantity: 4,
    costPrice: 190.00,
    sellPrice: 380.00,
    status: 'normal'
  },
  {
    id: 'st-6',
    name: 'Mousepad Gamer Ergonômico 90x40cm',
    category: 'Acessórios Office',
    sku: 'PAD-ERG-XL',
    quantity: 12,
    minQuantity: 5,
    costPrice: 32.00,
    sellPrice: 79.90,
    status: 'normal'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Guia DAS-SIMEI Próxima do Vencimento',
    message: 'A guia de Outubro/2024 no valor de R$ 75,90 vence em 5 dias (20/10/2024).',
    time: 'Há 2 horas',
    type: 'warning',
    read: false,
    actionScreen: 'das'
  },
  {
    id: 'notif-2',
    title: 'Estoque de Segurança Atingido!',
    message: '2 produtos estão abaixo da margem mínima: Cabo USB-C (2 un) e SSD 480GB (1 un).',
    time: 'Há 4 horas',
    type: 'warning',
    read: false,
    actionScreen: 'inventory'
  },
  {
    id: 'notif-3',
    title: 'Sincronização PJ ➔ PF Realizada com Sucesso',
    message: 'O repasse de Pró-labore de R$ 3.000,00 foi creditado automaticamente na sua Visão Pessoal.',
    time: 'Ontem às 14:32',
    type: 'success',
    read: true,
    actionScreen: 'pf'
  }
];
