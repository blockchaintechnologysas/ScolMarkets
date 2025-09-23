import type { Token } from '../types/token.ts';

const rawTokens = import.meta.env.VITE_TOKENS_DATA;

const derivePriceId = (name: string) => name.replace(/\s+/g, '').toUpperCase();

type TokenConfiguration = Omit<Token, 'isNative' | 'priceData' | 'priceId'> & {
  priceId?: string;
};

export const sortTokens = (list: Token[]): Token[] =>
  [...list].sort((a, b) => {
    if (a.isNative && !b.isNative) return -1;
    if (!a.isNative && b.isNative) return 1;
    return a.marketCap < b.marketCap ? 1 : -1;
  });

const safeParseTokens = (): Token[] => {
  if (!rawTokens) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawTokens) as TokenConfiguration[];
    return parsed.map((token) => {
      const symbol = token.symbol ?? '';
      const name = token.name ?? '';
      const priceId =
        token.priceId && token.priceId.trim().length > 0
          ? token.priceId.trim()
          : derivePriceId(name);

      return {
        ...token,
        symbol,
        name,
        priceId,
        isNative: symbol.toUpperCase() === 'SCOL',
      } as Token;
    });

  } catch (error) {
    console.warn('Unable to parse token configuration from environment', error);
    return [];
  }
};

export const getConfiguredTokens = (): Token[] => sortTokens(safeParseTokens());
