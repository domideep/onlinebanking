import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  ExternalLink,
  X,
  CreditCard,
  Building,
  Hash
} from 'lucide-react';
import { Transaction } from '../types/banking';
import { formatCurrency, formatSignedCurrency } from '../utils/formatters';

interface TransactionLedgerProps {
  transactions: Transaction[];
  initialFilterAccountId?: string | null;
  onClearAccountFilter?: () => void;
  onOpenWireModal: () => void;
}

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({
  transactions,
  initialFilterAccountId,
  onClearAccountFilter,
  onOpenWireModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Account filter
      if (initialFilterAccountId && tx.accountId !== initialFilterAccountId) {
        return false;
      }

      // Type filter
      if (selectedTypeFilter === 'wires' && !tx.type.includes('wire')) {
        return false;
      }
      if (selectedTypeFilter === 'inflow' && tx.amount <= 0) {
        return false;
      }
      if (selectedTypeFilter === 'outflow' && tx.amount >= 0) {
        return false;
      }
      if (selectedTypeFilter === 'cards' && tx.type !== 'card_purchase') {
        return false;
      }

      // Status filter
      if (selectedStatusFilter !== 'all' && tx.status !== selectedStatusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchDesc = tx.description.toLowerCase().includes(query);
        const matchRef = tx.referenceId.toLowerCase().includes(query);
        const matchCounter = tx.counterparty.toLowerCase().includes(query);
        const matchCategory = tx.category.toLowerCase().includes(query);
        const matchAmount = Math.abs(tx.amount).toString().includes(query);
        if (!matchDesc && !matchRef && !matchCounter && !matchCategory && !matchAmount) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, initialFilterAccountId, selectedTypeFilter, selectedStatusFilter, searchQuery]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Reference ID', 'Date & Time', 'Account', 'Description', 'Counterparty', 'Category', 'Type', 'Amount (USD)', 'Status', 'IMAD'];
    const rows = filteredTransactions.map((tx) => [
      tx.referenceId,
      tx.timestamp,
      tx.accountName,
      `"${tx.description.replace(/"/g, '""')}"`,
      `"${tx.counterparty.replace(/"/g, '""')}"`,
      tx.category,
      tx.type,
      tx.amount.toFixed(2),
      tx.status,
      tx.imadNumber || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Heritage_Kinetic_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wire_out':
      case 'ach_debit':
        return <ArrowUpRight className="w-3.5 h-3.5 text-[#E31837]" />;
      case 'wire_in':
      case 'ach_credit':
      case 'interest_sweep':
        return <ArrowDownLeft className="w-3.5 h-3.5 text-[#0D8249]" />;
      case 'card_purchase':
        return <CreditCard className="w-3.5 h-3.5 text-[#012169]" />;
      default:
        return <Building className="w-3.5 h-3.5 text-[#757682]" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Toolbar */}
      <div className="bg-white rounded-[8px] border border-[#D5DFEB] elevation-1 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E9EFF5]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl text-[#000f3c]">
                Institutional Transaction Ledger
              </h2>
              {initialFilterAccountId && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EFF4FF] border border-[#dce9ff] text-xs font-semibold text-[#012169]">
                  <span>Account Filter Active</span>
                  <button
                    onClick={onClearAccountFilter}
                    className="hover:text-[#E31837]"
                    title="Clear filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-[#757682] mt-0.5">
              Fedwire RTGS, SWIFT MT103, and ACH settlement ledger with dual-signatory verification
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-[4px] border border-[#D5DFEB] bg-white hover:bg-[#F2F6FA] text-[#012169] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ledger (.CSV)</span>
            </button>
            <button
              onClick={onOpenWireModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-[4px] bg-[#E31837] hover:bg-[#D4001A] text-white shadow-sm transition-all"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>New Wire</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757682]" />
            <input
              type="text"
              placeholder="Search by counterparty, reference ID, amount, memo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-[4px] border border-[#D5DFEB] bg-white focus:outline-none focus:ring-2 focus:ring-[#012169] focus:border-transparent text-[#000f3c] placeholder-[#757682]"
            />
          </div>

          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Records' },
              { id: 'wires', label: 'Wires (Fedwire/SWIFT)' },
              { id: 'inflow', label: 'Credits (+)' },
              { id: 'outflow', label: 'Debits (−)' },
              { id: 'cards', label: 'Cards' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTypeFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-[4px] transition-colors whitespace-nowrap ${
                  selectedTypeFilter === tab.id
                    ? 'bg-[#012169] text-white font-semibold'
                    : 'text-[#444651] hover:bg-[#F2F6FA] border border-[#D5DFEB]'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* Status Filter dropdown */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-[4px] border border-[#D5DFEB] bg-white text-[#444651] font-medium focus:outline-none focus:ring-1 focus:ring-[#012169]"
            >
              <option value="all">All Statuses</option>
              <option value="cleared">Cleared Only</option>
              <option value="pending">Pending Only</option>
            </select>
          </div>

        </div>
      </div>

      {/* High-Density Ledger Table */}
      <div className="bg-white rounded-[8px] border border-[#D5DFEB] elevation-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D5DFEB] bg-[#F2F6FA]/70 text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                <th className="py-3 px-4">Date / Reference</th>
                <th className="py-3 px-4">Counterparty & Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Amount (USD)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EFF5] text-xs">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#757682]">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const signed = formatSignedCurrency(tx.amount);
                  const isSettled = tx.status === 'cleared';

                  return (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                    >
                      {/* Date & Reference */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#000f3c]">{tx.date}</div>
                        <div className="font-mono text-[11px] text-[#757682] flex items-center gap-1 mt-0.5">
                          <Hash className="w-3 h-3 text-[#768cd8]" />
                          <span>{tx.referenceId}</span>
                        </div>
                      </td>

                      {/* Counterparty & Description */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex items-center gap-1.5 font-bold text-[#000f3c]">
                          {getTypeIcon(tx.type)}
                          <span className="truncate">{tx.counterparty}</span>
                        </div>
                        <div className="text-[11px] text-[#444651] truncate mt-0.5">
                          {tx.description}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="text-[#444651] font-medium text-[11px]">
                          {tx.category}
                        </span>
                      </td>

                      {/* Account */}
                      <td className="py-3 px-4 text-[#757682] text-[11px]">
                        <span className="font-medium text-[#000f3c] block truncate max-w-[150px]">
                          {tx.accountName}
                        </span>
                      </td>

                      {/* Status Pill (spec: High-contrast, micro-padding 2px 8px, uppercase label-sm #E6F4EA/#FFF3D6) */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isSettled
                              ? 'bg-[#E6F4EA] text-[#0D8249]'
                              : 'bg-[#FFF3D6] text-[#B38200]'
                          }`}
                        >
                          {isSettled ? 'Cleared' : 'Pending'}
                        </span>
                      </td>

                      {/* Trailing Amount with explicit + or - and strict tabular numbers */}
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`font-mono font-bold text-sm tabular-nums ${
                            signed.isPositive ? 'text-[#0D8249]' : 'text-[#000f3c]'
                          }`}
                        >
                          {signed.text}
                        </span>
                        {tx.fee && tx.fee > 0 && (
                          <div className="text-[10px] text-[#757682] font-mono">
                            Fee: ${tx.fee.toFixed(2)}
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTx(tx);
                          }}
                          className="px-2 py-1 text-[11px] font-semibold text-[#012169] bg-[#EFF4FF] hover:bg-[#dce9ff] rounded-[4px] transition-colors"
                        >
                          Audit
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Ledger Footer */}
        <div className="p-3 bg-[#F2F6FA] border-t border-[#D5DFEB] flex items-center justify-between text-xs text-[#757682]">
          <span>Showing {filteredTransactions.length} of {transactions.length} record entries</span>
          <span className="flex items-center gap-1 font-medium text-[#012169]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0D8249]" />
            Continuous Cryptographic Ledger Attestation
          </span>
        </div>
      </div>

      {/* Transaction Audit Drawer / Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#012169]/40 backdrop-blur-sm">
          <div className="bg-white rounded-[8px] border border-[#D5DFEB] elevation-3 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-[#012169] text-white p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#768cd8] px-1.5 py-0.5 rounded-[2px] bg-[#001231]">
                    {selectedTx.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    selectedTx.status === 'cleared' ? 'bg-[#E6F4EA] text-[#0D8249]' : 'bg-[#FFF3D6] text-[#B38200]'
                  }`}>
                    {selectedTx.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-white mt-1">
                  Transaction Audit Record
                </h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-[#adc7ff] hover:text-white p-1 rounded-[4px] hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 text-xs text-[#0d1c2e] max-h-[80vh] overflow-y-auto">
              
              {/* Highlighted Amount Box */}
              <div className="p-4 rounded-[6px] bg-[#F2F6FA] border border-[#D5DFEB] flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#757682]">
                    Settled Amount
                  </span>
                  <div className={`font-display font-extrabold text-2xl tabular-nums ${
                    selectedTx.amount > 0 ? 'text-[#0D8249]' : 'text-[#000f3c]'
                  }`}>
                    {formatSignedCurrency(selectedTx.amount).text} USD
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#757682]">
                    Posting Time
                  </span>
                  <div className="font-mono text-xs font-semibold text-[#000f3c]">
                    {selectedTx.timestamp}
                  </div>
                </div>
              </div>

              {/* Counterparty & Routing Info */}
              <div className="space-y-3">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#444651] border-b border-[#E9EFF5] pb-1">
                  Settlement & Counterparty Specifications
                </h4>

                <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-[4px] border border-[#E9EFF5]">
                  <div>
                    <span className="text-[#757682] block text-[11px]">Beneficiary / Sender:</span>
                    <span className="font-bold text-[#000f3c] text-xs">{selectedTx.counterparty}</span>
                  </div>
                  <div>
                    <span className="text-[#757682] block text-[11px]">Primary Account:</span>
                    <span className="font-medium text-[#000f3c] text-xs">{selectedTx.accountName}</span>
                  </div>
                  <div>
                    <span className="text-[#757682] block text-[11px]">Reference ID:</span>
                    <span className="font-mono text-[#012169] font-bold text-xs">{selectedTx.referenceId}</span>
                  </div>
                  <div>
                    <span className="text-[#757682] block text-[11px]">Category:</span>
                    <span className="text-[#000f3c] font-medium text-xs">{selectedTx.category}</span>
                  </div>
                </div>

                {/* IMAD / OMAD Wire Tracing */}
                {(selectedTx.imadNumber || selectedTx.omadNumber) && (
                  <div className="bg-[#EFF4FF] p-3 rounded-[4px] border border-[#dce9ff] space-y-1.5 font-mono text-[11px]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#012169]">
                      Federal Reserve Wire Network Identifiers
                    </div>
                    {selectedTx.imadNumber && (
                      <div className="flex justify-between">
                        <span className="text-[#768cd8]">IMAD:</span>
                        <span className="text-[#012169] font-bold">{selectedTx.imadNumber}</span>
                      </div>
                    )}
                    {selectedTx.omadNumber && (
                      <div className="flex justify-between">
                        <span className="text-[#768cd8]">OMAD:</span>
                        <span className="text-[#012169] font-bold">{selectedTx.omadNumber}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Approvers & Governance Signatures */}
                {selectedTx.approvers && (
                  <div className="p-3 bg-[#F2F6FA] rounded-[4px] border border-[#D5DFEB]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#444651] mb-1.5">
                      Authorized Signatories & Attestation
                    </div>
                    <ul className="space-y-1">
                      {selectedTx.approvers.map((approver, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-xs text-[#000f3c]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0D8249]" />
                          <span>{approver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedTx.memo && (
                  <div>
                    <span className="text-[#757682] block text-[11px]">Payment Memo:</span>
                    <p className="p-2.5 bg-[#F8FAFC] border border-[#E9EFF5] rounded-[4px] text-xs font-mono text-[#000f3c]">
                      {selectedTx.memo}
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Actions */}
            <div className="bg-[#F2F6FA] p-4 border-t border-[#D5DFEB] flex items-center justify-between">
              <button
                onClick={() => {
                  alert(`Certified Wire Receipt generated for ${selectedTx.referenceId}`);
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-[4px] border border-[#D5DFEB] bg-white hover:bg-[#EFF4FF] text-[#012169] transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Certified Receipt (.PDF)</span>
              </button>

              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 text-xs font-bold rounded-[4px] bg-[#012169] hover:bg-[#001231] text-white transition-colors"
              >
                Close Audit Record
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
