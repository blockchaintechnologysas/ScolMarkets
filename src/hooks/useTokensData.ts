import { useEffect, useMemo, useState } from 'react';
import { priceContractAddress, rpcUrl } from '../config/environment.ts';
import { getConfiguredTokens, sortTokens } from '../config/tokens.ts';
import type { Token } from '../types/token.ts';
import { fetchOnChainPrice } from '../services/priceClient.ts';

type UseTokensDataResult = {
  tokens: Token[];
  isLoading: boolean;
  errorKey: string | null;
  lastUpdated: Date | null;
};

export const useTokensData = (): UseTokensDataResult => {
  const baseTokens = useMemo(() => getConfiguredTokens(), []);
  const [tokens, setTokens] = useState<Token[]>(baseTokens);
  const [isLoading, setIsLoading] = useState<boolean>(baseTokens.length > 0);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (!baseTokens.length) {
      setIsLoading(false);
      return;
    }

    if (!priceContractAddress || !rpcUrl) {
      setErrorKey('status.missingConfig');
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const refresh = async () => {
      setIsLoading(true);
      let encounteredError = false;

      try {
        const updatedTokens = await Promise.all(
          baseTokens.map(async (token) => {
            const lookupKey = (token.priceId ?? token.name).trim();
            if (!lookupKey) {
              return token;
            }

            try {
              const priceData = await fetchOnChainPrice(lookupKey);
              if (!priceData || !priceData.status) {
                return token;
              }

              return {
                ...token,
                price: priceData.usd,
                priceData,
              };
            } catch (error) {
              console.warn(`Failed to fetch on-chain price for ${token.name}`, error);
              encounteredError = true;
              return token;
            }
          }),
        );

        if (cancelled) {
          return;
        }

        setTokens(sortTokens(updatedTokens));
        setLastUpdated(new Date());
        setErrorKey(encounteredError ? 'status.error' : null);
      } catch (error) {
        console.error('Unable to refresh token prices from the blockchain', error);
        if (cancelled) {
          return;
        }

        setTokens(baseTokens);
        setErrorKey('status.error');
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
  }, [baseTokens, priceContractAddress, rpcUrl]);

  return {
    tokens,
    isLoading,
    errorKey,
    lastUpdated,
  };
};
