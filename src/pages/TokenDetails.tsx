import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  blockExplorerUrl,
  chainId,
  nativeCurrency,
  networkName,
  platformName,
  qrGeneratorBaseUrl,
  rpcUrls,
} from '../config/environment.ts';
import { useTokenDetails } from '../hooks/useTokensData.ts';
import type { Token, TokenSocialKey } from '../types/token.ts';
import type { TokenPrice } from '../types/price.ts';
import { formatCompactNumber, formatCrypto, formatCurrency, formatPercentage } from '../utils/format.ts';
import './TokenDetails.css';

type TokenDetailsProps = {
  symbol: string;
  onBack: () => void;
};

type Metric = {
  key: string;
  value: string;
};

type PriceRow = {
  key: string;
  label: string;
  value: string;
  description: string;
};


type SocialDefinition = {
  key: TokenSocialKey;
  labelKey: string;
  renderIcon: () => ReactNode;
};

type WebsiteLinkIconType = 'website' | 'price' | 'wallet' | 'explorer';

type WebsiteLinkKey = 'official' | 'price' | 'wallet' | 'explorer';

type WebsiteLink = {
  key: WebsiteLinkKey;
  label: string;
  href: string;
  icon: WebsiteLinkIconType;
};

const sanitizeUrl = (value?: string | null): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const formatSupplyValue = (value: Token['totalSupply'], locale: string) =>
  value === null || value === undefined ? '—' : formatCompactNumber(value, locale);

const shortenAddress = (address: string) => {
  if (!address) {
    return '';
  }

  const trimmed = address.trim();
  if (trimmed.length <= 12) {
    return trimmed;
  }

  return `${trimmed.slice(0, 6)}…${trimmed.slice(-4)}`;
};

const buildExplorerUrl = (address: string, baseUrl: string = defaultExplorerHomepageUrl) => {
  const trimmedBase = baseUrl.replace(/\/+$/, '');
  return `${trimmedBase}/token/${address}`;
};
const defaultExplorerHomepageUrl = 'https://explorador.scolcoin.com/';
const priceDashboardUrl = 'https://price.scolcoin.com/';
const scolWalletUrl = 'https://wallet.scolcoin.com/';


