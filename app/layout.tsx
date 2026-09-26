import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'FacilitaMei - Gestão Financeira Integrada PJ & PF',
  description: 'Controle contábil e financeiro para MEI com separação inteligente entre Pessoa Jurídica e Pessoa Física.',
  openGraph: {
    title: 'FacilitaMei - Gestão Financeira Integrada PJ & PF',
    description: 'Controle contábil e financeiro para MEI com separação inteligente entre Pessoa Jurídica e Pessoa Física.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FacilitaMei - Gestão Financeira Integrada PJ & PF',
    description: 'Controle contábil e financeiro para MEI com separação inteligente entre Pessoa Jurídica e Pessoa Física.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning className="bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
