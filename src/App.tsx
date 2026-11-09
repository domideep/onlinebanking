/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  INITIAL_ACCOUNTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_CARDS 
} from './data/mockData';
import { BankAccount, Transaction, CommercialCard } from './types/banking';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AccountsOverview } from './components/AccountsOverview';
import { TransactionLedger } from './components/TransactionLedger';
import { CardsManagement } from './components/CardsManagement';
import { CashFlowAnalytics } from './components/CashFlowAnalytics';
import { SecuritySignatories } from './components/SecuritySignatories';
import { WireTransferModal } from './components/WireTransferModal';
import { StatementModal } from './components/StatementModal';
import { QuickSweepModal } from './components/QuickSweepModal';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  ArrowRightLeft, 
  Lock, 
  Building,
  Info
} from 'lucide-react';
import { formatCurrency } from './utils/formatters';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [selectedEntity, setSelectedEntity] = useState<string>('Apex Global Holdings LLC');
  
  // Dynamic State
  const [accounts, setAccounts] = useState<BankAccount[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [cards, setCards] = useState<CommercialCard[]>(INITIAL_CARDS);
  
  // Account Ledger filter (when clicking "View Ledger" from an account card)
  const [filterAccountId, setFilterAccountId] = useState<string | null>(null);

  // Modals and Mobile Off-Canvas Drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWireModalOpen, setIsWireModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [isQuickSweepOpen, setIsQuickSweepOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);

  const showToast = (title: string, subtitle: string) => {
    setToastMessage({ title, subtitle });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Wire submission handler
  const handleWireSubmit = (wireData: {
    sourceAccountId: string;
    beneficiaryName: string;
    beneficiaryBank: string;
    beneficiaryRouting: string;
    beneficiaryAccount: string;
    amount: number;
    wireType: 'fedwire' | 'swift' | 'ach';
    memo: string;
    category: string;
  }) => {
    const fee = wireData.wireType === 'fedwire' ? 25 : wireData.wireType === 'swift' ? 45 : 0;
    const totalOutflow = wireData.amount + fee;
    const randomImad = `20261109B1Q${Math.floor(1000 + Math.random() * 9000)}C00${Math.floor(100 + Math.random() * 900)}`;
    const randomRef = `${wireData.wireType.toUpperCase().slice(0, 4)}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10000 + Math.random() * 90000)}`;

    // 1. Deduct from account
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === wireData.sourceAccountId) {
          return {
            ...acc,
            availableBalance: acc.availableBalance - totalOutflow,
            ledgerBalance: acc.ledgerBalance - totalOutflow,
          };
        }
        return acc;
      })
    );

    // 2. Add to transactions ledger
    const sourceAcc = accounts.find((a) => a.id === wireData.sourceAccountId);
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      referenceId: randomRef,
      accountId: wireData.sourceAccountId,
      accountName: sourceAcc?.name || 'Operating Checking',
      date: 'Today, Just now',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      description: `${wireData.wireType.toUpperCase()} Outbound - ${wireData.memo || wireData.category}`,
      counterparty: wireData.beneficiaryName,
      type: 'wire_out',
      category: wireData.category,
      amount: -wireData.amount,
      status: 'cleared',
      fee: fee,
      imadNumber: randomImad,
      beneficiaryRouting: wireData.beneficiaryRouting,
      beneficiaryAccount: wireData.beneficiaryAccount,
      approvers: ['Marcus Sterling (CFO)', 'Evelyn Vance (Treasurer)'],
      memo: wireData.memo,
    };

    setTransactions((prev) => [newTx, ...prev]);

    showToast(
      'Fedwire Dispatched & Cleared',
      `${formatCurrency(wireData.amount)} debited to ${wireData.beneficiaryName} (IMAD: ${randomImad})`
    );
  };

  // Internal Sweep handler
  const handleExecuteSweep = (fromId: string, toId: string, amount: number) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === fromId) {
          return {
            ...acc,
            availableBalance: acc.availableBalance - amount,
            ledgerBalance: acc.ledgerBalance - amount,
          };
        }
        if (acc.id === toId) {
          return {
            ...acc,
            availableBalance: acc.availableBalance + amount,
            ledgerBalance: acc.ledgerBalance + amount,
          };
        }
        return acc;
      })
    );

    const fromAcc = accounts.find((a) => a.id === fromId);
    const toAcc = accounts.find((a) => a.id === toId);

    const sweepTx: Transaction = {
      id: `tx-sweep-${Date.now()}`,
      referenceId: `SWP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      accountId: toId,
      accountName: toAcc?.name || 'Institutional Sweep',
      date: 'Today, Just now',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      description: `Internal Liquidity Sweep: ${fromAcc?.name} -> ${toAcc?.name}`,
      counterparty: 'Heritage Treasury Operations',
      type: 'interest_sweep',
      category: 'Treasury Yield',
      amount: amount,
      status: 'cleared',
      approvers: ['Automated Sweep Algorithm'],
      memo: `Treasury sweep reallocation for yield maximization`,
    };

    setTransactions((prev) => [sweepTx, ...prev]);

    showToast(
      'Treasury Sweep Completed',
      `${formatCurrency(amount)} successfully swept into ${toAcc?.name}`
    );
  };

  // Card Controls
  const handleToggleFreezeCard = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const nextStatus = c.status === 'active' ? 'frozen' : 'active';
          showToast(
            nextStatus === 'frozen' ? 'Card Instantly Frozen' : 'Card Re-activated',
            `Card ending in ${c.lastFour} is now ${nextStatus}.`
          );
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleUpdateCardLimit = (cardId: string, limitType: 'daily' | 'monthly', amount: number) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          return limitType === 'daily'
            ? { ...c, dailyLimit: amount }
            : { ...c, monthlyLimit: amount };
        }
        return c;
      })
    );
  };

  const handleCreateVirtualCard = (cardData: {
    cardholderName: string;
    dailyLimit: number;
    monthlyLimit: number;
    virtualVendor: string;
  }) => {
    const randomLastFour = Math.floor(1000 + Math.random() * 9000).toString();
    const newCard: CommercialCard = {
      id: `card-${Date.now()}`,
      cardholderName: cardData.cardholderName,
      lastFour: randomLastFour,
      fullNumberMasked: `4092 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${randomLastFour}`,
      expiry: '11/28',
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      type: 'Single-Use Virtual',
      status: 'active',
      dailyLimit: cardData.dailyLimit,
      monthlyLimit: cardData.monthlyLimit,
      spentThisMonth: 0,
      billingAccount: 'Operating Commercial Checking (...4418)',
      isVirtual: true,
      virtualVendor: cardData.virtualVendor,
      categoryLocks: {
        aviation: false,
        hospitality: false,
        softwareSaaS: true,
        hardwareSupplies: false,
        professionalServices: false,
      },
    };

    setCards((prev) => [newCard, ...prev]);
    showToast(
      'Virtual Burner Card Activated',
      `Locked to ${cardData.virtualVendor} with ${formatCurrency(cardData.monthlyLimit)} limit.`
    );
  };

  // Navigating to Ledger with specific account
  const handleFilterAccountLedger = (accId: string) => {
    setFilterAccountId(accId);
    setCurrentTab('ledger');
  };

  const totalLiquidity = accounts
    .filter((a) => a.type !== 'credit_line')
    .reduce((sum, a) => sum + a.availableBalance, 0);

  return (
    <div className="min-h-screen bg-[#F2F6FA] text-[#0d1c2e] flex flex-col font-sans">
      
      {/* Top Navbar: ONLY Name and Logo of bankofameriica + Mobile Menu Toggle */}
      <Navbar
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Mobile Off-Canvas Navbar Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-[#012169]/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Off-Canvas Sliding Container from Left */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                if (tab !== 'ledger') {
                  setFilterAccountId(null);
                }
                setIsMobileMenuOpen(false);
              }}
              onOpenWireModal={() => {
                setIsWireModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              onOpenStatementModal={() => {
                setIsStatementModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              selectedEntity={selectedEntity}
              onSelectEntity={(ent) => {
                setSelectedEntity(ent);
                setIsMobileMenuOpen(false);
              }}
              totalLiquidity={totalLiquidity}
              onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
              isMobileDrawer={true}
            />
          </div>
        </div>
      )}

      {/* Main Container: Left Sidebar with all switched details + Main Dashboard Area */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto">
        {/* Desktop Sidebar (visible on lg+) */}
        <div className="hidden lg:flex shrink-0">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              if (tab !== 'ledger') {
                setFilterAccountId(null);
              }
            }}
            onOpenWireModal={() => setIsWireModalOpen(true)}
            onOpenStatementModal={() => setIsStatementModalOpen(true)}
            selectedEntity={selectedEntity}
            onSelectEntity={setSelectedEntity}
            totalLiquidity={totalLiquidity}
          />
        </div>

        {/* Main Analytical Dashboard Canvas on the right */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        
        {/* Render Active View */}
        {currentTab === 'overview' && (
          <AccountsOverview
            accounts={accounts}
            onOpenWireModal={() => setIsWireModalOpen(true)}
            onOpenQuickSweep={() => setIsQuickSweepOpen(true)}
            onSelectTab={setCurrentTab}
            onFilterAccountLedger={handleFilterAccountLedger}
          />
        )}

        {currentTab === 'ledger' && (
          <TransactionLedger
            transactions={transactions}
            initialFilterAccountId={filterAccountId}
            onClearAccountFilter={() => setFilterAccountId(null)}
            onOpenWireModal={() => setIsWireModalOpen(true)}
          />
        )}

        {currentTab === 'wires' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[8px] border border-[#D5DFEB] elevation-1 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9EFF5]">
                <div>
                  <h2 className="font-display font-bold text-xl text-[#000f3c]">
                    Institutional Wire Operations & Settlement Rails
                  </h2>
                  <p className="text-xs text-[#757682] mt-0.5">
                    Federal Reserve Fedwire RTGS terminal, SWIFT cross-border messaging, and ACH disbursement desk
                  </p>
                </div>
                <button
                  onClick={() => setIsWireModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#E31837] hover:bg-[#D4001A] text-white text-xs font-bold shadow-sm transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Initiate New Outbound Wire</span>
                </button>
              </div>

              {/* Wire Rails Comparison Table */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                <div className="p-4 rounded-[6px] border border-[#dce9ff] bg-[#EFF4FF] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-[#012169]">Fedwire RTGS</span>
                    <span className="text-[10px] font-bold text-[#0D8249] bg-[#E6F4EA] px-2 py-0.5 rounded-full">
                      Same-Day T+0
                    </span>
                  </div>
                  <p className="text-[11px] text-[#444651]">
                    Direct Federal Reserve Bank gross settlement for high-value domestic disbursements.
                  </p>
                  <div className="text-[10px] text-[#768cd8] font-mono">
                    Cutoff: 18:00 EST · Network Fee: $25.00
                  </div>
                </div>

                <div className="p-4 rounded-[6px] border border-[#D5DFEB] bg-[#F2F6FA] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-[#000f3c]">SWIFT MT103</span>
                    <span className="text-[10px] font-bold text-[#012169] bg-[#E8EFF7] px-2 py-0.5 rounded-full">
                      International FX
                    </span>
                  </div>
                  <p className="text-[11px] text-[#444651]">
                    Cross-border wire transfer routing through correspondent banking syndicate.
                  </p>
                  <div className="text-[10px] text-[#757682] font-mono">
                    Multi-Currency · Network Fee: $45.00
                  </div>
                </div>

                <div className="p-4 rounded-[6px] border border-[#D5DFEB] bg-[#F2F6FA] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-[#000f3c]">Corporate ACH</span>
                    <span className="text-[10px] font-bold text-[#0D8249] bg-[#E6F4EA] px-2 py-0.5 rounded-full">
                      Zero-Fee (Free)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#444651]">
                    Standard batch clearing for payroll, regular supplier payments, and vendor sweeps.
                  </p>
                  <div className="text-[10px] text-[#757682] font-mono">
                    Settlement: Next-Day T+1 · Fee: $0.00
                  </div>
                </div>
              </div>
            </div>

            {/* Embed Transaction Ledger specifically showing Wires */}
            <TransactionLedger
              transactions={transactions.filter((t) => t.type.includes('wire'))}
              onOpenWireModal={() => setIsWireModalOpen(true)}
            />
          </div>
        )}

        {currentTab === 'cards' && (
          <CardsManagement
            cards={cards}
            onToggleFreeze={handleToggleFreezeCard}
            onUpdateLimit={handleUpdateCardLimit}
            onCreateVirtualCard={handleCreateVirtualCard}
          />
        )}

        {currentTab === 'analytics' && <CashFlowAnalytics />}

        {currentTab === 'governance' && (
          <SecuritySignatories
            onOpenStatementModal={() => setIsStatementModalOpen(true)}
          />
        )}

      </main>
      </div>

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-[#D5DFEB] bg-white py-6 text-xs text-[#757682]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-4 shrink-0" viewBox="0 0 38 28" fill="none">
              <rect x="0" y="1" width="15" height="4.5" rx="0.5" fill="#E31837" />
              <rect x="0" y="8" width="15" height="4.5" rx="0.5" fill="#E31837" />
              <rect x="0" y="15" width="15" height="4.5" rx="0.5" fill="#E31837" />
              <rect x="0" y="22" width="15" height="4.5" rx="0.5" fill="#E31837" />
              <rect x="18" y="1" width="20" height="4.5" rx="0.5" fill="#012169" />
              <rect x="18" y="8" width="20" height="4.5" rx="0.5" fill="#012169" />
              <rect x="18" y="15" width="20" height="4.5" rx="0.5" fill="#012169" />
              <rect x="18" y="22" width="20" height="4.5" rx="0.5" fill="#012169" />
            </svg>
            <div>
              <span className="font-semibold text-[#000f3c]">Bank of America, N.A.</span>
              <span className="font-mono text-[#E31837] text-[11px] ml-1.5 font-bold">bankofameriica</span>
              <span className="mx-2">·</span>
              <span>Member FDIC · Equal Housing Lender · Federal Reserve System</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-[#0D8249] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SOC2 Type II & OCC Regulated</span>
            </span>
            <span>·</span>
            <span className="font-mono">ABA #026009593</span>
            <span>·</span>
            <span>SWIFT: BOFAUS3N</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <WireTransferModal
        isOpen={isWireModalOpen}
        onClose={() => setIsWireModalOpen(false)}
        accounts={accounts}
        onSubmitWire={handleWireSubmit}
      />

      <StatementModal
        isOpen={isStatementModalOpen}
        onClose={() => setIsStatementModalOpen(false)}
        accounts={accounts}
        transactions={transactions}
        entityName={selectedEntity}
      />

      <QuickSweepModal
        isOpen={isQuickSweepOpen}
        onClose={() => setIsQuickSweepOpen(false)}
        accounts={accounts}
        onExecuteSweep={handleExecuteSweep}
      />

      {/* Toast Notification Floating Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#000f3c] text-white border border-[#768cd8] rounded-[6px] p-4 shadow-2xl elevation-3 flex items-start gap-3 max-w-md animate-in fade-in slide-in-from-bottom-4">
          <div className="p-1 rounded bg-[#0D8249]/20 text-[#0D8249] shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-bold text-xs text-white">
              {toastMessage.title}
            </div>
            <div className="text-[11px] text-[#adc7ff] mt-0.5">
              {toastMessage.subtitle}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
