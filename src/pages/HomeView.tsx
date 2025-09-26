import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Token } from '../types/token.ts';
import TokenTable from '../components/TokenTable.tsx';
import { useTokenList } from '../hooks/useTokensData.ts';

type HomeViewProps = {
  onTokenSelect: (token: Token) => void;
};

export const HomeView = ({ onTokenSelect }: HomeViewProps) => {
  const { t, i18n } = useTranslation();
  const { tokens, isLoading, errorKey, lastUpdated } = useTokenList();
  const tokenCount = tokens.length;
  const fallbackUpdate = t('stats.notAvailable');

  const formattedUpdate = useMemo(
    () =>
      lastUpdated
        ? new Intl.DateTimeFormat(i18n.language, {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(lastUpdated)
        : fallbackUpdate,
    [fallbackUpdate, i18n.language, lastUpdated],
  );

  const handleAddNetwork = useCallback(async () => {
    if (typeof window === 'undefined') {
      return;
    }

    type EthereumProvider = {
      request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };

    const { ethereum } = window as typeof window & { ethereum?: EthereumProvider };

    if (!ethereum?.request) {
      window.alert(t('stats.networkUnavailable'));
      return;
    }

    try {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0xffaa',
            chainName: 'Scolcoin Mainnet',
            nativeCurrency: {
              name: 'Scolcoin',
              symbol: 'SCOL',
              decimals: 18,
            },
            rpcUrls: ['https://mainnet-rpc.scolcoin.com'],
            blockExplorerUrls: ['https://explorador.scolcoin.com/'],
            iconUrls: ['https://scolcoin.com/i/network_scol.svg'],
          },
        ],
      });
      window.alert(t('stats.networkSuccess'));
    } catch (error) {
      console.error('Failed to add Scolcoin network', error);
      window.alert(t('stats.networkError'));
    }
  }, [t]);

  const statCards = useMemo(
    () => [
      {
        key: 'listed',
        icon: (
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path
              d="M5 4h14a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2H9.5L5 22v-3.5H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
              fill="currentColor"
              opacity="0.12"
            />
            <path
              d="M7.5 8.5h9M7.5 12h5.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        value: new Intl.NumberFormat(i18n.language).format(tokenCount),
        label: t('stats.listed', { count: tokenCount }),
      },
      {
        key: 'updated',
        icon: (
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.1" />
            <path
              d="M12 7v5l3 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        value: formattedUpdate,
        label: t('stats.lastUpdated'),
      },
      {
        key: 'network',
        icon: (
          <img
            src="https://scolcoin.com/i/network_scol.svg"
            alt={t('stats.networkAlt')}
            width={28}
            height={28}
            loading="lazy"
          />
        ),
        value: t('stats.networkValue'),
        label: t('stats.networkLabel'),
        description: t('stats.networkDescription'),
        action: (
          <button type="button" className="app__stat-action" onClick={handleAddNetwork}>
            <svg
              className="app__stat-action-icon"
              viewBox="0 0 24 24"
              focusable="false"
              aria-hidden="true"
            >
              <path
                d="m7 12 3.5 3.5L17 9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t('stats.networkButton')}
          </button>
        ),
      },
      {
        key: 'disclaimer',
        icon: (
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path
              d="M12 3.5 3.5 9v6L12 20.5 20.5 15V9L12 3.5Z"
              fill="currentColor"
              opacity="0.12"
            />
            <path
              d="M12 10.5v4M12 8.5v.01"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        value: t('stats.disclaimerTitle'),
        description: t('stats.disclaimer'),
        isWide: true,
      },
    ],
    [formattedUpdate, handleAddNetwork, i18n.language, t, tokenCount],
  );

  return (
    <>
      <section className="app__stats">
        {statCards.map((stat) => (
          <article key={stat.key} className={`app__stat ${stat.isWide ? 'app__stat--wide' : ''}`}>
            <span className="app__stat-icon" aria-hidden="true">
              {stat.icon}
            </span>
            <div className="app__stat-content">
              <span className="app__stat-value">{stat.value}</span>
              {stat.label ? <span className="app__stat-label">{stat.label}</span> : null}
              {stat.description ? (
                <p className="app__stat-description">{stat.description}</p>
              ) : null}
              {stat.action ? <div className="app__stat-actions">{stat.action}</div> : null}
            </div>
          </article>
        ))}
      </section>

      <main aria-busy={isLoading} aria-live="polite">
        {errorKey ? <p className="app__status app__status--error">{t(errorKey)}</p> : null}
        <TokenTable tokens={tokens} locale={i18n.language} onTokenSelect={onTokenSelect} />
      </main>

      {isLoading ? (
        <div className="app__overlay" role="status" aria-live="assertive">
          <div className="app__overlay-card">
            <div className="app__overlay-spinner" aria-hidden="true" />
            <h2 className="app__overlay-title">{t('status.processing')}</h2>
            <p className="app__overlay-description">{t('status.processingDescription')}</p>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default HomeView;
