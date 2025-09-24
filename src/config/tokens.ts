import type { Token, TokenSocialKey, TokenSocialLinks } from '../types/token.ts';

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

const socialKeys: TokenSocialKey[] = [
  'facebook',
  'instagram',
  'x',
  'youtube',
  'tiktok',
  'reddit',
  'telegram',
  'discord',
];

const sanitizeSocials = (input?: TokenSocialLinks): TokenSocialLinks | undefined => {
  if (!input) {
    return undefined;
  }

  const entries = socialKeys.flatMap((key) => {
    const value = input[key];
    if (typeof value !== 'string') {
      return [];
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }

    return [[key, trimmed] as const];
  });

  if (entries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(entries) as TokenSocialLinks;
};

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

      const socials = sanitizeSocials(token.socials);

      return {
        ...token,
        symbol,
        name,
        priceId,
        isNative: symbol.toUpperCase() === 'SCOL',
        socials,
      } as Token;
    });

  } catch (error) {
    console.warn('Unable to parse token configuration from environment', error);
    return [];
  }
};

export const getConfiguredTokens = (): Token[] => sortTokens(safeParseTokens());
