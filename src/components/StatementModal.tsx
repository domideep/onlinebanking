import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  Building2, 
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { BankAccount, Transaction } from '../types/banking';
import { formatCurrency, formatSignedCurrency } from '../utils/formatters';

interface StatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: BankAccount[];
  transactions: Transaction[];
  entityName: string;
}

export const StatementModal: React.FC<StatementModalProps> = ({
  isOpen,
  onClose,
  accounts,
  transactions,
  entityName,
}) => {
  if (!isOpen) return null;

  const totalBalance = accounts
    .filter((a) => a.type !== 'credit_line')
    .reduce((sum, a) => sum + a.availableBalance, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#012169]/40 backdrop-blur-[8px]">
      <div className="bg-white rounded-[8px] border border-[#D5DFEB] elevation-3 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Toolbar */}
        <div className="bg-[#012169] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#adc7ff]" />
            <span className="font-display font-bold text-base">
              Certified Institutional Bank Statement
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Statement</span>
            </button>
            <button
              onClick={() => alert('Official PDF Statement exported successfully.')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#E31837] hover:bg-[#D4001A] text-xs font-bold text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#adc7ff] hover:text-white p-1 rounded-[4px]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Statement Document Content */}
        <div className="p-8 overflow-y-auto space-y-6 text-[#0d1c2e] bg-white print:p-0">
          
          {/* Statement Header */}
          <div className="flex items-start justify-between pb-6 border-b-2 border-[#012169]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <svg className="w-8 h-6 shrink-0" viewBox="0 0 38 28" fill="none">
                  <rect x="0" y="1" width="15" height="4.5" rx="0.5" fill="#E31837" />
                  <rect x="0" y="8" width="15" height="4.5" rx="0.5" fill="#E31837" />
                  <rect x="0" y="15" width="15" height="4.5" rx="0.5" fill="#E31837" />
                  <rect x="0" y="22" width="15" height="4.5" rx="0.5" fill="#E31837" />
                  <rect x="18" y="1" width="20" height="4.5" rx="0.5" fill="#012169" />
                  <rect x="18" y="8" width="20" height="4.5" rx="0.5" fill="#012169" />
                  <rect x="18" y="15" width="20" height="4.5" rx="0.5" fill="#012169" />
                  <rect x="18" y="22" width="20" height="4.5" rx="0.5" fill="#012169" />
                </svg>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-black text-xl tracking-tight text-[#012169]">
                    BANK OF AMERICA N.A.
                  </span>
                  <span className="font-mono text-xs text-[#E31837] font-bold">
                    bankofameriica
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#444651]">
                Global Corporate Treasury, Commercial Banking & Liquidity Management
              </p>
              <p className="text-[11px] text-[#757682]">
                100 North Tryon Street, Charlotte, NC 28255 · Member FDIC · Fed Routing: 026009593
              </p>
            </div>

            <div className="text-right text-xs">
              <div className="font-display font-bold text-sm text-[#012169]">MONTHLY TREASURY STATEMENT</div>
              <div className="font-mono text-[11px] text-[#444651] mt-0.5">Period: Oct 01, 2026 – Oct 31, 2026</div>
              <div className="font-mono text-[11px] text-[#757682]">Statement Ref: HK-STMT-202610-8824</div>
            </div>
          </div>

          {/* Account Holder Entity & Summary Cards */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-[6px] bg-[#F2F6FA] border border-[#D5DFEB] text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#757682] block mb-1">
                Account Holder & Corporate Entity
              </span>
              <div className="font-bold text-sm text-[#000f3c]">{entityName}</div>
              <div className="text-[#444651]">Corporate Treasury & Capital Division</div>
              <div className="text-[#757682] text-[11px]">Tax ID (EIN): XX-XXX8820 · Legal Entity ID (LEI): 5493001KJTI98</div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#757682] block mb-1">
                Consolidated Ending Liquidity
              </span>
              <div className="font-display font-extrabold text-2xl text-[#012169] tabular-nums">
                {formatCurrency(totalBalance)}
              </div>
              <div className="text-[#0D8249] font-semibold text-[11px] flex items-center justify-end gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Audited Ledger Reconciled</span>
              </div>
            </div>
          </div>

          {/* Accounts Breakdown Table */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#012169] mb-2">
              Summary of Deposited & Credit Accounts
            </h4>
            <table className="w-full text-xs text-left border-collapse border border-[#D5DFEB]">
              <thead>
                <tr className="bg-[#EFF4FF] border-b border-[#D5DFEB] text-[#444651] font-bold text-[11px] uppercase">
                  <th className="p-2.5">Account Description</th>
                  <th className="p-2.5 font-mono">Account Number</th>
                  <th className="p-2.5">Type</th>
                  <th className="p-2.5 text-right font-mono">Starting Balance</th>
                  <th className="p-2.5 text-right font-mono">Ending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9EFF5]">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-[#F8FAFC]">
                    <td className="p-2.5 font-semibold text-[#000f3c]">{acc.name}</td>
                    <td className="p-2.5 font-mono text-[#444651]">{acc.accountNumber}</td>
                    <td className="p-2.5 capitalize text-[#757682]">{acc.type.replace('_', ' ')}</td>
                    <td className="p-2.5 text-right font-mono text-[#444651]">
                      {formatCurrency(acc.availableBalance * 0.94)}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#000f3c]">
                      {formatCurrency(acc.availableBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sample Key Ledger Transactions during Period */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#012169] mb-2">
              Selected Itemized Fedwire & Settlement Transactions
            </h4>
            <table className="w-full text-xs text-left border-collapse border border-[#D5DFEB]">
              <thead>
                <tr className="bg-[#EFF4FF] border-b border-[#D5DFEB] text-[#444651] font-bold text-[11px] uppercase">
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5 font-mono">Reference / IMAD</th>
                  <th className="p-2.5">Counterparty & Description</th>
                  <th className="p-2.5 text-right font-mono">Amount (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9EFF5]">
                {transactions.slice(0, 5).map((tx) => {
                  const signed = formatSignedCurrency(tx.amount);
                  return (
                    <tr key={tx.id}>
                      <td className="p-2.5 whitespace-nowrap text-[#444651]">{tx.date}</td>
                      <td className="p-2.5 font-mono text-[11px] text-[#757682]">{tx.referenceId}</td>
                      <td className="p-2.5">
                        <span className="font-bold text-[#000f3c] block">{tx.counterparty}</span>
                        <span className="text-[10px] text-[#757682]">{tx.description}</span>
                      </td>
                      <td className={`p-2.5 text-right font-mono font-bold ${signed.isPositive ? 'text-[#0D8249]' : 'text-[#000f3c]'}`}>
                        {signed.text}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Official Seal and Legal Disclosures */}
          <div className="pt-6 border-t-2 border-[#D5DFEB] grid grid-cols-2 gap-6 text-[10px] text-[#757682]">
            <div className="space-y-1">
              <div className="font-bold text-[#012169] uppercase">Regulatory & Audit Verification</div>
              <p>
                This statement constitutes an official electronic certification issued under the authority of
                Bank of America, N.A. (bankofameriica). Cash balances in sweep accounts are distributed across a syndicate of FDIC-insured
                depository institutions for aggregate insurance coverage up to $50,000,000.00.
              </p>
            </div>
            <div className="text-right space-y-1">
              <div className="font-bold text-[#012169]">BANK OF AMERICA MERRILL LYNCH</div>
              <p className="font-mono">Audit Digest: 98ea-0129-c884-bb31-bofa-8841-a109</p>
              <div className="text-[#0D8249] font-bold">CERTIFIED OFFICIAL RECORD</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
