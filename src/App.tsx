import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { networkName, platformName } from './config/environment.ts';
import TokenTable from './components/TokenTable.tsx';
import { useTokensData } from './hooks/useTokensData.ts';
import './App.css';

const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'zh', label: '中文' },
  { code: 'ru', label: 'Русский' },
  { code: 'ar', label: 'العربية' },
  { code: 'de', label: 'Deutsch' },
];

function App() {
  const { t, i18n } = useTranslation();
  const { tokens, isLoading, errorKey, lastUpdated } = useTokensData();
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

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <p className="app__network">{networkName}</p>
          <h1 className="app__title">{t('title', { platform: platformName })}</h1>
          <p className="app__subtitle">{t('subtitle', { network: networkName })}</p>
        </div>
        <div className="app__language">
          <label className="app__language-label" htmlFor="language-select">
            {t('languageLabel')}
          </label>
          <select
            id="language-select"
            className="app__language-select"
            value={i18n.language}
            onChange={(event) => i18n.changeLanguage(event.target.value)}
          >
            {languageOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="app__stats">
        <div className="app__stat">
          <span className="app__stat-value">{tokenCount}</span>
          <span className="app__stat-label">{t('stats.listed', { count: tokenCount })}</span>
        </div>
        <div className="app__stat">
          <span className="app__stat-value">{formattedUpdate}</span>
          <span className="app__stat-label">{t('stats.lastUpdated')}</span>
        </div>
        <div className="app__stat app__stat--disclaimer">
          <span className="app__stat-label">{t('stats.disclaimer')}</span>
        </div>
      </section>

      <main>
        {isLoading ? (
          <p className="app__status app__status--loading">{t('status.loading')}</p>
        ) : null}
        {errorKey ? (
          <p className="app__status app__status--error">{t(errorKey)}</p>
        ) : null}
        <TokenTable tokens={tokens} locale={i18n.language} />
      </main>

      <footer className="app__footer">{t('footer')}</footer>
    </div>
  );
}

export default App;
