import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { networkName, platformName } from './config/environment.ts';
import type { Token } from './types/token.ts';
import HomeView from './pages/HomeView.tsx';
import TokenDetails from './pages/TokenDetails.tsx';
import './App.css';

const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
  { code: 'de', label: 'Deutsch' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ru', label: 'Русский' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ar', label: 'العربية' },
];

const THEME_STORAGE_KEY = 'scolmarkets-theme';

type AppRoute = { name: 'home' } | { name: 'token'; symbol: string };

const normalizePath = (pathname: string): string => {
  if (!pathname) {
    return '/';
  }

  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed || '/';
};

const parseRoute = (pathname: string): AppRoute => {
  const normalized = normalizePath(pathname);

  const extractTokenSymbol = (prefix: string) => {
    if (!normalized.startsWith(prefix)) {
      return null;
    }

    const parts = normalized.split('/');
    const symbol = parts[2];
    return symbol ? decodeURIComponent(symbol) : null;
  };

  const currencySymbol = extractTokenSymbol('/currencies/');
  if (currencySymbol) {
    return { name: 'token', symbol: currencySymbol };
  }

  const legacySymbol = extractTokenSymbol('/token/');
  if (legacySymbol) {
    return { name: 'token', symbol: legacySymbol };
  }

  return { name: 'home' };
};

const routeToPath = (route: AppRoute): string => {
  if (route.name === 'token') {
    return `/currencies/${encodeURIComponent(route.symbol)}`;
  }

  return '/';
};

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
  const [route, setRoute] = useState<AppRoute>(() => {
    if (typeof window === 'undefined') {
      return { name: 'home' };
    }

    return parseRoute(window.location.pathname);
  });

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${theme}`);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handlePopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleThemeChange = (value: 'light' | 'dark') => {
    setTheme(value);
  };

  const navigate = (next: AppRoute) => {
    if (typeof window !== 'undefined') {
      const targetPath = routeToPath(next);
      const currentPath = normalizePath(window.location.pathname);
      if (targetPath !== currentPath) {
        window.history.pushState({ route: next }, '', targetPath);
      }
    }

    setRoute(next);
  };

  const handleTokenSelect = (token: Token) => {
    navigate({ name: 'token', symbol: token.symbol.toLowerCase() });
  };

  const handleBackToOverview = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
      return;
    }

    navigate({ name: 'home' });
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

      {route.name === 'home' ? (
        <HomeView onTokenSelect={handleTokenSelect} />
      ) : (
        <TokenDetails symbol={route.symbol} onBack={handleBackToOverview} />
      )}

      <footer className="app__footer">{t('footer')}</footer>
    </div>
  );
}

export default App;
