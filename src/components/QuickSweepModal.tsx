import React, { useState } from 'react';
import { 
  X, 
  ArrowRightLeft, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';
import { BankAccount } from '../types/banking';
import { formatCurrency } from '../utils/formatters';

interface QuickSweepModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: BankAccount[];
  onExecuteSweep: (fromId: string, toId: string, amount: number) => void;
}

export const QuickSweepModal: React.FC<QuickSweepModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onExecuteSweep,
}) => {
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || '');
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id || '');
  const [sweepAmountStr, setSweepAmountStr] = useState('500000');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const fromAccount = accounts.find((a) => a.id === fromAccountId) || accounts[0];
  const toAccount = accounts.find((a) => a.id === toAccountId) || accounts[1];
  const amount = parseFloat(sweepAmountStr) || 0;

  const handlePercentage = (pct: number) => {
    if (!fromAccount) return;
    const calc = Math.floor(fromAccount.availableBalance * pct);
    setSweepAmountStr(calc.toString());
  };

  const handleConfirmSweep = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > fromAccount.availableBalance) {
      alert('Invalid transfer amount or insufficient available funds.');
      return;
    }
    onExecuteSweep(fromAccountId, toAccountId, amount);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  // Yield estimation
  const apy = toAccount.interestRateAPY || 0;
  const annualEarning = (amount * apy) / 100;
  const monthlyEarning = annualEarning / 12;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#012169]/40 backdrop-blur-[8px]">
      <div className="bg-white rounded-[8px] border border-[#D5DFEB] elevation-3 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="bg-[#012169] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[4px] bg-[#001231]">
              <ArrowRightLeft className="w-5 h-5 text-[#adc7ff]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Treasury Liquidity Sweep & Yield Optimization
              </h3>
              <p className="text-xs text-[#adc7ff]">
                Zero-fee instant internal fund reallocation between corporate ledgers
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#adc7ff] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-[#E6F4EA] text-[#0D8249] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-display font-bold text-lg text-[#000f3c]">
              Liquidity Sweep Reallocated
            </h4>
            <p className="text-xs text-[#444651]">
              {formatCurrency(amount)} successfully swept from {fromAccount.name} to {toAccount.name}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirmSweep} className="p-6 space-y-4 text-xs text-[#0d1c2e]">
            
            {/* From Account */}
            <div>
              <label className="block text-[11px] uppercase font-bold text-[#444651] mb-1">
                Source Account (Debit)
              </label>
              <select
                value={fromAccountId}
                onChange={(e) => setFromAccountId(e.target.value)}
                className="w-full p-2.5 rounded-[4px] border border-[#D5DFEB] bg-white font-medium text-xs text-[#000f3c]"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — Available: {formatCurrency(a.availableBalance)}
                  </option>
                ))}
              </select>
            </div>

            {/* To Account */}
            <div>
              <label className="block text-[11px] uppercase font-bold text-[#444651] mb-1">
                Destination Account (Credit)
              </label>
              <select
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                className="w-full p-2.5 rounded-[4px] border border-[#D5DFEB] bg-white font-medium text-xs text-[#000f3c]"
              >
                {accounts
                  .filter((a) => a.id !== fromAccountId)
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.type === 'sweep_savings' ? '4.85% APY' : a.type})
                    </option>
                  ))}
              </select>
            </div>

            {/* Amount & Quick % */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] uppercase font-bold text-[#444651]">
                  Sweep Amount (USD)
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handlePercentage(0.25)}
                    className="px-2 py-0.5 rounded-[2px] bg-[#EFF4FF] hover:bg-[#dce9ff] text-[10px] font-bold text-[#012169]"
                  >
                    25%
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePercentage(0.5)}
                    className="px-2 py-0.5 rounded-[2px] bg-[#EFF4FF] hover:bg-[#dce9ff] text-[10px] font-bold text-[#012169]"
                  >
                    50%
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePercentage(1.0)}
                    className="px-2 py-0.5 rounded-[2px] bg-[#EFF4FF] hover:bg-[#dce9ff] text-[10px] font-bold text-[#012169]"
                  >
                    MAX
                  </button>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm text-[#757682]">$</span>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  required
                  value={sweepAmountStr}
                  onChange={(e) => setSweepAmountStr(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 rounded-[4px] border border-[#D5DFEB] bg-white font-display font-bold text-base text-[#000f3c]"
                />
              </div>
            </div>

            {/* Projected Yield Impact Box */}
            {apy > 0 && (
              <div className="p-3 bg-[#E6F4EA] rounded-[6px] border border-[#c4e7d4] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#0D8249]">
                  <TrendingUp className="w-4 h-4" />
                  <span>Yield Accrual Acceleration: {apy}% APY</span>
                </div>
                <div className="text-[11px] text-[#000f3c] flex justify-between pt-1">
                  <span>Additional Estimated Monthly Yield:</span>
                  <span className="font-mono font-bold text-[#0D8249]">+{formatCurrency(monthlyEarning)}</span>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#E9EFF5] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-[4px] border border-[#D5DFEB] bg-white text-[#012169] font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-[4px] bg-[#012169] hover:bg-[#001231] text-white font-bold flex items-center gap-1.5"
              >
                <span>Execute Instant Sweep</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
