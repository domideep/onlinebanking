import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  DollarSign, 
  TrendingUp, 
  ShieldAlert, 
  ArrowRightLeft, 
  Download, 
  Layers, 
  Sparkles, 
  Clock, 
  Building 
} from 'lucide-react';
import { BankAccount } from '../types/banking';
import { formatCurrency, maskAccountNumber } from '../utils/formatters';

interface AccountsOverviewProps {
  accounts: BankAccount[];
  onOpenWireModal: () => void;
  onOpenQuickSweep: () => void;
  onSelectTab: (tab: string) => void;
  onFilterAccountLedger: (accountId: string) => void;
}

export const AccountsOverview: React.FC<AccountsOverviewProps> = ({
  accounts,
  onOpenWireModal,
  onOpenQuickSweep,
  onSelectTab,
  onFilterAccountLedger,
}) => {
  const [unmaskedAccounts, setUnmaskedAccounts] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleMask = (id: string) => {
    setUnmaskedAccounts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalLiquidity = accounts
    .filter((a) => a.type !== 'credit_line')
    .reduce((sum, a) => sum + a.availableBalance, 0);

  const totalYieldBearing = accounts
    .filter((a) => a.type === 'sweep_savings' || a.type === 'investment')
    .reduce((sum, a) => sum + a.availableBalance, 0);

  const totalCreditAvailable = accounts
    .filter((a) => a.type === 'credit_line')
    .reduce((sum, a) => sum + a.availableBalance, 0);

  const getAccentBorderClass = (color: 'navy' | 'crimson' | 'emerald') => {
    switch (color) {
      case 'navy':
        return 'border-t-[3px] border-t-[#012169]';
      case 'crimson':
        return 'border-t-[3px] border-t-[#E31837]';
      case 'emerald':
        return 'border-t-[3px] border-t-[#0D8249]';
      default:
        return 'border-t-[3px] border-t-[#012169]';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Treasury Summary Hero Card */}
      <div className="bg-white rounded-[8px] border border-[#D5DFEB] elevation-1 p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E9EFF5]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#444651]">
                Total Consolidated Treasury Liquidity
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E6F4EA] text-[#0D8249]">
                Live Real-Time
              </span>
            </div>
            
            <div className="flex items-baseline gap-4">
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#000f3c] tracking-tight tabular-nums">
                {formatCurrency(totalLiquidity)}
              </h1>
              <div className="flex items-center gap-1 text-sm font-semibold text-[#0D8249]">
                <TrendingUp className="w-4 h-4" />
                <span>+4.2% MTD</span>
              </div>
            </div>
            <p className="text-xs text-[#757682] mt-1">
              Federal Reserve IMAD/OMAD synchronized · FDIC sweep structure active across 18 partner banks
            </p>
          </div>

          {/* Quick Action Group */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenQuickSweep}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] border border-[#D5DFEB] bg-white text-[#012169] hover:bg-[#F2F6FA] text-xs font-semibold shadow-sm transition-all"
            >
              <ArrowRightLeft className="w-4 h-4 text-[#012169]" />
              <span>Automated Yield Sweep</span>
            </button>

            <button
              onClick={onOpenWireModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#E31837] hover:bg-[#D4001A] text-white text-xs font-bold shadow-sm transition-all active:scale-[0.99]"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Fedwire / SWIFT Outbound</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          
          <div className="p-4 rounded-[6px] bg-[#EFF4FF] border border-[#dce9ff]">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-[#444651] mb-1">
              Operating Demand Cash
            </div>
            <div className="font-display font-bold text-xl text-[#012169] tabular-nums">
              {formatCurrency(accounts[0]?.availableBalance || 0)}
            </div>
            <div className="text-[11px] text-[#757682] mt-1 flex items-center justify-between">
              <span>Immediate Settlement</span>
              <span className="font-semibold text-[#012169]">T+0</span>
            </div>
          </div>

          <div className="p-4 rounded-[6px] bg-[#F2F6FA] border border-[#D5DFEB]">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-[#444651] mb-1">
              High-Yield Liquidity Sweep
            </div>
            <div className="font-display font-bold text-xl text-[#012169] tabular-nums">
              {formatCurrency(totalYieldBearing)}
            </div>
            <div className="text-[11px] text-[#0D8249] mt-1 flex items-center justify-between font-medium">
              <span>Avg Annual Yield</span>
              <span className="font-bold">4.85% APY</span>
            </div>
          </div>

          <div className="p-4 rounded-[6px] bg-[#F2F6FA] border border-[#D5DFEB]">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-[#444651] mb-1">
              Revolving Credit Available
            </div>
            <div className="font-display font-bold text-xl text-[#000f3c] tabular-nums">
              {formatCurrency(totalCreditAvailable)}
            </div>
            <div className="text-[11px] text-[#757682] mt-1 flex items-center justify-between">
              <span>Facility Cap: $5.00M</span>
              <span className="text-[#E31837] font-semibold">SOFR + 1.25%</span>
            </div>
          </div>

          <div className="p-4 rounded-[6px] bg-[#F2F6FA] border border-[#D5DFEB]">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-[#444651] mb-1">
              Daily Projected Accrual
            </div>
            <div className="font-display font-bold text-xl text-[#0D8249] tabular-nums">
              +$2,118.40
            </div>
            <div className="text-[11px] text-[#757682] mt-1 flex items-center justify-between">
              <span>Compounds at 23:59 EST</span>
              <span className="font-semibold text-[#0D8249]">Automated</span>
            </div>
          </div>

        </div>
      </div>

      {/* Account Cards Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-[#000f3c]">
            Corporate Accounts & Custodial Portfolios
          </h2>
          <p className="text-xs text-[#757682]">
            Detailed breakdown of segregated operating accounts, treasury sweeps, and credit facilities
          </p>
        </div>
        <span className="text-xs font-semibold text-[#444651] bg-white px-3 py-1.5 rounded-[4px] border border-[#D5DFEB]">
          {accounts.length} Active Accounts
        </span>
      </div>

      {/* Financial Account Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {accounts.map((acc) => {
          const isUnmasked = unmaskedAccounts[acc.id] || false;
          return (
            <div
              key={acc.id}
              className={`bg-white rounded-[8px] border border-[#D5DFEB] elevation-1 ${getAccentBorderClass(
                acc.accentColor
              )} p-5 flex flex-col justify-between hover:shadow-md transition-shadow`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-base text-[#000f3c]">
                        {acc.name}
                      </h3>
                      {acc.type === 'sweep_savings' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F4EA] text-[#0D8249]">
                          4.85% APY
                        </span>
                      )}
                      {acc.type === 'credit_line' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF3D6] text-[#B38200]">
                          Credit Line
                        </span>
                      )}
                      {acc.type === 'investment' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8EFF7] text-[#012169]">
                          Fixed Income
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#757682]">{acc.institutionName}</div>
                  </div>

                  <button
                    onClick={() => onFilterAccountLedger(acc.id)}
                    className="text-xs font-semibold text-[#012169] hover:underline flex items-center gap-1"
                  >
                    View Ledger
                  </button>
                </div>

                {/* Account Number & Routing Information with Masking */}
                <div className="bg-[#F2F6FA] rounded-[4px] p-3 border border-[#E9EFF5] space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#757682]">Account Number:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#000f3c] font-medium tracking-wider">
                        {maskAccountNumber(acc.accountNumber, isUnmasked)}
                      </span>
                      <button
                        onClick={() => toggleMask(acc.id)}
                        className="text-[#757682] hover:text-[#012169] p-0.5"
                        title={isUnmasked ? 'Mask Account Number' : 'Reveal Account Number'}
                      >
                        {isUnmasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(acc.accountNumber, `acc-${acc.id}`)}
                        className="text-[#757682] hover:text-[#012169] p-0.5"
                        title="Copy Account Number"
                      >
                        {copiedId === `acc-${acc.id}` ? (
                          <Check className="w-3.5 h-3.5 text-[#0D8249]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#757682]">Fed Routing (ABA):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#000f3c] font-medium">
                        {acc.routingNumber}
                      </span>
                      <button
                        onClick={() => copyToClipboard(acc.routingNumber, `rout-${acc.id}`)}
                        className="text-[#757682] hover:text-[#012169] p-0.5"
                        title="Copy Routing Number"
                      >
                        {copiedId === `rout-${acc.id}` ? (
                          <Check className="w-3.5 h-3.5 text-[#0D8249]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Balances Display */}
                <div className="grid grid-cols-2 gap-4 py-2 border-t border-[#E9EFF5]">
                  <div>
                    <span className="text-[11px] uppercase font-semibold text-[#757682]">
                      Available Balance
                    </span>
                    <div className="font-display font-extrabold text-2xl text-[#000f3c] tabular-nums mt-0.5">
                      {formatCurrency(acc.availableBalance)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-semibold text-[#757682]">
                      {acc.type === 'credit_line' ? 'Drawn Capital' : 'Ledger Balance'}
                    </span>
                    <div className="font-display font-bold text-lg text-[#444651] tabular-nums mt-0.5">
                      {formatCurrency(acc.ledgerBalance)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-[#E9EFF5] flex items-center justify-between gap-2">
                <button
                  onClick={onOpenWireModal}
                  className="flex-1 py-2 px-3 rounded-[4px] bg-[#012169] hover:bg-[#001231] text-white text-xs font-semibold text-center transition-colors"
                >
                  Wire Out
                </button>
                <button
                  onClick={onOpenQuickSweep}
                  className="flex-1 py-2 px-3 rounded-[4px] border border-[#D5DFEB] bg-white hover:bg-[#F2F6FA] text-[#012169] text-xs font-semibold text-center transition-colors"
                >
                  Sweep / Transfer
                </button>
                <button
                  onClick={() => onFilterAccountLedger(acc.id)}
                  className="py-2 px-3 rounded-[4px] border border-[#D5DFEB] bg-[#F2F6FA] hover:bg-[#E8EFF7] text-[#444651] text-xs font-semibold text-center transition-colors"
                >
                  Audit Trail
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
