import React, { useState } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Globe, 
  Zap, 
  Key, 
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { BankAccount, Transaction } from '../types/banking';
import { formatCurrency } from '../utils/formatters';

interface WireTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: BankAccount[];
  onSubmitWire: (wireData: {
    sourceAccountId: string;
    beneficiaryName: string;
    beneficiaryBank: string;
    beneficiaryRouting: string;
    beneficiaryAccount: string;
    amount: number;
    wireType: 'fedwire' | 'swift' | 'ach';
    memo: string;
    category: string;
  }) => void;
}

export const WireTransferModal: React.FC<WireTransferModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onSubmitWire,
}) => {
  const [wireType, setWireType] = useState<'fedwire' | 'swift' | 'ach'>('fedwire');
  const [sourceAccountId, setSourceAccountId] = useState<string>(accounts[0]?.id || '');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryBank, setBeneficiaryBank] = useState('');
  const [beneficiaryRouting, setBeneficiaryRouting] = useState('');
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState('Vendor & Supplier Disbursement');
  const [memo, setMemo] = useState('');
  const [maskAccount, setMaskAccount] = useState(false);

  // Authorization Step State
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authCode, setAuthCode] = useState('892041');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  if (!isOpen) return null;

  const numericAmount = parseFloat(amountStr) || 0;
  const sourceAccount = accounts.find((a) => a.id === sourceAccountId) || accounts[0];
  const fee = wireType === 'fedwire' ? 25.00 : wireType === 'swift' ? 45.00 : 0.00;
  const totalDeduction = numericAmount + fee;
  const requiresDualSignatory = numericAmount >= 100000;

  // Preset quick fill for test convenience
  const handleQuickFill = (recipient: 'nvidia' | 'lawfirm' | 'cloud') => {
    if (recipient === 'nvidia') {
      setBeneficiaryName('NVIDIA Corporation');
      setBeneficiaryBank('JPMorgan Chase Bank, N.A. (New York)');
      setBeneficiaryRouting('021000021');
      setBeneficiaryAccount('9948-2210-4419');
      setAmountStr('250000');
      setMemo('Lot #DGX-9941 Enterprise GPU accelerator expansion');
      setWireType('fedwire');
    } else if (recipient === 'lawfirm') {
      setBeneficiaryName('Latham & Watkins LLP');
      setBeneficiaryBank('Citibank N.A. (San Francisco)');
      setBeneficiaryRouting('121000086');
      setBeneficiaryAccount('3301-8849-0012');
      setAmountStr('45000');
      setMemo('Global Corporate Structuring Q4 Retainer');
      setWireType('fedwire');
    } else {
      setBeneficiaryName('Amazon Web Services, Inc.');
      setBeneficiaryBank('Bank of America, N.A. (Seattle)');
      setBeneficiaryRouting('125000024');
      setBeneficiaryAccount('7710-9923-1104');
      setAmountStr('38500');
      setMemo('Commercial cloud cluster compute batch 882');
      setWireType('ach');
    }
  };

  const handleProceedToAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return;
    if (numericAmount > (sourceAccount?.availableBalance || 0)) {
      alert('Insufficient available funds in selected source account.');
      return;
    }
    setIsAuthorizing(true);
  };

  const handleConfirmWire = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setAuthSuccess(true);
      setTimeout(() => {
        onSubmitWire({
          sourceAccountId,
          beneficiaryName,
          beneficiaryBank,
          beneficiaryRouting,
          beneficiaryAccount,
          amount: numericAmount,
          wireType,
          memo,
          category,
        });
        onClose();
        // reset form
        setIsAuthorizing(false);
        setAuthSuccess(false);
        setAmountStr('');
        setBeneficiaryName('');
        setBeneficiaryAccount('');
        setBeneficiaryRouting('');
        setBeneficiaryBank('');
        setMemo('');
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#012169]/40 backdrop-blur-[8px]">
      <div className="bg-white rounded-[8px] border border-[#D5DFEB] elevation-3 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header with Signature Navy */}
        <div className="bg-[#012169] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[4px] bg-[#001231] border border-[#768cd8]/30">
              <Send className="w-5 h-5 text-[#adc7ff]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                Initiate Outbound Institutional Payment
              </h2>
              <p className="text-xs text-[#adc7ff]">
                Same-Day Fedwire RTGS · International SWIFT MT103 · Corporate ACH
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#adc7ff] hover:text-white p-1 rounded-[4px] hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!isAuthorizing ? (
          <form onSubmit={handleProceedToAuth} className="p-6 space-y-5 text-xs text-[#0d1c2e] max-h-[80vh] overflow-y-auto">
            
            {/* Quick Fill Helpers for convenience */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E9EFF5]">
              <span className="text-[11px] font-semibold text-[#757682] uppercase tracking-wider">
                Authorized Counterparties:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('nvidia')}
                  className="px-2.5 py-1 bg-[#EFF4FF] hover:bg-[#dce9ff] text-[#012169] rounded-[4px] font-semibold text-[11px] transition-colors"
                >
                  + NVIDIA ($250k)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('lawfirm')}
                  className="px-2.5 py-1 bg-[#EFF4FF] hover:bg-[#dce9ff] text-[#012169] rounded-[4px] font-semibold text-[11px] transition-colors"
                >
                  + Latham Law ($45k)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('cloud')}
                  className="px-2.5 py-1 bg-[#EFF4FF] hover:bg-[#dce9ff] text-[#012169] rounded-[4px] font-semibold text-[11px] transition-colors"
                >
                  + AWS ($38.5k)
                </button>
              </div>
            </div>

            {/* Step 1: Transfer Network Type Selector */}
            <div>
              <label className="block text-[11px] uppercase font-bold text-[#444651] mb-1.5">
                Settlement Rail & Clearing System
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setWireType('fedwire')}
                  className={`p-3 rounded-[4px] border text-left transition-all ${
                    wireType === 'fedwire'
                      ? 'border-[#012169] bg-[#EFF4FF] ring-1 ring-[#012169]'
                      : 'border-[#D5DFEB] hover:bg-[#F2F6FA]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#012169] flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-[#E31837]" />
                      Fedwire RTGS
                    </span>
                    <span className="font-mono text-[10px] text-[#757682]">$25.00 fee</span>
                  </div>
                  <p className="text-[10px] text-[#444651]">
                    Same-day real-time gross settlement via Federal Reserve.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setWireType('swift')}
                  className={`p-3 rounded-[4px] border text-left transition-all ${
                    wireType === 'swift'
                      ? 'border-[#012169] bg-[#EFF4FF] ring-1 ring-[#012169]'
                      : 'border-[#D5DFEB] hover:bg-[#F2F6FA]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#012169] flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-[#012169]" />
                      SWIFT MT103
                    </span>
                    <span className="font-mono text-[10px] text-[#757682]">$45.00 fee</span>
                  </div>
                  <p className="text-[10px] text-[#444651]">
                    International cross-border foreign exchange transfer.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setWireType('ach')}
                  className={`p-3 rounded-[4px] border text-left transition-all ${
                    wireType === 'ach'
                      ? 'border-[#012169] bg-[#EFF4FF] ring-1 ring-[#012169]'
                      : 'border-[#D5DFEB] hover:bg-[#F2F6FA]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#012169] flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-[#0D8249]" />
                      Corporate ACH
                    </span>
                    <span className="font-mono text-[10px] text-[#0D8249] font-bold">Free ($0)</span>
                  </div>
                  <p className="text-[10px] text-[#444651]">
                    Next-day automated clearing house disbursement.
                  </p>
                </button>
              </div>
            </div>

            {/* Step 2: Source Account Selector */}
            <div>
              <label className="block text-[11px] uppercase font-bold text-[#444651] mb-1.5">
                Debiting Account
              </label>
              <select
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(e.target.value)}
                className="w-full p-2.5 rounded-[4px] border border-[#D5DFEB] bg-white text-xs font-medium text-[#000f3c] focus:outline-none focus:ring-2 focus:ring-[#012169]"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} — Available: {formatCurrency(acc.availableBalance)} ({acc.accountNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Beneficiary Legal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-[#444651] mb-1.5">
                  Beneficiary Legal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NVIDIA Corporation"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  className="w-full p-2.5 rounded-[4px] border border-[#D5DFEB] bg-white text-xs text-[#000f3c] focus:outline-none focus:ring-2 focus:ring-[#012169]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-[#444651] mb-1.5">
                  Beneficiary Institution / Bank
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JPMorgan Chase Bank, N.A."
                  value={beneficiaryBank}
                  onChange={(e) => setBeneficiaryBank(e.target.value)}
                  className="w-full p-2.5 rounded-[4px] border border-[#D5DFEB] bg-white text-xs text-[#000f3c] focus:outline-none focus:ring-2 focus:ring-[#012169]"
                />
              </div>
            </div>

            {/* Routing & Account Numbers with Monospaced Tracking and Masking */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-[#444651] mb-1.5">
                  {wireType === 'swift' ? 'SWIFT / BIC Code' : 'Routing Transit Number (ABA 9-digit)'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={wireType === 'swift' ? 'CHASUS33XXX' : '021000021'}
                  value={beneficiaryRouting}
                  onChange={(e) => setBeneficiaryRouting(e.target.value)}
                  className="w-full p-2.5 rounded-[4px] border border-[#D5DFEB] bg-white font-mono text-xs text-[#000f3c] focus:outline-none focus:ring-2 focus:ring-[#012169]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] uppercase font-bold text-[#444651]">
                    {wireType === 'swift' ? 'IBAN / Beneficiary Account' : 'Beneficiary Account Number'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setMaskAccount(!maskAccount)}
                    className="text-[#757682] hover:text-[#012169] text-[11px] flex items-center gap-1"
                  >
                    {maskAccount ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{maskAccount ? 'Show' : 'Mask'}</span>
                  </button>
                </div>
                <input
                  type={maskAccount ? 'password' : 'text'}
                  required
                  placeholder="e.g. 9948-2210-4419"
                  value={beneficiaryAccount}
                  onChange={(e) => setBeneficiaryAccount(e.target.value)}
                  className="w-full p-2.5 rounded-[4px] border border-[#D5DFEB] bg-white font-mono text-xs text-[#000f3c] focus:outline-none focus:ring-2 focus:ring-[#012169]"
                />
              </div>
            </div>

            {/* Amount and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-[#444651] mb-1.5">
                  Transfer Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm text-[#757682]">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="0.00"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="w-full pl-7 pr-3 py-2.5 rounded-[4px] border border-[#D5DFEB] bg-white font-display font-bold text-base tabular-nums text-[#000f3c] focus:outline-none focus:ring-2 focus:ring-[#012169]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-[#444651] mb-1.5">
                  Financial Ledger Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-[4px] border border-[#D5DFEB] bg-white text-xs text-[#000f3c] focus:outline-none focus:ring-2 focus:ring-[#012169]"
                >
                  <option value="Vendor & Supplier Disbursement">Vendor & Supplier Disbursement</option>
                  <option value="Capital Infrastructure">Capital Infrastructure</option>
                  <option value="Corporate Payroll Sweep">Corporate Payroll Sweep</option>
                  <option value="Tax & Regulatory Escrow">Tax & Regulatory Escrow</option>
                  <option value="Legal & Advisory Retainer">Legal & Advisory Retainer</option>
                  <option value="Internal Treasury Repositioning">Internal Treasury Repositioning</option>
                </select>
              </div>
            </div>

            {/* Memo & IMAD Reference Instructions */}
            <div>
              <label className="block text-[11px] uppercase font-bold text-[#444651] mb-1.5">
                Payment Memo / Reference Details
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Invoice #NV-884910 DGX cluster hardware procurement tranche 1"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full p-2.5 rounded-[4px] border border-[#D5DFEB] bg-white text-xs text-[#000f3c] focus:outline-none focus:ring-2 focus:ring-[#012169]"
              />
            </div>

            {/* Settlement Summary & Fee calculation */}
            <div className="p-3.5 bg-[#F2F6FA] rounded-[6px] border border-[#D5DFEB] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#757682]">Principal Amount:</span>
                <span className="font-mono font-bold text-[#000f3c] tabular-nums">
                  {formatCurrency(numericAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#757682]">Fedwire / SWIFT Network Fee:</span>
                <span className="font-mono text-[#000f3c] tabular-nums">
                  {formatCurrency(fee)}
                </span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-[#D5DFEB] font-bold text-[#000f3c]">
                <span>Total Settled Outflow:</span>
                <span className="font-mono text-sm text-[#012169] tabular-nums">
                  {formatCurrency(totalDeduction)}
                </span>
              </div>

              {requiresDualSignatory && (
                <div className="flex items-center gap-2 p-2 mt-2 bg-[#FFF3D6] text-[#B38200] rounded-[4px] text-[11px] font-semibold border border-[#ffdad6]">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#B38200]" />
                  <span>
                    Dual-Signatory Rule: Payments $\ge$ $100,000.00 require cryptographic co-sign approval.
                  </span>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E9EFF5]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-[4px] border border-[#D5DFEB] bg-white hover:bg-[#F2F6FA] text-xs font-semibold text-[#012169] transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={numericAmount <= 0}
                className="px-5 py-2.5 rounded-[4px] bg-[#E31837] hover:bg-[#D4001A] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm active:scale-[0.99] flex items-center gap-2"
              >
                <span>Proceed to Cryptographic Sign-Off</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        ) : (
          /* Step 2: Layer 3 Cryptographic Authorization Screen */
          <div className="p-6 space-y-5 text-xs text-[#0d1c2e]">
            
            {authSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-[#E6F4EA] text-[#0D8249] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#000f3c]">
                  Wire Cleared & Dispatched
                </h3>
                <p className="text-xs text-[#757682] max-w-sm mx-auto">
                  Federal Reserve IMAD acknowledgement generated. Funds debited from {sourceAccount.name}.
                </p>
              </div>
            ) : (
              <>
                <div className="p-4 bg-[#EFF4FF] border border-[#dce9ff] rounded-[6px] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#012169]">
                    <ShieldCheck className="w-4 h-4 text-[#0D8249]" />
                    <span>Executive Wire Authorization & Dual Signatory Verification</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-[#768cd8] block">Disbursement To:</span>
                      <span className="font-bold text-[#000f3c]">{beneficiaryName}</span>
                    </div>
                    <div>
                      <span className="text-[#768cd8] block">Settlement Sum:</span>
                      <span className="font-mono font-bold text-[#000f3c]">{formatCurrency(totalDeduction)}</span>
                    </div>
                    <div>
                      <span className="text-[#768cd8] block">Account Debited:</span>
                      <span className="text-[#000f3c]">{sourceAccount.name}</span>
                    </div>
                    <div>
                      <span className="text-[#768cd8] block">Network:</span>
                      <span className="text-[#012169] font-bold">{wireType.toUpperCase()} RTGS</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-[#444651] mb-1">
                      Signatory 1: Chief Financial Officer (Marcus Sterling)
                    </label>
                    <div className="flex items-center justify-between p-2.5 rounded-[4px] bg-[#F2F6FA] border border-[#D5DFEB]">
                      <div className="flex items-center gap-2 text-xs font-medium text-[#000f3c]">
                        <Key className="w-4 h-4 text-[#0D8249]" />
                        <span>YubiKey 5 FIPS Token #99214-HSM</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase text-[#0D8249] bg-[#E6F4EA] px-2 py-0.5 rounded-full">
                        Signatory Verified
                      </span>
                    </div>
                  </div>

                  {requiresDualSignatory && (
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-[#444651] mb-1">
                        Signatory 2: Corporate Treasurer (Evelyn Vance) - Co-Sign Passkey
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={authCode}
                          onChange={(e) => setAuthCode(e.target.value)}
                          className="flex-1 p-2 rounded-[4px] border border-[#D5DFEB] bg-white font-mono text-center text-sm font-bold tracking-widest text-[#000f3c] focus:outline-none focus:ring-2 focus:ring-[#012169]"
                          placeholder="6-digit TOTP Token"
                        />
                        <button
                          type="button"
                          onClick={() => setAuthCode('924810')}
                          className="px-2.5 py-2 text-[10px] font-semibold bg-[#EFF4FF] text-[#012169] rounded-[4px] hover:bg-[#dce9ff]"
                        >
                          Simulate TOTP
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="text-[11px] text-[#757682] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#0D8249]" />
                    <span>
                      Cryptographic digest sha256: 7f83b165... will be signed with institutional private key.
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E9EFF5]">
                  <button
                    type="button"
                    onClick={() => setIsAuthorizing(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs font-semibold rounded-[4px] border border-[#D5DFEB] bg-white hover:bg-[#F2F6FA] text-[#012169]"
                  >
                    Back to Edit
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmWire}
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-[4px] bg-[#E31837] hover:bg-[#D4001A] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Transmitting to Fedwire...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Authorize & Dispatch Wire</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
