import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { platformName } from '../config/environment.ts';
import { useTokenDetails } from '../hooks/useTokensData.ts';
import type { Token } from '../types/token.ts';
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

const buildExplorerUrl = (address: string) => `https://explorador.scolcoin.com/token/${address}`;
const nativeAccountsExplorerUrl = 'https://explorador.scolcoin.com/accounts';
const nativeAccountsExplorerDisplay = nativeAccountsExplorerUrl.replace(/^https?:\/\//, '');

const buildPriceRows = (priceData: TokenPrice | null, token: Token, locale: string) => {
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

  const priceRows = useMemo(
    () => (token ? buildPriceRows(priceData, token, locale) : []),
    [locale, priceData, token],
  );

  const marketMetrics = useMemo(
    () => (token ? buildMarketMetrics(token, locale, lastUpdatedLabel) : []),
    [lastUpdatedLabel, locale, token],
  );

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
  const explorerUrl = useMemo(
    () => (token.isNative ? nativeAccountsExplorerUrl : buildExplorerUrl(token.address)),
    [token.address, token.isNative],
  );
  const explorerDisplay = useMemo(
    () => (token.isNative ? nativeAccountsExplorerDisplay : shortenAddress(token.address)),
    [token.address, token.isNative],
  );
  const explorerLabel = useMemo(
    () =>
      token.isNative
        ? t('details.openAccountsExplorer')
        : `${t('details.openInExplorer', { token: token.symbol })}. ${token.address}`,
    [t, token.address, token.isNative, token.symbol],
  );

  const shouldRenderContractCard = !token.isNative || Boolean(derivedPriceData?.wallet);

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
            {priceRows.map((row) => (
              <li key={row.key}>
                <span className="token-details__price-label">{row.label}</span>
                <span className="token-details__price-value">{row.value}</span>
              </li>
            ))}
          </ul>
          {!hasOracleData && priceRows.length === 0 ? (
            <p className="token-details__placeholder">{t('details.pricesUnavailable')}</p>
          ) : null}
        </article>

        {shouldRenderContractCard ? (
          <article className="token-details__card">
            <h3>{t('details.contract')}</h3>
            <dl className="token-details__metrics">
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
        {token.website ? (
          <article className="token-details__card token-details__card--website">
            <h3>{t('details.website')}</h3>
            <a
              className="token-details__link"
              href={token.website}
              target="_blank"
              rel="noreferrer noopener"
            >
              {t('details.visitWebsite')}
            </a>
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
