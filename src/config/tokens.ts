import type { Token } from '../types/token.ts';

const rawTokens = import.meta.env.VITE_TOKENS_DATA;

const safeParseTokens = (): Token[] => {
  if (!rawTokens) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawTokens) as Token[];
    return parsed.map((token) => ({
      ...token,
      isNative: token.symbol.toUpperCase() === 'SCOL',
    }));
  } catch (error) {
    console.warn('Unable to parse token configuration from environment', error);
    return [];
  }
};

export const tokens: Token[] = safeParseTokens().sort((a, b) => {
  if (a.isNative && !b.isNative) return -1;
  if (!a.isNative && b.isNative) return 1;
  return a.marketCap < b.marketCap ? 1 : -1;
});
