import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Globe, 
  Calendar, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownLeft, 
  BarChart3, 
  ShieldCheck, 
  PieChart 
} from 'lucide-react';
import { CASH_FLOW_HISTORY, CURRENCY_POSITIONS } from '../data/mockData';
import { formatCurrency, formatCompactCurrency } from '../utils/formatters';

export const CashFlowAnalytics: React.FC = () => {
  const [selectedHorizon, setSelectedHorizon] = useState<'30d' | '60d' | '90d'>('30d');

  const maxVal = Math.max(...CASH_FLOW_HISTORY.map((d) => Math.max(d.inflows, d.outflows)));

  const totalForeignEquiv = CURRENCY_POSITIONS.reduce(
    (sum, pos) => sum + (pos.code !== 'USD' ? pos.usdEquivalent : 0),
    0
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-[8px] border border-[#D5DFEB] elevation-1 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-xl text-[#000f3c]">
              Institutional Cash Flow & Treasury Intelligence
            </h2>
            <p className="text-xs text-[#757682] mt-0.5">
              Multi-entity liquidity modeling, foreign currency hedging reserves, and yield analytics
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#F2F6FA] p-1 rounded-[4px] border border-[#D5DFEB]">
            {(['30d', '60d', '90d'] as const).map((horizon) => (
              <button
                key={horizon}
                onClick={() => setSelectedHorizon(horizon)}
                className={`px-3 py-1 text-xs font-semibold rounded-[3px] transition-colors ${
                  selectedHorizon === horizon
                    ? 'bg-white text-[#012169] shadow-sm'
                    : 'text-[#444651] hover:text-[#012169]'
                }`}
              >
                {horizon.toUpperCase()} Forecast
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-[8px] border border-[#D5DFEB] elevation-1">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#757682] mb-1">
            Net Cash Flow (MTD)
          </div>
          <div className="font-display font-bold text-2xl text-[#0D8249] tabular-nums">
            +$3,440,080.00
          </div>
          <div className="text-[11px] text-[#444651] mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-[#0D8249]" />
            <span>+18.4% compared to Oct</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[8px] border border-[#D5DFEB] elevation-1">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#757682] mb-1">
            Monthly Operational Inflow
          </div>
          <div className="font-display font-bold text-2xl text-[#012169] tabular-nums">
            $4,950,000.00
          </div>
          <div className="text-[11px] text-[#757682] mt-1">
            Accounts receivable & venture tranches
          </div>
        </div>

        <div className="bg-white p-5 rounded-[8px] border border-[#D5DFEB] elevation-1">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#757682] mb-1">
            Operational Outflow (Burn)
          </div>
          <div className="font-display font-bold text-2xl text-[#000f3c] tabular-nums">
            $1,509,920.00
          </div>
          <div className="text-[11px] text-[#757682] mt-1">
            Payroll, cloud infra & HW shipments
          </div>
        </div>

        <div className="bg-white p-5 rounded-[8px] border border-[#D5DFEB] elevation-1">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#757682] mb-1">
            Treasury Yield Accrual (Q4)
          </div>
          <div className="font-display font-bold text-2xl text-[#012169] tabular-nums">
            +$112,480.12
          </div>
          <div className="text-[11px] text-[#0D8249] mt-1 font-semibold">
            Blended yield rate: 4.88% APY
          </div>
        </div>

      </div>

      {/* Cash Flow Visual Chart + Multi-currency Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Monthly Inflow vs Outflow Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-[8px] border border-[#D5DFEB] elevation-1 p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9EFF5]">
            <div>
              <h3 className="font-display font-bold text-base text-[#000f3c]">
                Monthly Inflow vs Outflow Historicals
              </h3>
              <p className="text-[11px] text-[#757682]">
                Cash balance velocity comparison in millions USD
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-[#444651]">
                <span className="w-3 h-3 rounded-[2px] bg-[#012169]"></span>
                <span>Inflows</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-[#444651]">
                <span className="w-3 h-3 rounded-[2px] bg-[#E31837]"></span>
                <span>Outflows</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="space-y-4 pt-2">
            {CASH_FLOW_HISTORY.map((item) => {
              const inflowPercent = (item.inflows / maxVal) * 100;
              const outflowPercent = (item.outflows / maxVal) * 100;

              return (
                <div key={item.month} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-[#000f3c]">
                    <span>{item.month}</span>
                    <span className="font-mono text-[#0D8249]">
                      Net: +{formatCompactCurrency(item.net)}
                    </span>
                  </div>

                  {/* Dual Bar Track */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3.5 bg-[#EFF4FF] rounded-[2px] overflow-hidden">
                        <div
                          className="h-full bg-[#012169] rounded-[2px] transition-all"
                          style={{ width: `${inflowPercent}%` }}
                        ></div>
                      </div>
                      <span className="w-16 font-mono text-[11px] text-right text-[#012169] font-bold">
                        {formatCompactCurrency(item.inflows)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3.5 bg-[#FFF0F2] rounded-[2px] overflow-hidden">
                        <div
                          className="h-full bg-[#E31837] rounded-[2px] transition-all"
                          style={{ width: `${outflowPercent}%` }}
                        ></div>
                      </div>
                      <span className="w-16 font-mono text-[11px] text-right text-[#E31837] font-bold">
                        {formatCompactCurrency(item.outflows)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-[#F2F6FA] rounded-[6px] border border-[#D5DFEB] text-xs text-[#444651] flex items-center justify-between">
            <span>90-Day Projected Cash Runway: <strong>48.2 months</strong> at current burn</span>
            <span className="text-[#0D8249] font-semibold">Positive Cash Flow Surplus</span>
          </div>

        </div>

        {/* Right: Foreign Currency FX Positions (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-[8px] border border-[#D5DFEB] elevation-1 p-6 space-y-4">
          <div className="pb-3 border-b border-[#E9EFF5]">
            <h3 className="font-display font-bold text-base text-[#000f3c]">
              Multi-Currency FX Reserves
            </h3>
            <p className="text-[11px] text-[#757682]">
              Hedging balances held across international correspondent banks
            </p>
          </div>

          <div className="divide-y divide-[#E9EFF5]">
            {CURRENCY_POSITIONS.map((curr) => (
              <div key={curr.code} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-[3px] bg-[#012169] text-white flex items-center justify-center font-bold text-xs">
                      {curr.symbol}
                    </span>
                    <div>
                      <span className="font-bold text-xs text-[#000f3c]">{curr.code}</span>
                      <span className="text-[10px] text-[#757682] block">{curr.name}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-xs text-[#000f3c] tabular-nums">
                      {curr.symbol}{curr.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-[#757682] tabular-nums font-mono">
                      ≈ {formatCurrency(curr.usdEquivalent)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#757682] pt-1">
                  <span>1 {curr.code} = ${curr.exchangeRate.toFixed(4)} USD</span>
                  <span className={curr.change24h >= 0 ? 'text-[#0D8249] font-bold' : 'text-[#E31837] font-bold'}>
                    {curr.change24h >= 0 ? `+${curr.change24h}%` : `${curr.change24h}%`} (24h)
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E9EFF5] text-xs">
            <div className="flex justify-between font-bold text-[#000f3c]">
              <span>Non-USD Foreign Reserve Value:</span>
              <span className="font-mono text-[#012169]">{formatCurrency(totalForeignEquiv)}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
