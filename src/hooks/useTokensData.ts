
import { useEffect, useMemo, useState } from 'react';
import { priceContractAddress, rpcUrl } from '../config/environment.ts';
import { getConfiguredTokens } from '../config/tokens.ts';
import type { Token } from '../types/token.ts';
import type { TokenPrice } from '../types/price.ts';
import { fetchOnChainPrice } from '../services/priceClient.ts';

type UseTokenListResult = {
  tokens: Token[];
  isLoading: boolean;
  errorKey: string | null;
  lastUpdated: Date | null;
};

type UseTokenDetailsResult = {
  token: Token | null;
  priceData: TokenPrice | null;
  isLoading: boolean;
  errorKey: string | null;
  lastUpdated: Date | null;
};

export const useTokenList = (): UseTokenListResult => {
  const tokens = useMemo(() => getConfiguredTokens(), []);

  return {
    tokens,
    isLoading: false,
    errorKey: null,
    lastUpdated: null,
  };
};

export const useTokenDetails = (symbol?: string): UseTokenDetailsResult => {
  const tokens = useMemo(() => getConfiguredTokens(), []);
  const token = useMemo(() => {
    if (!symbol) {
      return null;
    }

    const normalized = symbol.toLowerCase();
    return tokens.find((item) => item.symbol.toLowerCase() === normalized) ?? null;
  }, [symbol, tokens]);

  const [priceData, setPriceData] = useState<TokenPrice | null>(() => token?.priceData ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setPriceData(token?.priceData ?? null);
    setLastUpdated(null);
    setErrorKey(null);
    setIsLoading(false);

    if (!token) {
      setIsLoading(false);
      return;
    }

    if (!priceContractAddress || !rpcUrl) {
      if (!token.priceData) {
        setErrorKey('status.missingConfig');
      }
      setIsLoading(false);
      return;
    }

    const lookupKey = (token.priceId ?? token.name).trim();
    if (!lookupKey) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const refresh = async () => {
      setIsLoading(true);

      try {
        const data = await fetchOnChainPrice(lookupKey);
        if (cancelled) {
          return;
        }

        if (data && data.status) {
          setPriceData(data);
          setLastUpdated(new Date());
        } else if (!token.priceData) {
          setErrorKey('status.error');
        }
      } catch (error) {
        if (!cancelled && !token.priceData) {
          setErrorKey('status.error');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    refresh();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return {
    token,
    priceData,
    isLoading,
    errorKey,
    lastUpdated,

  };
};
