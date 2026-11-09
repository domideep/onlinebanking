import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Plus, 
  ShieldCheck, 
  Sliders, 
  Check, 
  Cpu, 
  Wifi, 
  AlertCircle,
  Copy,
  Sparkles,
  Building2,
  Plane,
  Server,
  Coffee,
  Briefcase,
  X
} from 'lucide-react';
import { CommercialCard } from '../types/banking';
import { formatCurrency } from '../utils/formatters';

interface CardsManagementProps {
  cards: CommercialCard[];
  onToggleFreeze: (cardId: string) => void;
  onUpdateLimit: (cardId: string, limitType: 'daily' | 'monthly', amount: number) => void;
  onCreateVirtualCard: (cardData: {
    cardholderName: string;
    dailyLimit: number;
    monthlyLimit: number;
    virtualVendor: string;
  }) => void;
}

export const CardsManagement: React.FC<CardsManagementProps> = ({
  cards,
  onToggleFreeze,
  onUpdateLimit,
  onCreateVirtualCard,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || '');
  const [revealedSensitives, setRevealedSensitives] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Virtual card modal
  const [showVirtualModal, setShowVirtualModal] = useState(false);
  const [newVendor, setNewVendor] = useState('');
  const [newCardLimit, setNewCardLimit] = useState('50000');
  const [newCardName, setNewCardName] = useState('DEV-INFRA / API EXPENSES');

  const selectedCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const toggleReveal = (id: string) => {
    setRevealedSensitives((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateVirtual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.trim()) return;
    const limit = parseFloat(newCardLimit) || 10000;
    onCreateVirtualCard({
      cardholderName: newCardName.toUpperCase(),
      dailyLimit: Math.round(limit * 0.3),
      monthlyLimit: limit,
      virtualVendor: newVendor,
    });
    setShowVirtualModal(false);
    setNewVendor('');
  };

  return (
    <div className="space-y-6">
      
      {/* Cards Header & Actions */}
      <div className="bg-white rounded-[8px] border border-[#D5DFEB] elevation-1 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-xl text-[#000f3c]">
              Executive Corporate Cards & Commercial Liquidity
            </h2>
            <p className="text-xs text-[#757682] mt-0.5">
              Obsidian titanium commercial debit, Infinite revolving lines, and single-use vendor virtual cards
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVirtualModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-[4px] bg-[#E31837] hover:bg-[#D4001A] text-white shadow-sm transition-all active:scale-[0.99]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue Virtual Burner Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Card Visual Showcase + Card Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Card Display & Card Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card Selector Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {cards.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCardId(c.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-[4px] transition-all whitespace-nowrap ${
                  selectedCardId === c.id
                    ? 'bg-[#012169] text-white font-semibold'
                    : 'bg-white text-[#444651] border border-[#D5DFEB] hover:bg-[#F2F6FA]'
                }`}
              >
                {c.type === 'Single-Use Virtual' ? 'Virtual Card' : c.lastFour} ({c.lastFour})
              </button>
            ))}
          </div>

          {/* Realistic High-Fidelity Metal Card */}
          {selectedCard && (
            <div className="relative">
              <div
                className={`relative w-full aspect-[1.586/1] rounded-[12px] p-6 text-white shadow-2xl overflow-hidden transition-all duration-300 ${
                  selectedCard.status === 'frozen'
                    ? 'bg-gradient-to-br from-[#1e293b] to-[#0f172a] grayscale opacity-75'
                    : selectedCard.type === 'Executive Obsidian Debit'
                    ? 'bg-gradient-to-br from-[#0a0f1d] via-[#012169] to-[#000f3c] border border-white/20'
                    : selectedCard.type === 'Corporate Infinite Credit'
                    ? 'bg-gradient-to-br from-[#1a1c29] via-[#2d1b2d] to-[#000f3c] border border-[#ffdad8]/30'
                    : 'bg-gradient-to-br from-[#042f2e] via-[#0f172a] to-[#012169] border border-emerald-400/30'
                }`}
              >
                {/* Subtle Guilloche / Metallic Watermark Texture */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                {/* Top Row: Heritage Kinetic Crest & Chip */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <svg className="w-8 h-6 shrink-0" viewBox="0 0 38 28" fill="none">
                      <rect x="0" y="1" width="15" height="4.5" rx="0.5" fill="#E31837" />
                      <rect x="0" y="8" width="15" height="4.5" rx="0.5" fill="#E31837" />
                      <rect x="0" y="15" width="15" height="4.5" rx="0.5" fill="#E31837" />
                      <rect x="0" y="22" width="15" height="4.5" rx="0.5" fill="#E31837" />
                      <rect x="18" y="1" width="20" height="4.5" rx="0.5" fill="#FFFFFF" />
                      <rect x="18" y="8" width="20" height="4.5" rx="0.5" fill="#FFFFFF" />
                      <rect x="18" y="15" width="20" height="4.5" rx="0.5" fill="#FFFFFF" />
                      <rect x="18" y="22" width="20" height="4.5" rx="0.5" fill="#FFFFFF" />
                    </svg>
                    <div>
                      <span className="font-display font-black text-xs tracking-wider uppercase block text-white/95">
                        BANK OF AMERICA
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-[#ffdad8] font-semibold">
                        {selectedCard.type} · bankofameriica
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white/70">
                    <Wifi className="w-5 h-5 rotate-90" />
                  </div>
                </div>

                {/* EMV Brass Microchip */}
                <div className="my-4 relative z-10 flex items-center gap-3">
                  <div className="w-11 h-9 rounded-[4px] bg-gradient-to-tr from-[#d4af37] via-[#f7e7a9] to-[#b38200] border border-[#8a6800] shadow-inner p-1 flex items-center justify-center">
                    <div className="w-full h-full border border-black/20 rounded-[2px] grid grid-cols-2 gap-0.5">
                      <div className="border-r border-b border-black/20"></div>
                      <div className="border-b border-black/20"></div>
                      <div className="border-r border-black/20"></div>
                      <div></div>
                    </div>
                  </div>
                  {selectedCard.isVirtual && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-[2px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                      Single-Use Virtual
                    </span>
                  )}
                </div>

                {/* Card Number Masked / Revealed */}
                <div className="my-2 relative z-10 flex items-center justify-between">
                  <span className="font-mono text-lg sm:text-xl font-bold tracking-[0.18em] text-white/95 drop-shadow">
                    {revealedSensitives[selectedCard.id]
                      ? selectedCard.fullNumberMasked
                      : `•••• •••• •••• ${selectedCard.lastFour}`}
                  </span>
                  <button
                    onClick={() => toggleReveal(selectedCard.id)}
                    className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10"
                    title={revealedSensitives[selectedCard.id] ? 'Hide Number' : 'Show Number'}
                  >
                    {revealedSensitives[selectedCard.id] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Bottom Row: Cardholder Name, Expiry & CVV */}
                <div className="mt-4 pt-2 border-t border-white/10 flex items-end justify-between relative z-10 text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-white/60 block">
                      Cardholder
                    </span>
                    <span className="font-semibold uppercase tracking-wider text-white/95 text-xs truncate max-w-[160px] block">
                      {selectedCard.cardholderName}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-white/60 block">
                        Expires
                      </span>
                      <span className="font-mono font-medium text-white/95 text-xs">
                        {selectedCard.expiry}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-white/60 block">
                        CVV
                      </span>
                      <span className="font-mono font-medium text-white/95 text-xs">
                        {revealedSensitives[selectedCard.id] ? selectedCard.cvv : '•••'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Frosted Frozen Overlay if status is frozen */}
                {selectedCard.status === 'frozen' && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px] flex flex-col items-center justify-center gap-2 z-20">
                    <Lock className="w-8 h-8 text-white/80 animate-bounce" />
                    <span className="font-display font-bold text-sm uppercase tracking-wider text-white">
                      Card Securely Frozen
                    </span>
                    <span className="text-[10px] text-white/70">
                      Transactions will be declined automatically.
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Card Action Buttons */}
              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  onClick={() => onToggleFreeze(selectedCard.id)}
                  className={`flex-1 py-2 px-3 rounded-[4px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    selectedCard.status === 'frozen'
                      ? 'bg-[#0D8249] hover:bg-[#0b6c3d] text-white'
                      : 'bg-white hover:bg-[#ffdad6] text-[#ba1a1a] border border-[#ffdad6]'
                  }`}
                >
                  {selectedCard.status === 'frozen' ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Unfreeze Card</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Freeze Instantly</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => copyToClipboard(selectedCard.fullNumberMasked, 'copy-num')}
                  className="py-2 px-3 rounded-[4px] bg-white border border-[#D5DFEB] hover:bg-[#F2F6FA] text-xs font-semibold text-[#012169] flex items-center gap-1.5"
                >
                  {copiedId === 'copy-num' ? (
                    <Check className="w-3.5 h-3.5 text-[#0D8249]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy Number</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Spend Limits & Merchant Category Locks (7 cols) */}
        {selectedCard && (
          <div className="lg:col-span-7 space-y-5">
            
            {/* Card Information & Limits Card */}
            <div className="bg-white rounded-[8px] border border-[#D5DFEB] elevation-1 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E9EFF5]">
                <div>
                  <h3 className="font-display font-bold text-base text-[#000f3c]">
                    Spending & Velocity Controls
                  </h3>
                  <p className="text-[11px] text-[#757682]">
                    Billing against {selectedCard.billingAccount}
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  selectedCard.status === 'active' ? 'bg-[#E6F4EA] text-[#0D8249]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                }`}>
                  {selectedCard.status}
                </span>
              </div>

              {/* Monthly Spend Progress */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#444651]">MTD Spend vs Monthly Limit:</span>
                  <span className="font-mono font-bold text-[#000f3c]">
                    {formatCurrency(selectedCard.spentThisMonth)} / {formatCurrency(selectedCard.monthlyLimit)}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#F2F6FA] rounded-full overflow-hidden border border-[#D5DFEB]">
                  <div
                    className="h-full bg-[#012169] rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        (selectedCard.spentThisMonth / selectedCard.monthlyLimit) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Limit Sliders */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#444651]">Daily Transaction Velocity Cap</span>
                    <span className="font-mono font-bold text-[#012169]">
                      {formatCurrency(selectedCard.dailyLimit)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={selectedCard.dailyLimit}
                    onChange={(e) =>
                      onUpdateLimit(selectedCard.id, 'daily', parseFloat(e.target.value))
                    }
                    className="w-full accent-[#012169] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#757682]">
                    <span>$10,000</span>
                    <span>$250,000</span>
                    <span>$500,000</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#444651]">Monthly Aggregate Limit</span>
                    <span className="font-mono font-bold text-[#012169]">
                      {formatCurrency(selectedCard.monthlyLimit)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="2000000"
                    step="25000"
                    value={selectedCard.monthlyLimit}
                    onChange={(e) =>
                      onUpdateLimit(selectedCard.id, 'monthly', parseFloat(e.target.value))
                    }
                    className="w-full accent-[#012169] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#757682]">
                    <span>$50,000</span>
                    <span>$1,000,000</span>
                    <span>$2,000,000</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Merchant Category Locks */}
            <div className="bg-white rounded-[8px] border border-[#D5DFEB] elevation-1 p-5 space-y-3">
              <h3 className="font-display font-bold text-sm text-[#000f3c]">
                Merchant Category Authorization Rules
              </h3>
              <p className="text-[11px] text-[#757682]">
                Instant geofencing and SIC/MCC whitelist rules for authorized corporate spend
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {[
                  { key: 'aviation', label: 'Commercial & Private Aviation', icon: Plane, enabled: selectedCard.categoryLocks.aviation },
                  { key: 'softwareSaaS', label: 'Enterprise Software & Cloud', icon: Server, enabled: selectedCard.categoryLocks.softwareSaaS },
                  { key: 'hospitality', label: 'Corporate Dining & Lodging', icon: Coffee, enabled: selectedCard.categoryLocks.hospitality },
                  { key: 'professionalServices', label: 'Legal & Accounting Retainers', icon: Briefcase, enabled: selectedCard.categoryLocks.professionalServices },
                ].map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.key}
                      className="p-2.5 rounded-[4px] border border-[#E9EFF5] bg-[#F2F6FA] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#012169]" />
                        <span className="font-medium text-[#000f3c]">{cat.label}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cat.enabled ? 'bg-[#E6F4EA] text-[#0D8249]' : 'bg-[#EFF4FF] text-[#757682]'
                      }`}>
                        {cat.enabled ? 'Allowed' : 'Blocked'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Issue Virtual Card Modal */}
      {showVirtualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#012169]/40 backdrop-blur-[8px]">
          <div className="bg-white rounded-[8px] border border-[#D5DFEB] elevation-3 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#012169] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Issue Single-Use Virtual Card
                </h3>
                <p className="text-xs text-[#adc7ff]">
                  Instant disposable tokenized credentials for vendor subscription or hardware invoice
                </p>
              </div>
              <button
                onClick={() => setShowVirtualModal(false)}
                className="text-[#adc7ff] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVirtual} className="p-5 space-y-4 text-xs text-[#0d1c2e]">
              <div>
                <label className="block text-[11px] uppercase font-bold text-[#444651] mb-1">
                  Cardholder Label / Cost Center
                </label>
                <input
                  type="text"
                  required
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  className="w-full p-2.5 rounded-[4px] border border-[#D5DFEB] bg-white font-mono text-xs text-[#000f3c]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-[#444651] mb-1">
                  Approved Vendor / Merchant Whitelist
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OpenAI LLC or Anthropic PBC"
                  value={newVendor}
                  onChange={(e) => setNewVendor(e.target.value)}
                  className="w-full p-2.5 rounded-[4px] border border-[#D5DFEB] bg-white text-xs text-[#000f3c]"
                />
                <span className="text-[10px] text-[#757682] mt-0.5 block">
                  Transactions from non-matching merchants will be declined automatically.
                </span>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-[#444651] mb-1">
                  Monthly Spend Ceiling (USD)
                </label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  required
                  value={newCardLimit}
                  onChange={(e) => setNewCardLimit(e.target.value)}
                  className="w-full p-2.5 rounded-[4px] border border-[#D5DFEB] bg-white font-mono text-xs text-[#000f3c]"
                />
              </div>

              <div className="pt-3 border-t border-[#E9EFF5] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowVirtualModal(false)}
                  className="px-3.5 py-2 rounded-[4px] border border-[#D5DFEB] bg-white text-[#012169] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[4px] bg-[#E31837] hover:bg-[#D4001A] text-white text-xs font-bold"
                >
                  Generate & Activate Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
