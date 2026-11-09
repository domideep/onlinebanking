/**
 * Formatting utilities for institutional banking data
 */

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCompactCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function maskAccountNumber(accNum: string, isVisible: boolean): string {
  if (isVisible) return accNum;
  const parts = accNum.split('-');
  if (parts.length > 1) {
    return `••••-••••-${parts[parts.length - 1]}`;
  }
  return `•••• •••• •••• ${accNum.slice(-4)}`;
}

export function formatSignedCurrency(amount: number): { text: string; isPositive: boolean } {
  const isPositive = amount > 0;
  const absFormatted = formatCurrency(Math.abs(amount));
  return {
    text: isPositive ? `+${absFormatted}` : `−${absFormatted}`,
    isPositive,
  };
}
