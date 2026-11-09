export type AccountType = 'checking' | 'sweep_savings' | 'credit_line' | 'investment';

export interface BankAccount {
  id: string;
  name: string;
  type: AccountType;
  accountNumber: string; // e.g. "8824-0192-441"
  routingNumber: string; // e.g. "021000021"
  iban?: string;
  currency: string;
  availableBalance: number;
  ledgerBalance: number;
  interestRateAPY?: number;
  creditLimit?: number;
  accentColor: 'navy' | 'crimson' | 'emerald';
  entityName: string;
  institutionName: string;
}

export type TransactionStatus = 'cleared' | 'pending' | 'flagged';
export type TransactionType = 'wire_out' | 'wire_in' | 'ach_credit' | 'ach_debit' | 'card_purchase' | 'interest_sweep' | 'internal_transfer';

export interface Transaction {
  id: string;
  referenceId: string;
  accountId: string;
  accountName: string;
  date: string;
  timestamp: string;
  description: string;
  counterparty: string;
  type: TransactionType;
  category: string;
  amount: number; // positive for inflow, negative for outflow
  status: TransactionStatus;
  fee?: number;
  imadNumber?: string;
  omadNumber?: string;
  beneficiaryRouting?: string;
  beneficiaryAccount?: string;
  approvers?: string[];
  memo?: string;
}

export interface CommercialCard {
  id: string;
  cardholderName: string;
  lastFour: string;
  fullNumberMasked: string;
  expiry: string;
  cvv: string;
  type: 'Executive Obsidian Debit' | 'Corporate Infinite Credit' | 'Single-Use Virtual';
  status: 'active' | 'frozen';
  dailyLimit: number;
  monthlyLimit: number;
  spentThisMonth: number;
  billingAccount: string;
  isVirtual: boolean;
  virtualVendor?: string;
  categoryLocks: {
    aviation: boolean;
    hospitality: boolean;
    softwareSaaS: boolean;
    hardwareSupplies: boolean;
    professionalServices: boolean;
  };
}

export interface WireTransferRequest {
  sourceAccountId: string;
  wireType: 'ach' | 'fedwire' | 'swift';
  beneficiaryName: string;
  beneficiaryBank: string;
  beneficiaryRouting: string; // ABA or SWIFT BIC
  beneficiaryAccount: string;
  beneficiaryAddress?: string;
  amount: number;
  memo: string;
  purposeCode: string;
  requireDualAuth: boolean;
}

export interface CorporateSignatory {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'verified' | 'pending_signature';
  securityMethod: 'Hardware Token (YubiKey FIPS)' | 'Biometric Passkey' | 'Dual TOTP';
  approvalLimit: number;
  avatarUrl?: string;
}

export interface CurrencyPosition {
  code: string;
  name: string;
  symbol: string;
  balance: number;
  usdEquivalent: number;
  exchangeRate: number;
  change24h: number;
}
