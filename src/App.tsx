import { useEffect, useMemo, useState } from 'react';
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

const THEME_STORAGE_KEY = 'scolmarkets-theme';

const getPreferredTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

function App() {
  const { t, i18n } = useTranslation();
  const { tokens, isLoading, errorKey, lastUpdated } = useTokensData();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getPreferredTheme());
  const tokenCount = tokens.length;
  const fallbackUpdate = t('stats.notAvailable');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getPreferredTheme());

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
    [formattedUpdate, i18n.language, t, tokenCount],
  );

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${theme}`);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const handleThemeChange = (value: 'light' | 'dark') => {
    setTheme(value);
  };

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <p className="app__network">{networkName}</p>
          <h1 className="app__title">{t('title', { platform: platformName })}</h1>
          <p className="app__subtitle">{t('subtitle', { network: networkName })}</p>
        </div>
        <div className="app__controls">
          <div className="app__theme-toggle" role="group" aria-label="Theme selection">
            <button
              type="button"
              className={`app__theme-button ${theme === 'light' ? 'is-active' : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              Light
            </button>
            <button
              type="button"
              className={`app__theme-button ${theme === 'dark' ? 'is-active' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              Dark
            </button>
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
        </div>
      </header>

      <section className="app__stats">
        {statCards.map((stat) => (
          <article
            key={stat.key}
            className={`app__stat ${stat.isWide ? 'app__stat--wide' : ''}`}
          >
            <span className="app__stat-icon" aria-hidden="true">
              {stat.icon}
            </span>
            <div className="app__stat-content">
              <span className="app__stat-value">{stat.value}</span>
              {stat.label ? <span className="app__stat-label">{stat.label}</span> : null}
              {stat.description ? (
                <p className="app__stat-description">{stat.description}</p>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      <main aria-busy={isLoading} aria-live="polite">
        {errorKey ? (
          <p className="app__status app__status--error">{t(errorKey)}</p>
        ) : null}
        <TokenTable tokens={tokens} locale={i18n.language} />
      </main>

      <footer className="app__footer">{t('footer')}</footer>

      {isLoading ? (
        <div className="app__overlay" role="status" aria-live="assertive">
          <div className="app__overlay-card">
            <div className="app__overlay-spinner" aria-hidden="true" />
            <h2 className="app__overlay-title">{t('status.processing')}</h2>
            <p className="app__overlay-description">{t('status.processingDescription')}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