const WebsiteLinkIcon = ({ type }: { type: WebsiteLink['icon'] }) => {
  switch (type) {
    case 'website':
      return (
        <svg viewBox="0 0 24 24" focusable="false">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M3.5 12h17M12 3c2.2 2.3 3.5 5.5 3.5 9s-1.3 6.7-3.5 9c-2.2-2.3-3.5-5.5-3.5-9S9.8 5.3 12 3Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'price':
      return (
        <svg viewBox="0 0 24 24" focusable="false">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fontFamily="inherit"
            fill="currentColor"
          >
            $
          </text>
        </svg>
      );
    case 'wallet':
      return (
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M3.5 8.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M18.5 10.5h2a1.8 1.8 0 0 1 0 3.6h-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="12.5" r="1" fill="currentColor" />
        </svg>
      );
    case 'explorer':
      return (
        <svg viewBox="0 0 24 24" focusable="false">
          <circle cx="11" cy="11" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="m14.5 14.5 5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
};

type AddEthereumChainParameter = {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
};

type EthereumProvider = {
  isMetaMask?: boolean;
  request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

type MetaMaskFeedback = 'success' | 'error' | 'unavailable' | 'config';

const MetaMaskIcon = () => (
  <svg viewBox="0 0 36 36" focusable="false" aria-hidden="true">
    <path
      d="m8.1 4.5 7.7 5.6-1.4-3.3Z"
      fill="#E17726"
      stroke="#E17726"
      strokeLinejoin="round"
      strokeWidth="0.5"
    />
    <path
      d="m27.9 4.5-7.6 5.6 1.3-3.3Z"
      fill="#E27625"
      stroke="#E27625"
      strokeLinejoin="round"
      strokeWidth="0.5"
    />
    <path
      d="m8 4.5 7.4 12-0.2-6.4Z"
      fill="#E27625"
      stroke="#E27625"
      strokeLinejoin="round"
      strokeWidth="0.5"
    />
    <path
      d="m28 4.5-7.6 12 0.2-6.4Z"
      fill="#E27625"
      stroke="#E27625"
      strokeLinejoin="round"
      strokeWidth="0.5"
    />
    <path
      d="m15.2 16.5 5.6 0-0.5 3.8-5-3.8Z"
      fill="#E17726"
      stroke="#E17726"
      strokeLinejoin="round"
      strokeWidth="0.5"
    />
    <path
      d="m14.8 22 5.4 0.3-5.9 4.4Z"
      fill="#E27625"
      stroke="#E27625"
      strokeLinejoin="round"
      strokeWidth="0.5"
    />
    <path
      d="m21.3 22.3 5.4-0.3-5-3.5Z"
      fill="#E27625"
      stroke="#E27625"
      strokeLinejoin="round"
      strokeWidth="0.5"
    />
    <path
      d="m11.1 17.2 3.9-0.7-1.4 3.9Z"
      fill="#E27625"
      stroke="#E27625"
      strokeLinejoin="round"
      strokeWidth="0.5"
    />
    <path
      d="m24.9 16.5-3.8 3.9 1.4-3.9Z"
      fill="#E27625"
      stroke="#E27625"
      strokeLinejoin="round"
      strokeWidth="0.5"
    />
    <path
      d="m15.2 26.6 2.3-1.1-1.9-1.1Z"
      fill="#D5BFB2"
      stroke="#D5BFB2"
      strokeLinejoin="round"
      strokeWidth="0.5"
    />
    <path
      d="m20.8 26.6-2.3-1.1 1.9-1.1Z"
      fill="#D5BFB2"
      stroke="#D5BFB2"
      strokeLinejoin="round"
      strokeWidth="0.5"
    />
    <path
      d="m17.5 25.5-2.3 1.1 0.2-1.9Z"
      fill="#233447"
      stroke="#233447"
      strokeLinejoin="round"
      strokeWidth="0.5"
    />
    <path
      d="m18.5 25.5 2.3 1.1-0.1-1.9Z"
      fill="#233447"
      stroke="#233447"
      strokeLinejoin="round"
      strokeWidth="0.5"
    />
  </svg>
);

const buildPriceRows = (
  priceData: TokenPrice | null,
  token: Token,
  locale: string,
  descriptions: Record<string, string>,
): PriceRow[] => {
  const sources = [priceData, token.priceData ?? null];

  const getValue = (extract: (data: TokenPrice) => number | undefined): number | undefined => {
    for (const source of sources) {
      if (!source) {
        continue;
      }

      const candidate = extract(source);
      if (typeof candidate === 'number' && Number.isFinite(candidate)) {
        return candidate;
      }
    }

    return undefined;
  };

  const entries = [
    {
      key: 'usd',
      label: 'USD',
      value: () => getValue((data) => data.usd) ?? token.price,
      formatter: (amount: number) =>
        formatCurrency(amount, locale, {
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        }),
    },
    {
      key: 'cop',
      label: 'COP',
      value: () => getValue((data) => data.cop),
      formatter: (amount: number) =>
        formatCurrency(amount, locale, {
          currency: 'COP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }),
    },
    {
      key: 'eur',
      label: 'EUR',
      value: () => getValue((data) => data.eur),
      formatter: (amount: number) =>
        formatCurrency(amount, locale, {
          currency: 'EUR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        }),
    },
    {
      key: 'gbp',
      label: 'GBP',
      value: () => getValue((data) => data.gbp),
      formatter: (amount: number) =>
        formatCurrency(amount, locale, {
          currency: 'GBP',
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        }),
    },
    {
      key: 'brl',
      label: 'BRL',
      value: () => getValue((data) => data.brl),
      formatter: (amount: number) =>
        formatCurrency(amount, locale, {
          currency: 'BRL',
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        }),
    },
    {
      key: 'jpy',
      label: 'JPY',
      value: () => getValue((data) => data.jpy),
      formatter: (amount: number) =>
        formatCurrency(amount, locale, {
          currency: 'JPY',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }),
    },
    {
      key: 'cny',
      label: 'CNY',
      value: () => getValue((data) => data.cny),
      formatter: (amount: number) =>
        formatCurrency(amount, locale, {
          currency: 'CNY',
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        }),
    },
    {
      key: 'btc',
      label: 'BTC',
      value: () => getValue((data) => data.btc),
      formatter: (amount: number) =>
        formatCrypto(amount, locale, {
          symbol: 'BTC',
          minimumFractionDigits: 0,
          maximumFractionDigits: 8,
        }),
    },
  ] as const;

  return entries.flatMap((entry) => {
    const amount = entry.value();
    if (typeof amount !== 'number' || !Number.isFinite(amount)) {
      return [];
    }

    return [
      {
        key: entry.key,
        label: entry.label,
        value: entry.formatter(amount),
        description: descriptions[entry.key] ?? entry.label,
      },
    ];
  });
};

const buildMarketMetrics = (token: Token, locale: string, lastUpdatedLabel: string): Metric[] => {
  const volumeValue = Number.isFinite(token.volume24h)
    ? formatCurrency(token.volume24h, locale, {
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '—';

  const marketCapValue = Number.isFinite(token.marketCap)
    ? formatCurrency(token.marketCap, locale, {
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    : '—';

  const changeValue = Number.isFinite(token.change24h)
    ? (() => {
        const formatted = formatPercentage(Math.abs(token.change24h), locale);
        return token.change24h >= 0 ? `+${formatted}` : `-${formatted}`;
      })()
    : '—';

  return [
    { key: 'marketCap', value: marketCapValue },
    { key: 'volume24h', value: volumeValue },
    { key: 'change24h', value: changeValue },
    { key: 'lastUpdated', value: lastUpdatedLabel },
  ];
};

const socialDefinitions: readonly SocialDefinition[] = [
  {
    key: 'facebook',
    labelKey: 'facebook',
    renderIcon: () => (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M22 12a10 10 0 1 0-11.5 9.9v-7H8.8V11h1.7V9.3c0-1.7 1-3.4 3.4-3.4.7 0 1.5.1 2.2.2v2.4h-1.2c-1 0-1.4.6-1.4 1.3V11h2.6l-.4 3h-2.2v7A10 10 0 0 0 22 12Z"
        />
      </svg>
    ),
  },
  {
    key: 'instagram',
    labelKey: 'instagram',
    renderIcon: () => (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: 'x',
    labelKey: 'x',
    renderIcon: () => (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M3 3h5l4 6 4-6h5l-7 9 7 9h-5l-4-6-4 6H3l7-9Z"
        />
      </svg>
    ),
  },
  {
    key: 'youtube',
    labelKey: 'youtube',
    renderIcon: () => (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M21.6 8.2c-.2-1-.9-1.8-2-2C18 6 12 6 12 6s-6 0-7.6.2c-1.1.2-1.8 1-2 2C2 9.8 2 12 2 12s0 2.2.4 3.8c.2 1 .9 1.8 2 2C6 18 12 18 12 18s6 0 7.6-.2c1.1-.2 1.8-1 2-2 .4-1.6.4-3.8.4-3.8s0-2.2-.4-3.8ZM10 15.2V8.8l5.2 3.2Z"
        />
      </svg>
    ),
  },
  {
    key: 'tiktok',
    labelKey: 'tiktok',
    renderIcon: () => (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M16.5 4c.4 1.2 1.4 2.1 2.7 2.3v3c-1.5-.1-2.9-.6-4-1.4v6.6c0 3.1-2.5 5.5-5.6 5.5S4 17.6 4 14.5c0-2.3 1.4-4.2 3.4-5v3c-.6.5-1 .9-1 1.7 0 1.1.9 2 2 2s2-.9 2-2V4h3a3 3 0 0 0 .1.8Z"
        />
      </svg>
    ),
  },
  {
    key: 'reddit',
    labelKey: 'reddit',
    renderIcon: () => (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M21.3 12.3c0-1.3-1-2.3-2.2-2.3-.6 0-1.1.2-1.5.5-1-.7-2.4-1.2-3.9-1.2l.7-3.5 2.4.5c.1.7.7 1.3 1.5 1.3s1.5-.7 1.5-1.5S19.8 4.8 19 4.8c-.5 0-.9.2-1.3.6l-2.9-.6c-.2 0-.4.1-.5.3l-.8 3.8c-1.6 0-3.1.5-4.2 1.2-.4-.4-.9-.6-1.5-.6-1.2 0-2.2 1-2.2 2.3 0 .8.4 1.5 1 1.9-.1.3-.1.6-.1.9 0 2.5 2.7 4.5 6 4.5s6-2 6-4.5c0-.3 0-.6-.1-.9.6-.4 1-.1 1-1.9ZM8.4 14c0-.8.7-1.4 1.4-1.4s1.4.6 1.4 1.4-.6 1.4-1.4 1.4-1.4-.6-1.4-1.4Zm7.6 2.6c-.9 1-2.4 1.5-3.9 1.5s-3-.5-3.9-1.5c-.2-.2-.2-.4 0-.6s.4-.2.6 0c.7.8 1.9 1.2 3.3 1.2s2.6-.4 3.3-1.2c.2-.2.4-.2.6 0s.2.4 0 .6Zm-.6-1.2c-.8 0-1.4-.6-1.4-1.4s.6-1.4 1.4-1.4 1.4.6 1.4 1.4-.6 1.4-1.4 1.4Z"
        />
      </svg>
    ),
  },
  {
    key: 'telegram',
    labelKey: 'telegram',
    renderIcon: () => (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="m21.5 4.2-18 7c-.8.3-.8 1.4 0 1.7l4.3 1.7 1.6 5.2c.2.7 1.1.8 1.5.2l2.2-2.8 4.3 3.2c.6.4 1.4.1 1.6-.6l2.6-14.1c.1-.8-.6-1.5-1.4-1.3Zm-5.1 4L10 13.3l-.2 3-1-3.5 7.6-4.6Z"
        />
      </svg>
    ),
  },
  {
    key: 'discord',
    labelKey: 'discord',
    renderIcon: () => (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M21 6.5c-1.4-.6-2.8-1-4.3-1.2-.2.4-.5.8-.7 1.1-1.9-.3-3.9-.3-5.8 0-.2-.3-.5-.7-.7-1.1C7.7 5.5 6.3 6 4.9 6.5 2.8 11 2.1 15.2 2.3 19.5c1.9 1.3 3.9 1.8 6 1.9.5-.6.9-1.2 1.1-1.9-.7-.3-1.3-.6-2-.9.2-.2.3-.4.5-.7.7.3 1.4.6 2.1.8 1.3.3 2.7.3 4 0 .7-.2 1.4-.5 2.1-.8.2.2.3.5.5.7-.7.3-1.3.6-2 .9.3.7.7 1.3 1.1 1.9 2-.1 4.1-.6 6-1.9.2-4.3-.5-8.5-2.6-13Zm-9.3 9c-1 0-1.7-.8-1.7-1.8s.8-1.8 1.7-1.8 1.7.8 1.7 1.8-.8 1.8-1.7 1.8Zm4.7 0c-1 0-1.7-.8-1.7-1.8s.8-1.8 1.7-1.8 1.7.8 1.7 1.8-.8 1.8-1.7 1.8Z"
        />
      </svg>
    ),
  },
];

export const TokenDetails = ({ symbol, onBack }: TokenDetailsProps) => {
  const { t, i18n } = useTranslation();
  const normalizedSymbol = symbol.toLowerCase();
  const { token, priceData, isLoading, errorKey, lastUpdated } = useTokenDetails(normalizedSymbol);
  const locale = i18n.language;
  const overviewTitle = t('title', { platform: platformName });

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    if (token) {
      document.title = `${token.name} (${token.symbol}) | ${platformName}`;
      return () => {
        document.title = overviewTitle;
      };
    }

    document.title = overviewTitle;

    return undefined;
  }, [overviewTitle, token]);

  const lastUpdatedLabel = useMemo(
    () =>
      lastUpdated
        ? new Intl.DateTimeFormat(locale, {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(lastUpdated)
        : t('stats.notAvailable'),
    [lastUpdated, locale, t],
  );

  const currencyDescriptions = useMemo(
    () =>
      (t('details.currencyDescriptions', { returnObjects: true }) as Record<string, string>) ?? {},
    [i18n.language, t],
  );

  const priceRows = useMemo(
    () => (token ? buildPriceRows(priceData, token, locale, currencyDescriptions) : []),
    [currencyDescriptions, locale, priceData, token],
  );

  const marketMetrics = useMemo(
    () => (token ? buildMarketMetrics(token, locale, lastUpdatedLabel) : []),
    [lastUpdatedLabel, locale, token],
  );


  const socialLinks = useMemo(() => {
    if (!token?.socials) {
      return [];
    }

    return socialDefinitions.flatMap((definition) => {
      const url = token.socials?.[definition.key];
      if (!url) {
        return [];
      }

      const label = t(`details.socialLabels.${definition.labelKey}`);
      const description = t('details.socialVisit', { network: label, token: token?.name ?? '' });

      return [
        {
          key: definition.key,
          url,
          label,
          description,
          renderIcon: definition.renderIcon,
        },
      ];
    });

  }, [t, token]);

  const supplyMetrics = useMemo(() => {
    if (!token) {
      return [];
    }

    return [
      {
        key: 'totalSupply',
        label: t('table.headers.totalSupply'),
        value: formatSupplyValue(token.totalSupply, locale),
      },
      {
        key: 'circulatingSupply',
        label: t('table.headers.circulatingSupply'),
        value: formatSupplyValue(token.circulatingSupply, locale),
      },
      {
        key: 'maxSupply',
        label: t('table.headers.maxSupply'),
        value: formatSupplyValue(token.maxSupply, locale),
      },
    ];
  }, [locale, t, token]);

  const handleBackClick = () => {
    onBack();
  };

  if (!token) {
    return (
      <main className="token-details" aria-live="polite">
        <button type="button" className="token-details__back" onClick={handleBackClick}>
          <span aria-hidden="true" className="token-details__back-icon">
            <svg viewBox="0 0 20 20" focusable="false">
              <path
                d="M12.5 5.5 7.5 10l5 4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {t('details.back')}
        </button>

        <div className="token-details__empty">
          <h2>{t('details.notFoundTitle')}</h2>
          <p>{t('details.notFoundDescription')}</p>
        </div>
      </main>
    );
  }

  const hasOracleData = Boolean(priceData?.status);
  const derivedPriceData = priceData ?? token.priceData ?? null;
  const oracleStatusKey = hasOracleData ? 'online' : 'offline';
  const oracleBadgeClass = hasOracleData
    ? 'token-details__oracle-badge--online'
    : 'token-details__oracle-badge--offline';
  const oracleStatusLabel = t(`details.oracleStatus.${oracleStatusKey}`);
  const oracleUpdatedLabel = lastUpdated
    ? t('details.oracleUpdated', { time: lastUpdatedLabel })
    : t('details.oraclePending');
  const oracleHint = hasOracleData ? t('details.oracleLive') : t('details.oracleFallback');
  const changeClass = token.change24h >= 0 ? 'token-details__change--positive' : 'token-details__change--negative';
  const changeDisplay = Number.isFinite(token.change24h)
    ? (() => {
        const formatted = formatPercentage(Math.abs(token.change24h), locale);
        return `${token.change24h >= 0 ? '+' : '-'}${formatted}`;
      })()
    : null;
  const resolvedExplorerHomepageUrl = useMemo(
    () => sanitizeUrl(blockExplorerUrl) ?? defaultExplorerHomepageUrl,
    [blockExplorerUrl],
  );
  const nativeAccountsExplorerUrl = useMemo(
    () => `${resolvedExplorerHomepageUrl.replace(/\/+$/, '')}/accounts`,
    [resolvedExplorerHomepageUrl],
  );
  const nativeAccountsExplorerDisplay = useMemo(
    () => nativeAccountsExplorerUrl.replace(/^https?:\/\//, ''),
    [nativeAccountsExplorerUrl],
  );
  const explorerUrl = useMemo(
    () =>
      token.isNative
        ? nativeAccountsExplorerUrl
        : buildExplorerUrl(token.address, resolvedExplorerHomepageUrl),
    [nativeAccountsExplorerUrl, resolvedExplorerHomepageUrl, token.address, token.isNative],
  );
  const explorerDisplay = useMemo(
    () => (token.isNative ? nativeAccountsExplorerDisplay : shortenAddress(token.address)),
    [nativeAccountsExplorerDisplay, token.address, token.isNative],
  );
  const explorerLabel = useMemo(
    () =>
      token.isNative
        ? t('details.openAccountsExplorer')
        : `${t('details.openInExplorer', { token: token.symbol })}. ${token.address}`,
    [t, token.address, token.isNative, token.symbol],
  );
  const hasNativeContractInfo = token.isNative && Boolean(nativeAccountsExplorerUrl);

  const shouldRenderContractCard =
    !token.isNative || Boolean(derivedPriceData?.wallet) || hasNativeContractInfo;

  const qrImageUrl = useMemo(() => {
    if (token.isNative || !token.address) {
      return null;
    }

    const params = new URLSearchParams({
      size: '240x240',
      data: token.address,
      format: 'svg',
      margin: '0',
    });

    return `${qrGeneratorBaseUrl}?${params.toString()}`;
  }, [token.address, token.isNative]);

  const websiteLinks = useMemo<WebsiteLink[]>(() => {
    if (!token) {
      return [];
    }

    const links: WebsiteLink[] = [];
    const officialUrl = sanitizeUrl(token.website);
    if (officialUrl) {
      links.push({
        key: 'official',
        href: officialUrl,
        label: t('details.websiteLinks.official'),
        icon: 'website',
      });
    }

    const priceUrl = sanitizeUrl(priceDashboardUrl);
    if (priceUrl) {
      links.push({
        key: 'price',
        href: priceUrl,
        label: t('details.websiteLinks.price'),
        icon: 'price',
      });
    }

    const walletUrl = sanitizeUrl(scolWalletUrl);
    if (walletUrl) {
      links.push({
        key: 'wallet',
        href: walletUrl,
        label: t('details.websiteLinks.wallet'),
        icon: 'wallet',
      });
    }

    const explorerUrl = sanitizeUrl(resolvedExplorerHomepageUrl);
    if (explorerUrl) {
      links.push({
        key: 'explorer',
        href: explorerUrl,
        label: t('details.websiteLinks.explorer'),
        icon: 'explorer',
      });
    }

    return links;
  }, [resolvedExplorerHomepageUrl, t, token]);

  const shouldRenderWebsiteSection = websiteLinks.some((link) => link.key === 'official');

  const sanitizedRpcUrls = useMemo(
    () =>
      rpcUrls
        .map((url) => (typeof url === 'string' ? url.trim() : ''))
        .filter((url) => url.length > 0),
    [rpcUrls],
  );
  const primaryRpcEndpoint = sanitizedRpcUrls[0] ?? '';
  const fallbackRpcEndpoints = sanitizedRpcUrls.slice(1);
  const explorerHomepageDisplay = resolvedExplorerHomepageUrl.replace(/^https?:\/\//, '');
  const normalizedExplorerHomepageUrl = sanitizeUrl(resolvedExplorerHomepageUrl);
  const [isAddingToMetaMask, setIsAddingToMetaMask] = useState(false);
  const [metaMaskFeedback, setMetaMaskFeedback] = useState<MetaMaskFeedback | null>(null);
  const metaMaskChainConfig = useMemo<AddEthereumChainParameter | null>(() => {
    if (!chainId || sanitizedRpcUrls.length === 0) {
      return null;
    }

    const rpcEndpoints = sanitizedRpcUrls;
    const explorerUrls = (() => {
      const sanitized = sanitizeUrl(resolvedExplorerHomepageUrl);
      return sanitized ? [sanitized] : undefined;
    })();

    return {
      chainId,
      chainName: networkName,
      nativeCurrency: {
        name: nativeCurrency.name,
        symbol: nativeCurrency.symbol,
        decimals: nativeCurrency.decimals,
      },
      rpcUrls: rpcEndpoints,
      blockExplorerUrls: explorerUrls,
    };
  }, [chainId, nativeCurrency.decimals, nativeCurrency.name, nativeCurrency.symbol, networkName, resolvedExplorerHomepageUrl, sanitizedRpcUrls]);

  const ethereumProvider: EthereumProvider | null =
    typeof window !== 'undefined'
      ? ((window as typeof window & { ethereum?: EthereumProvider }).ethereum ?? null)
      : null;

  const canRequestMetaMask = Boolean(metaMaskChainConfig && ethereumProvider?.request);
  const metaMaskStatus = metaMaskFeedback ?? (!metaMaskChainConfig ? 'config' : !ethereumProvider?.request ? 'unavailable' : null);
  const metaMaskMessage =
    metaMaskStatus === 'success'
      ? t('details.walletSetup.metamaskSuccess')
      : metaMaskStatus === 'error'
      ? t('details.walletSetup.metamaskError')
      : metaMaskStatus === 'unavailable'
      ? t('details.walletSetup.metamaskUnavailable')
      : metaMaskStatus === 'config'
      ? t('details.walletSetup.metamaskConfigError')
      : null;
  const metaMaskButtonLabel = isAddingToMetaMask
    ? t('details.walletSetup.buttonLoading')
    : t('details.walletSetup.button');
  const isMetaMaskButtonDisabled = isAddingToMetaMask || !canRequestMetaMask;
  const metaMaskFeedbackModifier =
    metaMaskStatus === 'success' ? 'success' : metaMaskStatus === 'error' ? 'error' : null;

  const handleAddToMetaMask = async () => {
    if (!metaMaskChainConfig) {
      setMetaMaskFeedback('config');
      return;
    }

    if (!ethereumProvider?.request) {
      setMetaMaskFeedback('unavailable');
      return;
    }

    setIsAddingToMetaMask(true);
    setMetaMaskFeedback(null);

    try {
      await ethereumProvider.request({
        method: 'wallet_addEthereumChain',
        params: [metaMaskChainConfig],
      });
      setMetaMaskFeedback('success');
    } catch (error) {
      console.warn('Unable to add network to MetaMask', error);
      setMetaMaskFeedback('error');
    } finally {
      setIsAddingToMetaMask(false);
    }
  };

  useEffect(() => {
    setMetaMaskFeedback(null);
    setIsAddingToMetaMask(false);
  }, [token.symbol]);

  return (
    <main className="token-details" aria-live="polite">
      <button type="button" className="token-details__back" onClick={handleBackClick}>
        <span aria-hidden="true" className="token-details__back-icon">
          <svg viewBox="0 0 20 20" focusable="false">
            <path
              d="M12.5 5.5 7.5 10l5 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {t('details.back')}
      </button>

      <section className="token-details__header">
        <div className="token-details__identity">
          <img src={token.logo} alt={`${token.name} logo`} className="token-details__logo" loading="lazy" />
          <div>
            <h2 className="token-details__title">{token.name}</h2>
            <p className="token-details__symbol">{token.symbol}</p>
          </div>
        </div>
        <div className="token-details__pricing">
          <span className="token-details__price">
            {formatCurrency(derivedPriceData?.usd ?? token.price, locale, {
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}
          </span>
          {changeDisplay ? (
            <span className={`token-details__change ${changeClass}`}>{changeDisplay}</span>
          ) : null}
          <div className="token-details__price-tags">
            {derivedPriceData?.cop ? (
              <span>
                {formatCurrency(derivedPriceData.cop, locale, {
                  currency: 'COP',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </span>
            ) : null}
            {derivedPriceData?.btc ? (
              <span>
                {formatCrypto(derivedPriceData.btc, locale, {
                  symbol: 'BTC',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 8,
                })}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <article className="token-details__card token-details__card--wallet">
        <div className="token-details__wallet-info">
          <img
            src={token.logo}
            alt={`${token.name} logo`}
            className="token-details__wallet-logo"
            loading="lazy"
          />
          <div>
            <h3 className="token-details__wallet-title">{t('details.walletSetup.title', { network: networkName })}</h3>
          </div>
        </div>
        <div className="token-details__wallet-actions">
          <div className="token-details__wallet-cta">
            <button
              type="button"
              className="token-details__wallet-button"
              onClick={handleAddToMetaMask}
              disabled={isMetaMaskButtonDisabled}
            >
              <span
                aria-hidden="true"
                className="token-details__wallet-button-icon token-details__wallet-button-icon--metamask"
              >
                <MetaMaskIcon />
              </span>
              {metaMaskButtonLabel}
            </button>
            {metaMaskMessage ? (
              <p
                className={`token-details__wallet-feedback${
                  metaMaskFeedbackModifier ? ` token-details__wallet-feedback--${metaMaskFeedbackModifier}` : ''
                }`}
                role={metaMaskStatus === 'error' ? 'alert' : undefined}
              >
                {metaMaskMessage}
              </p>
            ) : null}
          </div>
          <div className="token-details__wallet-resources">
            {primaryRpcEndpoint ? (
              <div className="token-details__wallet-resource">
                <span className="token-details__wallet-resource-label">{t('details.walletSetup.rpcLabel')}</span>
                <code className="token-details__wallet-resource-value">{primaryRpcEndpoint}</code>
              </div>
            ) : null}
            {fallbackRpcEndpoints.length > 0 ? (
              <div className="token-details__wallet-resource">
                <span className="token-details__wallet-resource-label">{t('details.walletSetup.moreRpcLabel')}</span>
                <ul className="token-details__wallet-rpc-list">
                  {fallbackRpcEndpoints.map((url) => (
                    <li key={url}>
                      <code>{url}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {normalizedExplorerHomepageUrl ? (
              <div className="token-details__wallet-resource">
                <span className="token-details__wallet-resource-label">{t('details.walletSetup.explorerLabel')}</span>
                <a
                  href={normalizedExplorerHomepageUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="token-details__wallet-explorer"
                >
                  <code>{explorerHomepageDisplay}</code>
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </article>

      {isLoading ? <p className="app__status app__status--loading">{t('status.loading')}</p> : null}
      {errorKey ? <p className="app__status app__status--error">{t(errorKey)}</p> : null}

      <section className="token-details__grid">
        {token.isNative ? (
          <article className="token-details__card token-details__card--native">
            <span className="token-details__native-chip">{t('details.nativeHighlightBadge')}</span>
            <h3 className="token-details__native-title">{t('details.nativeHighlightTitle')}</h3>
            <p className="token-details__native-description">{t('details.nativeHighlightDescription')}</p>
          </article>
        ) : null}

        <article className="token-details__card">
          <h3>{t('details.marketData')}</h3>
          <dl className="token-details__metrics">
            {marketMetrics.map((metric) => (
              <div key={metric.key} className="token-details__metric">
                <dt>{t(`details.metricLabels.${metric.key}`)}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="token-details__card">
          <h3>{t('details.supply')}</h3>
          <dl className="token-details__metrics">
            {supplyMetrics.map((metric) => (
              <div key={metric.key} className="token-details__metric">
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="token-details__card token-details__card--prices">
          <h3>{t('details.prices')}</h3>
          <div className="token-details__oracle-status" role="status">
            <span className={`token-details__oracle-badge ${oracleBadgeClass}`}>{oracleStatusLabel}</span>
            <span className="token-details__oracle-updated">{oracleUpdatedLabel}</span>
          </div>
          <p className="token-details__oracle-hint">{oracleHint}</p>
          <ul className="token-details__price-list">
            {priceRows.map((row) => {
              const tooltipId = `price-tooltip-${row.key}`;

              return (
                <li key={row.key}>
                  <span
                    className="token-details__price-label"
                    tabIndex={0}
                    aria-describedby={tooltipId}
                    title={row.description}
                  >
                    {row.label}
                    <span id={tooltipId} role="tooltip" className="token-details__price-tooltip">
                      {row.description}
                    </span>
                  </span>
                  <span className="token-details__price-value">{row.value}</span>
                </li>
              );
            })}
          </ul>
          {!hasOracleData && priceRows.length === 0 ? (
            <p className="token-details__placeholder">{t('details.pricesUnavailable')}</p>
          ) : null}
        </article>

        {shouldRenderContractCard ? (
          <article className="token-details__card">
            <h3>{t('details.contract')}</h3>
            <dl className="token-details__metrics">
              {token.isNative && hasNativeContractInfo ? (
                <div className="token-details__metric">
                  <dt>{t('details.accountsExplorer')}</dt>
                  <dd>
                    <a
                      className="token-details__address-link"
                      href={nativeAccountsExplorerUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={explorerLabel}
                      title={nativeAccountsExplorerUrl}
                    >
                      <code className="token-details__address-code">{nativeAccountsExplorerDisplay}</code>
                      <span aria-hidden="true" className="token-details__external-icon">
                        <svg viewBox="0 0 16 16" focusable="false">
                          <path
                            d="M6.25 3.5h6.25v6.25"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.75 6.25 3.5 12.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </a>
                  </dd>
                </div>
              ) : null}
              {!token.isNative ? (
                <div className="token-details__metric">
                  <dt>{t('details.address')}</dt>
                  <dd>
                    <a
                      className="token-details__address-link"
                      href={explorerUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={explorerLabel}
                      title={token.address}
                    >
                      <code className="token-details__address-code">{explorerDisplay}</code>
                      <span aria-hidden="true" className="token-details__external-icon">
                        <svg viewBox="0 0 16 16" focusable="false">
                          <path
                            d="M6.25 3.5h6.25v6.25"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.75 6.25 3.5 12.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </a>
                  </dd>
                </div>
              ) : null}
              {derivedPriceData?.wallet ? (
                <div className="token-details__metric">
                  <dt>{t('details.oracleWallet')}</dt>
                  <dd>
                    <code>{derivedPriceData.wallet}</code>
                  </dd>
                </div>
              ) : null}
            </dl>
          </article>
        ) : null}

        {qrImageUrl ? (
          <article className="token-details__card token-details__card--qr">
            <h3>{t('details.contractQr')}</h3>
            <p className="token-details__qr-description">{t('details.contractQrDescription')}</p>
            <img
              className="token-details__qr-image"
              src={qrImageUrl}
              alt={t('details.contractQrAlt', { token: token.symbol })}
              loading="lazy"
            />
            <p className="token-details__qr-address">
              <span className="token-details__qr-address-label">{t('details.address')}</span>
              <code>{token.address}</code>
            </p>
          </article>
        ) : null}

        {socialLinks.length > 0 ? (
          <article className="token-details__card token-details__card--socials">
            <h3>{t('details.socials')}</h3>
            <ul className="token-details__social-list">
              {socialLinks.map((item) => (
                <li key={item.key}>
                  <a
                    className="token-details__social-link"
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={item.description}
                    title={item.label}
                  >
                    <span aria-hidden="true" className="token-details__social-icon">
                      {item.renderIcon()}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </article>
        ) : null}
        {shouldRenderWebsiteSection ? (
          <article className="token-details__card token-details__card--website">
            <h3>{t('details.website')}</h3>
            <div className="token-details__link-list">
              {websiteLinks.map((link) => (
                <a
                  key={link.key}
                  className="token-details__link"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span aria-hidden="true" className="token-details__link-icon">
                    <WebsiteLinkIcon type={link.icon} />
                  </span>
                  <span className="token-details__link-label">{link.label}</span>
                </a>
              ))}
            </div>
          </article>
        ) : null}
      </section>

      {token.description ? (
        <section className="token-details__about">
          <h3>{t('details.about', { token: token.name })}</h3>
          <p>{token.description}</p>
        </section>
      ) : null}
    </main>
  );
};

export default TokenDetails;
