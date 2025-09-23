import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Token } from '../types/token.ts';
import { formatCompactNumber, formatCrypto, formatCurrency } from '../utils/format.ts';
import './TokenTable.css';

type TokenTableProps = {
  tokens: Token[];
  locale: string;
};

export const TokenTable = ({ tokens, locale }: TokenTableProps) => {
  const { t } = useTranslation();
  const [hasAnimated, setHasAnimated] = useState(false);

  const sortedTokens = useMemo(() => tokens, [tokens]);
  useEffect(() => {
    if (!sortedTokens.length) {
      if (hasAnimated) {
        setHasAnimated(false);
      }
      return;
    }

    if (hasAnimated) {
      return;
    }

    const animationFrame = requestAnimationFrame(() => {
      setHasAnimated(true);
    });

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [hasAnimated, sortedTokens.length]);

  const formatSupply = (value: Token['totalSupply']) =>
    value === null || value === undefined ? '—' : formatCompactNumber(value, locale);

  if (!sortedTokens.length) {
    return (
      <div className="token-table__empty" role="status" aria-live="polite">
        <span className="token-table__empty-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" focusable="false">
            <rect
              x="6"
              y="12"
              width="36"
              height="26"
              rx="4"
              fill="currentColor"
              opacity="0.08"
            />
            <path
              d="M14 21.5h8M14 28h4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M24.5 28H34L30.5 22l-3.5 6Z"
              fill="currentColor"
              opacity="0.22"
            />
          </svg>
        </span>
        <p className="token-table__empty-text">{t('table.empty')}</p>
      </div>
    );
  }

  const renderPrice = (token: Token) => {
    const priceEntries = token.priceData
      ? [
          {
            key: 'usd',
            value: token.priceData.usd,
            formatter: (amount: number) =>
              formatCurrency(amount, locale, {
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              }),
            className: 'token-table__price-item--primary',
          },
          {
            key: 'cop',
            value: token.priceData.cop,
            formatter: (amount: number) =>
              formatCurrency(amount, locale, {
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }),
            className: 'token-table__price-item--secondary',
          },
          {
            key: 'btc',
            value: token.priceData.btc,
            formatter: (amount: number) =>
              formatCrypto(amount, locale, {
                symbol: 'BTC',
                minimumFractionDigits: 0,
                maximumFractionDigits: 8,
              }),
            className: 'token-table__price-item--secondary token-table__price-item--btc',
          },
        ]
      : [
          {
            key: 'usd-fallback',
            value: token.price,
            formatter: (amount: number) =>
              formatCurrency(amount, locale, {
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              }),
            className: 'token-table__price-item--primary',
          },
        ];

    const items = priceEntries
      .filter(({ value }) => Number.isFinite(value))
      .map((entry) => (
        <span key={entry.key} className={`token-table__price-item ${entry.className}`}>
          {entry.formatter(entry.value)}
        </span>
      ));

    if (!items.length) {
      return (
        <div className="token-table__price">
          <span className="token-table__price-item token-table__price-item--primary">—</span>
        </div>
      );
    }

    return <div className="token-table__price">{items}</div>;
  };

  return (
    <div className="token-table__container">
      <table className={`token-table${hasAnimated ? ' token-table--animated' : ''}`}>
        <thead>
          <tr>
            <th>{t('table.headers.asset')}</th>
            <th className="token-table__numeric">{t('table.headers.price')}</th>
            <th className="token-table__numeric">{t('table.headers.marketCap')}</th>
            <th className="token-table__numeric">{t('table.headers.totalSupply')}</th>
            <th className="token-table__numeric">{t('table.headers.circulatingSupply')}</th>
            <th className="token-table__website-header">{t('table.headers.website')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedTokens.map((token, index) => {
            const rowStyle = { '--row-index': index } as CSSProperties;
            return (
              <tr key={token.symbol} className="token-table__row" style={rowStyle}>
                <td>
                  <div className="token-table__asset">
                    <img
                      src={token.logo}
                      alt={`${token.name} logo`}
                      className="token-table__logo"
                      loading="lazy"
                    />
                    <div>
                      <div className="token-table__asset-title">
                        <span className="token-table__asset-name">{token.name}</span>
                        <span className="token-table__asset-symbol">{token.symbol}</span>
                        {token.isNative ? (
                          <span className="token-table__badge">{t('table.nativeBadge')}</span>
                        ) : null}
                      </div>
                      <p className="token-table__description">{token.description}</p>
                    </div>
                  </div>
                </td>
                <td className="token-table__numeric token-table__price-cell">{renderPrice(token)}</td>
                <td className="token-table__numeric">{formatCompactNumber(token.marketCap, locale)}</td>
                <td className="token-table__numeric">{formatSupply(token.totalSupply)}</td>
                <td className="token-table__numeric">{formatSupply(token.circulatingSupply)}</td>
                <td className="token-table__website-cell">
                  <a
                    className="token-table__link"
                    href={token.website}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span className="token-table__link-icon" aria-hidden="true">
                      <svg viewBox="0 0 20 20" focusable="false">
                        <path
                          d="M7.5 12.5 12.5 7.5M8 7.5h4.5V12"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 4.5H5.75A1.75 1.75 0 0 0 4 6.25v7.5A1.75 1.75 0 0 0 5.75 15.5h7.5a1.75 1.75 0 0 0 1.75-1.75V11"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.7"
                        />
                      </svg>
                    </span>
                    <span className="token-table__link-text">{t('table.visitSite')}</span>
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TokenTable;
