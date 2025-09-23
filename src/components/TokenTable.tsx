import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Token } from '../types/token.ts';
import { formatCompactNumber, formatCurrency, formatPercentage } from '../utils/format.ts';
import './TokenTable.css';

type TokenTableProps = {
  tokens: Token[];
  locale: string;
};

export const TokenTable = ({ tokens, locale }: TokenTableProps) => {
  const { t } = useTranslation();

  const sortedTokens = useMemo(() => tokens, [tokens]);

  if (!sortedTokens.length) {
    return <p className="token-table__empty">{t('table.empty')}</p>;
  }

  return (
    <div className="token-table__container">
      <table className="token-table">
        <thead>
          <tr>
            <th>{t('table.headers.asset')}</th>
            <th>{t('table.headers.price')}</th>
            <th>{t('table.headers.marketCap')}</th>
            <th>{t('table.headers.volume24h')}</th>
            <th>{t('table.headers.change24h')}</th>
            <th className="token-table__website-header">{t('table.headers.website')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedTokens.map((token) => {
            const changeClass = token.change24h >= 0 ? 'positive' : 'negative';
            return (
              <tr key={token.symbol}>
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
                <td>{formatCurrency(token.price, locale)}</td>
                <td>{formatCompactNumber(token.marketCap, locale)}</td>
                <td>{formatCompactNumber(token.volume24h, locale)}</td>
                <td>
                  <span className={`token-table__change ${changeClass}`}>
                    {formatPercentage(token.change24h, locale)}
                  </span>
                </td>
                <td className="token-table__website-cell">
                  <a
                    className="token-table__link"
                    href={token.website}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {t('table.visitSite')}
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
