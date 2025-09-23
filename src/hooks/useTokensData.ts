import { useMemo } from 'react';
import { getConfiguredTokens, sortTokens } from '../config/tokens.ts';
import type { Token } from '../types/token.ts';

type UseTokensDataResult = {
  tokens: Token[];
  isLoading: boolean;
  errorKey: string | null;
  lastUpdated: Date | null;
};

export const useTokensData = (): UseTokensDataResult => {
  const tokens = useMemo(() => sortTokens(getConfiguredTokens()), []);

  return {
    tokens,
    isLoading: false,
    errorKey: null,
    lastUpdated: null,
  };
};
