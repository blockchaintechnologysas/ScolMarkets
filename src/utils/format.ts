type FormatCurrencyOptions = {
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export const formatCurrency = (
  value: number,
  locale: string,
  { currency = 'USD', minimumFractionDigits, maximumFractionDigits }: FormatCurrencyOptions = {},
) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: minimumFractionDigits ?? 2,
    maximumFractionDigits: maximumFractionDigits ?? 6,
  }).format(value);

export const formatCompactNumber = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
  }).format(value);

export const formatPercentage = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);

type FormatCryptoOptions = {
  symbol?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export const formatCrypto = (
  value: number,
  locale: string,
  { symbol = 'BTC', minimumFractionDigits = 0, maximumFractionDigits = 8 }: FormatCryptoOptions = {},
) => {
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);

  return `${symbol} ${formatted}`.trim();
};
