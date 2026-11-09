import React, { useState } from 'react';
import { 
  Building2, 
  ChevronDown, 
  FileText, 
  Layers, 
  ReceiptText, 
  Send, 
  ShieldCheck, 
  CreditCard, 
  TrendingUp, 
  Lock,
  CheckCircle2,
  X
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenWireModal: () => void;
  onOpenStatementModal: () => void;
  selectedEntity: string;
  onSelectEntity: (entity: string) => void;
  totalLiquidity: number;
  onCloseMobileMenu?: () => void;
  isMobileDrawer?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenWireModal,
  onOpenStatementModal,
  selectedEntity,
  onSelectEntity,
  onCloseMobileMenu,
  isMobileDrawer = false,
}) => {
  const [showEntityMenu, setShowEntityMenu] = useState(false);

  const entities = [
    { name: 'Apex Global Holdings LLC', id: 'CORP-8824', type: 'Parent Corporate Entity' },
    { name: 'Apex Strategic Ventures Ltd.', id: 'VENT-4091', type: 'Venture Capital HoldCo' },
    { name: 'Sterling Family Heritage Trust', id: 'TRST-0042', type: 'Private Wealth Family Trust' },
  ];

  const navItems = [
    { id: 'overview', label: 'Treasury Overview', icon: Layers, desc: 'Liquidity balances & accounts' },
    { id: 'ledger', label: 'Transaction Ledger', icon: ReceiptText, desc: 'Fedwire & settlement trail' },
    { id: 'wires', label: 'Wires & Transfers', icon: Send, desc: 'RTGS, SWIFT & ACH rails' },
    { id: 'cards', label: 'Commercial Cards', icon: CreditCard, desc: 'Obsidian metal & virtual cards' },
    { id: 'analytics', label: 'Cash Flow Intelligence', icon: TrendingUp, desc: 'Runway & FX positions' },
    { id: 'governance', label: 'Governance & Vault', icon: Lock, desc: 'Dual-control & signatories' },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  const handleWireClick = () => {
    onOpenWireModal();
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  const handleStatementClick = () => {
    onOpenStatementModal();
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  return (
    <aside
      className={`bg-white border-r border-[#D5DFEB] flex flex-col justify-between ${
        isMobileDrawer ? 'w-full h-full' : 'w-full lg:w-72 shrink-0 elevation-1'
      }`}
    >
      
      {/* Top Details Section */}
      <div className="p-4 space-y-5 overflow-y-auto">
        
        {/* If Mobile Drawer: Header with Bank Logo & Close Button */}
        {isMobileDrawer && (
          <div className="flex items-center justify-between pb-3 border-b border-[#D5DFEB]">
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
              <div>
                <div className="font-display font-bold text-sm text-[#012169] leading-tight">
                  Bank of America
                </div>
                <div className="font-mono text-[10px] text-[#E31837] font-semibold leading-tight">
                  bankofameriica
                </div>
              </div>
            </div>

            <button
              onClick={onCloseMobileMenu}
              className="p-1.5 rounded-[4px] text-[#444651] hover:text-[#012169] hover:bg-[#F2F6FA] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* 1. Navigation Tabs */}
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#757682] px-1 mb-2">
            Treasury Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs rounded-[4px] transition-all text-left ${
                    isActive
                      ? 'bg-[#012169] text-white font-bold shadow-xs'
                      : 'text-[#444651] hover:bg-[#F2F6FA] hover:text-[#012169] font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#E31837]' : 'text-[#012169]'}`} />
                  <div className="truncate">
                    <div>{item.label}</div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-[#adc7ff]' : 'text-[#757682]'}`}>
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 2. Security & Compliance Section */}
        <div className="pt-2 border-t border-[#E9EFF5]">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#757682] px-1 mb-2">
            Security & Compliance
          </div>

          <div className="p-3 rounded-[4px] bg-[#F2F6FA] border border-[#D5DFEB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#012169]">
                <span className="w-2 h-2 rounded-full bg-[#0D8249] animate-pulse"></span>
                <span>FIPS 140-3 HSM</span>
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#E6F4EA] text-[#0D8249]">
                ONLINE
              </span>
            </div>

            <div className="text-[10px] text-[#444651] space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-[#757682]">Cipher:</span>
                <span className="text-[#012169] font-semibold">AES_256_GCM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#757682]">Session ID:</span>
                <span className="text-[#012169]">#BOFA-88241</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#757682]">Dual Auth:</span>
                <span className="text-[#0D8249] font-semibold">&gt;$100,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Active Corporate Entity */}
        <div className="pt-2 border-t border-[#E9EFF5]">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#757682] px-1 mb-2">
            Active Corporate Entity
          </div>

          <div className="relative">
            <button
              onClick={() => setShowEntityMenu(!showEntityMenu)}
              className="w-full flex items-center justify-between p-2.5 rounded-[4px] bg-[#F2F6FA] border border-[#D5DFEB] hover:border-[#012169] transition-colors text-left"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Building2 className="w-4 h-4 text-[#012169] shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-bold text-[#000f3c] truncate">
                    {selectedEntity}
                  </div>
                  <div className="text-[10px] text-[#757682]">
                    Corporate Treasury Master
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#444651] shrink-0 ml-1" />
            </button>

            {showEntityMenu && (
              <div className="absolute bottom-full left-0 mb-1 w-full bg-white text-[#0d1c2e] rounded-[4px] elevation-3 border border-[#D5DFEB] py-1 z-50 shadow-xl">
                <div className="px-3 py-1.5 border-b border-[#D5DFEB] text-[10px] uppercase font-bold text-[#757682]">
                  Select Account Entity
                </div>
                {entities.map((ent) => (
                  <button
                    key={ent.id}
                    onClick={() => {
                      onSelectEntity(ent.name);
                      setShowEntityMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-[#F2F6FA] flex items-center justify-between transition-colors ${
                      selectedEntity === ent.name ? 'bg-[#EFF4FF] font-bold text-[#012169]' : 'text-[#0d1c2e]'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate">{ent.name}</div>
                      <div className="text-[10px] text-[#757682]">{ent.type}</div>
                    </div>
                    {selectedEntity === ent.name && (
                      <CheckCircle2 className="w-4 h-4 text-[#0D8249] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. Primary Actions (PLACED UNDER ACTIVE CORPORATE ENTITY AS REQUESTED) */}
        <div className="pt-2 border-t border-[#E9EFF5] space-y-2">
          <button
            onClick={handleWireClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[4px] bg-[#E31837] hover:bg-[#D4001A] text-white text-xs font-bold shadow-sm transition-all active:scale-[0.99]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Initiate Fedwire / SWIFT</span>
          </button>

          <button
            onClick={handleStatementClick}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-[4px] bg-[#EFF4FF] hover:bg-[#dce9ff] text-[#012169] text-xs font-semibold border border-[#dce9ff] transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Certified Audit Statement</span>
          </button>
        </div>

      </div>

      {/* 5. Bottom Legal Accreditation Badge */}
      <div className="p-4 border-t border-[#D5DFEB] bg-[#F8FAFC] text-[10px] text-[#757682] space-y-1 shrink-0">
        <div className="font-bold text-[#012169]">Bank of America, N.A.</div>
        <div>Member FDIC · Equal Housing Lender</div>
        <div className="font-mono text-[9px] text-[#757682]">Fed District 2 · Routing 026009593</div>
      </div>

    </aside>
  );
};
