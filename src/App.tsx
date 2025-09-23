import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { networkName, platformName } from './config/environment.ts';
import { tokens } from './config/tokens.ts';
import TokenTable from './components/TokenTable.tsx';
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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getPreferredTheme());
  const lastUpdated = useMemo(() => new Date(), []);
  const formattedUpdate = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.language, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(lastUpdated),
    [i18n.language, lastUpdated],
  );

  useEffect(() => {
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
        <div className="app__stat">
          <span className="app__stat-value">{tokens.length}</span>
          <span className="app__stat-label">{t('stats.listed', { count: tokens.length })}</span>
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
        <TokenTable tokens={tokens} locale={i18n.language} />
      </main>

      <footer className="app__footer">{t('footer')}</footer>
    </div>
  );
}

export default App;
