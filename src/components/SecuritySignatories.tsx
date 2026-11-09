import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Key, 
  UserCheck, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  FileCheck, 
  Smartphone, 
  Cpu, 
  Download 
} from 'lucide-react';
import { CorporateSignatory } from '../types/banking';
import { CORPORATE_SIGNATORIES } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';

interface SecuritySignatoriesProps {
  onOpenStatementModal: () => void;
}

export const SecuritySignatories: React.FC<SecuritySignatoriesProps> = ({
  onOpenStatementModal,
}) => {
  const [dualAuthThreshold, setDualAuthThreshold] = useState<number>(100000);
  const [ipRestricted, setIpRestricted] = useState<boolean>(true);
  const [hardwareKeyMandatory, setHardwareKeyMandatory] = useState<boolean>(true);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#001231] text-white px-4 py-3 rounded-[4px] border border-[#768cd8] shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#0D8249]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-[8px] border border-[#D5DFEB] elevation-1 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-xl text-[#000f3c]">
              Institutional Governance, Signatories & Vault Security
            </h2>
            <p className="text-xs text-[#757682] mt-0.5">
              SOX & OCC compliant dual-control treasury rules, hardware security tokens, and tamper-evident audit trails
            </p>
          </div>

          <button
            onClick={onOpenStatementModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-[4px] bg-[#012169] hover:bg-[#001231] text-white shadow-sm transition-all"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Generate Certified Audit Statement</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Authorized Signatories Registry (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="bg-white rounded-[8px] border border-[#D5DFEB] elevation-1 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9EFF5]">
              <div>
                <h3 className="font-display font-bold text-base text-[#000f3c]">
                  Active Authorized Corporate Signatories
                </h3>
                <p className="text-[11px] text-[#757682]">
                  Corporate resolution on file with Heritage Kinetic General Counsel
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D8249] bg-[#E6F4EA] px-2.5 py-0.5 rounded-full">
                3 of 3 Enrolled
              </span>
            </div>

            <div className="space-y-3">
              {CORPORATE_SIGNATORIES.map((sig) => (
                <div
                  key={sig.id}
                  className="p-4 rounded-[6px] border border-[#D5DFEB] bg-[#F2F6FA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-[#000f3c]">
                        {sig.name}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#0D8249] bg-[#E6F4EA] px-2 py-0.2 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                    <div className="text-xs text-[#444651] font-medium">{sig.role}</div>
                    <div className="text-[11px] text-[#757682] font-mono">{sig.email}</div>
                  </div>

                  <div className="sm:text-right space-y-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#D5DFEB]">
                    <div className="text-[11px] text-[#757682]">Single Signature Authority:</div>
                    <div className="font-mono font-bold text-sm text-[#012169] tabular-nums">
                      {formatCurrency(sig.approvalLimit)}
                    </div>
                    <div className="flex sm:justify-end items-center gap-1 text-[10px] text-[#444651]">
                      <Key className="w-3 h-3 text-[#012169]" />
                      <span>{sig.securityMethod}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Tamper-Evident System Audit Trail */}
          <div className="bg-white rounded-[8px] border border-[#D5DFEB] elevation-1 p-5 space-y-3">
            <h3 className="font-display font-bold text-base text-[#000f3c]">
              Recent Security Attestations & Access Log
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { time: 'Today, 10:48 AM', event: 'Hardware Token Challenge Passed (YubiKey FIPS 140-3)', user: 'Marcus Sterling (CFO)', ip: '198.51.100.24 (HQ Dedicated Fiber)' },
                { time: 'Today, 09:42 AM', event: 'Federal Reserve Wire Terminal Cleared Inbound Funds', user: 'System Automated', ip: 'FedLine Advantage Peer #0210' },
                { time: 'Nov 08, 16:30', event: 'Dual-Approval Wire Dispatched ($214,500.00)', user: 'Marcus Sterling + Evelyn Vance', ip: '198.51.100.24' },
                { time: 'Nov 07, 14:00', event: 'Payroll Batch Cryptographic Digest Generated', user: 'Elena Rostova', ip: '198.51.100.24' },
              ].map((log, idx) => (
                <div key={idx} className="p-2.5 rounded-[4px] bg-[#F8FAFC] border border-[#E9EFF5] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] gap-1">
                  <div>
                    <span className="font-semibold text-[#000f3c]">{log.event}</span>
                    <span className="text-[#757682] block text-[10px]">{log.user} · {log.ip}</span>
                  </div>
                  <span className="font-mono text-[#757682] shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Governance Policy Engine (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="bg-white rounded-[8px] border border-[#D5DFEB] elevation-1 p-5 space-y-4">
            <div className="pb-3 border-b border-[#E9EFF5]">
              <h3 className="font-display font-bold text-base text-[#000f3c]">
                Dual-Control Wire Governance Rule
              </h3>
              <p className="text-[11px] text-[#757682]">
                Mandate two independent executive keys for high-value disbursements
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-[#444651]">Dual-Approval Threshold Amount:</span>
                  <span className="font-mono font-bold text-[#012169]">
                    {formatCurrency(dualAuthThreshold)}
                  </span>
                </div>
                <input
                  type="range"
                  min="25000"
                  max="500000"
                  step="25000"
                  value={dualAuthThreshold}
                  onChange={(e) => {
                    setDualAuthThreshold(parseFloat(e.target.value));
                    showFeedback(`Dual-authorization threshold updated to ${formatCurrency(parseFloat(e.target.value))}`);
                  }}
                  className="w-full accent-[#012169] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#757682]">
                  <span>$25,000</span>
                  <span>$250,000</span>
                  <span>$500,000</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E9EFF5] space-y-3">
                
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[#000f3c]">Mandatory Hardware FIPS Key</div>
                    <div className="text-[10px] text-[#757682]">
                      Require physical YubiKey or HSM token for all outbound wires
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setHardwareKeyMandatory(!hardwareKeyMandatory);
                      showFeedback(`Hardware Key policy ${!hardwareKeyMandatory ? 'Enforced' : 'Relaxed'}`);
                    }}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      hardwareKeyMandatory ? 'bg-[#012169]' : 'bg-[#D5DFEB]'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        hardwareKeyMandatory ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[#000f3c]">IP Geofencing & Static Route</div>
                    <div className="text-[10px] text-[#757682]">
                      Disallow wire dispatch outside company corporate ASN / VPN
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIpRestricted(!ipRestricted);
                      showFeedback(`IP Geofencing ${!ipRestricted ? 'Activated' : 'Disabled'}`);
                    }}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      ipRestricted ? 'bg-[#012169]' : 'bg-[#D5DFEB]'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        ipRestricted ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>

              </div>

              <div className="p-3 bg-[#EFF4FF] border border-[#dce9ff] rounded-[4px] text-[11px] text-[#012169] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0D8249] shrink-0" />
                <span>
                  Policy version #POL-2026-v4 cryptographically stamped by Board Resolution #881.
                </span>
              </div>

            </div>
          </div>

          {/* Statement Export Quick Box */}
          <div className="bg-[#012169] text-white rounded-[8px] p-5 space-y-3">
            <h3 className="font-display font-bold text-base text-white">
              Official Institutional Statements
            </h3>
            <p className="text-xs text-[#adc7ff]">
              Generate watermarked PDF verification letters for auditors, tax authorities, and credit rating agencies.
            </p>
            <button
              onClick={onOpenStatementModal}
              className="w-full py-2.5 px-3 rounded-[4px] bg-[#E31837] hover:bg-[#D4001A] text-white text-xs font-bold transition-colors text-center"
            >
              Generate Certified Monthly Statement
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
